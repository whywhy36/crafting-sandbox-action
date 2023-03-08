import * as core from '@actions/core'
import * as github from '@actions/github'

const GITHUB_API_VERSION = '2022-11-28'

export async function postComment(url: string): Promise<void> {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN || '')
  const {owner, repo} = github.context.repo
  const number = github.context.payload.pull_request?.number
  core.debug(`owner: ${owner}`)
  core.debug(`repo: ${repo}`)
  core.debug(`issue_number: ${number}`)
  if (number) {
    await octokit.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner,
        repo,
        issue_number: number,
        body: `Crafting Sandbox [Preview](${url})`,
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION
        }
      }
    )
  }
}
