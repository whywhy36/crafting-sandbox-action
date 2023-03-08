import * as core from '@actions/core'
import {generateSandboxLaunchURL} from './generator'
import {parseParams} from './parser'

async function run(): Promise<void> {
  try {
    const sandboxParams = parseParams()
    const url = await generateSandboxLaunchURL(sandboxParams)
    core.setOutput('url', url)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
