import fs from 'fs';
import { api } from './apiUtils';

/**
 * Gets video path from test result attachments
 */
export function getVideoPath(result: any): string {
  const attachment = result.attachments?.find((a: any) => a.name === 'video' || a.path?.endsWith('.webm'));
  return attachment?.path || '';
}

/**
 * Processes videos and requests presigned URLs for upload
 */
export async function processVideos(
  videos: any[],
  organizationId: string,
  executionNumber: number,
  token: string
): Promise<{ videos: any[]; uploadUrls: any[] | null }> {
  let processed: any[] = [];
  let uploadUrls: any[] | null = null;

  if (videos.length && organizationId && executionNumber) {
    // Map videos to their S3 filenames (no local rename)
    processed = videos.filter(v => v.path && fs.existsSync(v.path))
      .map(v => ({
        localPath: v.path,
        s3FileName: `${executionNumber}_${v.testId}.webm`,
      }));

    if (processed.length) {
      // Request presigned URLs with desired S3 filenames
      const response = await api.post('/execution/batch_upload_urls', token, {
        files: processed.map(v => ({ fileName: v.s3FileName, contentType: 'video/webm', folder: `videos/${organizationId}` })),
      });
      uploadUrls = response.success ? response.data : null;
    } else {
      console.log('No videos found to process');
    }
  } else {
    console.log('Missing required parameters for video processing');
  }

  return { videos: processed, uploadUrls };
}

/**
 * Uploads a single video file to S3 using a presigned URL
 */
async function uploadVideoToS3(filePath: string, uploadUrl: string): Promise<boolean> {
  let success = false;
  console.log(`Uploading video to S3: ${filePath} -> ${uploadUrl}`);

  if (fs.existsSync(filePath)) {
    //try {
      const fileBuffer = fs.readFileSync(filePath);
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: fileBuffer,
        headers: { 'Content-Type': 'video/webm' },
      });
      success = response.ok;
      if (!success) {
        console.log('Upload failed with status:', response.status);
      }
   /* } catch (error) {
      console.log('Error uploading video:', error);
    }*/
  } else {
    console.log('Video file not found:', filePath);
  }

  return success;
}

/**
 * Uploads all processed videos to S3 using their presigned URLs
 */
export async function uploadVideosToS3(videos: any[], uploadUrls: any[]): Promise<any[]> {
  const results: any[] = [];

  console.log(`Starting upload of ${videos.length} videos to S3`);
  if (videos.length && uploadUrls?.length) {
    // Create a map for quick lookup by S3 filename
    const urlMap = new Map(uploadUrls.map(u => [u.fileName, u.uploadUrl]));

    // Upload all videos in parallel
    const uploadPromises = videos.map(async (video) => {
      const uploadUrl = urlMap.get(video.s3FileName);
      if (uploadUrl) {
        const success = await uploadVideoToS3(video.localPath, uploadUrl);
        return { fileName: video.s3FileName, success };
      } else {
        console.log('No upload URL found for:', video.s3FileName);
        return { fileName: video.s3FileName, success: false, error: 'No upload URL' };
      }
    });

    const uploadResults = await Promise.all(uploadPromises);
    results.push(...uploadResults);

    const successCount = results.filter(r => r.success).length;
    console.log(`Uploaded ${successCount}/${results.length} videos to S3`);
  } else {
    console.log('No videos or upload URLs provided');
  }

  return results;
}
