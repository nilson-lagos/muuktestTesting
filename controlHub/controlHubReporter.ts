import { Reporter } from '@playwright/test/reporter';
import { getGitContext, getCleanTitlePath } from './gitUtils';
import { api } from './apiUtils';
import { getVideoPath, processVideos, uploadVideosToS3 } from './videoUtils';
import path from 'path';
import crypto from 'crypto';


class MyReporter implements Reporter {

  testExecutionData: any[] = [];
  videos: any[] = [];
  authInfo: any;
  organizationId: string = '';
  executionNumber: number = 0;
  hashIds: any[] = [];
  startExecutionTime: number = 0;
  browser: String = 'chromeTest';
  compilationError: boolean = false;
  filesWithCompilationError: any[] = [];
  url: any;
  testEndPromises: any[] = [];

  private repositoryId!: string;
  private branch!: string;
  private branchCommitSha!: string;
  private repositoryName!: string;
  private access_token!: string;
  private owner!: string;
  private key!: string;

  async onBegin(config: any, suite: any) {
    const context = await getGitContext();
    this.repositoryId = context.repositoryId;
    this.branch = context.branch;
    this.branchCommitSha = context.commitSha;
    this.repositoryName = context.repositoryName;
    this.owner = context.owner;
    this.key = process.env.CONTROLHUB_KEY || '';

    // We need to obtain a token from control hub so we can send API requests. 
    const tokenReponse = await api.post('/validate_key', '', {"key": this.key});
    if(tokenReponse.success && tokenReponse.data){
      this.access_token = tokenReponse.data.access_token;
    } 

    if (!this.access_token) {
      console.warn('Warning: CONTROLHUB_KEY environment variable is not set');
    }

    // We need to call the API to get the execution number here, so we can include it in the feedback data.
    const executionResponse = await api.get('/execution/execution_number', this.access_token);
    if (executionResponse.success && executionResponse.data) {
      this.executionNumber = executionResponse?.data?.executionNumber;
      this.organizationId = executionResponse?.data?.organizationId;
      console.log('Retrieved execution number:', this.executionNumber, 'organizationId:', this.organizationId);
    } else {
      console.error('Failed to retrieve execution number', executionResponse.error);
    }

    console.log(`Starting the test run for branch ${this.branch} at commit ${this.branchCommitSha} in repository ${this.repositoryName} with ID ${this.repositoryId}`);
    
  }

  async onTestBegin(test: any) {
    console.log(`Starting test ${test.title}`);
  }

  async onError(error: any){
    console.log("Tests generated an error during execution. Error = ", error);
    const message = error?.message?.replace(/^(.*: )+/, '').trim();
    this.compilationError = true;
    if(error?.location?.file){
      this.filesWithCompilationError.push({
        "file": error.location.file,
        "message": message,
      });
    }
  }

  async onTestEnd(test: any, result: any) {
    console.log(`Finished test ${test.title} with status ${result.status}`);

     const promise = new Promise(async (resolve, reject) => {
      try {

        // Get clean title path without project name and empty strings
        const filePath = path.basename(test.location.file);
        
        const fileLocation = path.relative(process.cwd(), test.location.file);
        const fullTitle = getCleanTitlePath(test, filePath).join(' '); 

        // Create a unique hash ID for the test using repository ID, file path, full title, and commit SHA
        const rawIdentity = `${this.owner}/${this.repositoryId}:${fileLocation}:${fullTitle}`;   
        const testId = crypto.createHash('sha256').update(rawIdentity).digest('hex');

        const duration = parseInt(result.duration) / 1000;
        const payload = {
          hashId: testId,
          filePath,
          fullTitle,
          duration: duration,
          executionAt: new Date().toISOString(),
          result: result.status === "passed" ? true : false
        };

        this.testExecutionData.push(payload);

        // Collect video for later batch processing
        const videoPath = getVideoPath(result);
        if (videoPath) {
          this.videos.push({ path: videoPath, testId });
        }

      } catch (error) {
        console.log("Error processing test end: ", error);
        reject(error);
      }
      resolve(true);
    });

    // save the promise so the onEnd can wait for this code to complete. 
    this.testEndPromises.push(promise);
  }

  async onEnd(result: any) {
    console.log('Wait for all tests to complete.');
    await Promise.all(this.testEndPromises);
    console.log('All tests have ended, send feedback now.');

    if(this.executionNumber){
      // Process videos and get presigned URLs
      const videoResult = await processVideos(this.videos, this.organizationId, this.executionNumber, this.access_token);

      // Upload videos to S3
      if (videoResult?.uploadUrls) {
        await uploadVideosToS3(videoResult.videos, videoResult.uploadUrls);
      }
      
      const feedbackData = {
        repositoryId: this.repositoryId,
        branch: this.branch,
        branchSha: this.branchCommitSha,
        tests: this.testExecutionData,
        executionNumber: this.executionNumber,
        videos: videoResult?.videos.map(v => v.s3FileName) || [], // Include video file names in feedback
      };

      // Send API to BE here
      const feedbackResponse = await api.post('/execution/feedback', this.access_token, feedbackData);
      if (feedbackResponse.success) {
        console.log('Feedback data sent successfully');
      } else {
        console.error('Failed to send feedback data', feedbackResponse.error);
      }
    } 

  }

}
export default MyReporter;
