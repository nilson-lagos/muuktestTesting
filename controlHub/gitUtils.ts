import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

export interface GitContext {
  repositoryId: string;
  repositoryName: string;
  branch: string;
  commitSha: string;
  owner: string;
}

/**
 * Parses a git remote URL to extract owner and repo name.
 * Supports both HTTPS and SSH formats:
 * - https://github.com/owner/repo.git
 * - git@github.com:owner/repo.git
 */
function parseGitRemoteUrl(remoteUrl: string): { owner: string; repo: string } {

  const response = {
    owner: '',
    repo: ''
  }  
  // Remove trailing .git if present
  const cleanUrl = remoteUrl.replace(/\.git$/, '');
  
  // Match HTTPS format: https://github.com/owner/repo
  const httpsMatch = cleanUrl.match(/https?:\/\/[^\/]+\/([^\/]+)\/([^\/]+)/);
  if (httpsMatch) {
    return { owner: httpsMatch[1], repo: httpsMatch[2] };
  }
  
  // Match SSH format: git@github.com:owner/repo
  const sshMatch = cleanUrl.match(/git@[^:]+:([^\/]+)\/(.+)/);
  if (sshMatch) {
    response.owner = sshMatch[1];
    response.repo = sshMatch[2];
  }
  
  return response
}

// This function retrieves the current git context, including the repository ID, branch name, and commit SHA.
// It uses the GitHub API to fetch the repository ID based on the owner and repo name extracted from the git remote URL.
export async function getGitContext(): Promise<GitContext> {
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim() || 'unknown-branch';
  const commitSha = execSync('git rev-parse HEAD').toString().trim() || 'unknown-commit';
  
  // Get owner and repo from git remote URL
  const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
  const { owner, repo } = parseGitRemoteUrl(remoteUrl);

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    }
  );

  const repoData = await response.json();

  return {
    repositoryId: repoData?.id?.toString() || "0",
    repositoryName: repo,
    branch,
    commitSha,
    owner: owner || 'unknown-owner'
  };
}

/**
 * Gets a clean title path from a Playwright test, filtering out
 * empty strings and the project/browser name.
 */
export function getCleanTitlePath(test: any, filePath: any): string[] {
  const titleParts = test.titlePath();

  // Remove the project part and any empty strings
  const project = test?.parent?.project()?.name;

  // Filter out empty strings and the project name and the file path
  const cleanedParts = titleParts?.filter((part: string) => part !== '' && part !== project && part !== filePath);
  
  return cleanedParts;
}
