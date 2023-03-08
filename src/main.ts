import * as core from '@actions/core'

import {generateSandboxLaunchUrl} from './generators'
import {parseParams} from './parser'
import {postComment} from './post-comment'

async function run(): Promise<void> {
  try {
    const sandboxParams = parseParams()
    const baseUrl = core.getInput('baseUrl')
    const url = await generateSandboxLaunchUrl(baseUrl, sandboxParams)
    await postComment(url)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
