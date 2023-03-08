import * as core from '@actions/core'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
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
  let yamlString = fs.readFileSync(paramsFile).toString()
  core.debug(`configuration: ${yamlString}`)
  yamlString = yamlString.replace('$BRANCH', process.env.GITHUB_HEAD_REF || '')
  const config = yaml.load(yamlString) as Partial<SandboxParams>
  return {
    ...baseSandboxParams,
    ...config,
    sandboxName: name
  } as SandboxParams
}
