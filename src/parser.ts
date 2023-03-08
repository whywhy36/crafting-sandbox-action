import * as core from '@actions/core'
import {SandboxParams} from './generator'

export function parseParams(): SandboxParams {
  return {
    autoLaunch: true,
    containers: [],
    dependencies: [],
    sandboxName: '',
    template: '',
    workspaces: []
  }
}
