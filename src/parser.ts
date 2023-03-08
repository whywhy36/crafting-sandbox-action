import * as core from '@actions/core'
import * as fs from 'fs'
import {SandboxParams} from './types'

export function parseParams(): SandboxParams {
  const baseSandboxParams: SandboxParams = {
    template: '',
    sandboxName: '',
    workspaces: [],
    dependencies: [],
    containers: [],
    autoLaunch: false
  }
  const name = core.getInput('name')
  const paramsFile = core.getInput('launch')
  let jsonString = fs.readFileSync(paramsFile).toString()
  core.debug(`jsonString: ${jsonString}`)
  jsonString = jsonString.replace('$BRANCH', process.env.GITHUB_HEAD_REF || '')
  return {
    ...baseSandboxParams,
    ...JSON.parse(jsonString),
    sandboxName: name
  } as SandboxParams
}
