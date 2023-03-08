import * as core from '@actions/core'
import * as github from '@actions/github'
import {generateSandboxLaunchURL} from './generator'
import {parseParams} from './parser'

async function run(): Promise<void> {
  try {
    const sandboxParams = parseParams()
    const url = await generateSandboxLaunchURL(sandboxParams)
    core.setOutput('url', url)
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
          body: `Crafting Sandbox (Preview)[${url}]`,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
