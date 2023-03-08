import * as core from '@actions/core'
import {SandboxParams} from './types'

export async function generateSandboxLaunchUrl(
  params: SandboxParams
): Promise<string> {
  const queryParams = await generateSandboxLaunchQueryParameters(params)
  const baseUrl = core.getInput('baseUrl')
  const url = `${baseUrl}/create?${queryParams}`
  core.setOutput('url', url)
  return url
}

export async function generateSandboxLaunchQueryParameters(
  params: SandboxParams
): Promise<string> {
  const templateQueryParam = `template=${params.template}`
  const nameQueryParam = `sandbox_name=${params.sandboxName}`

  const containersQueryParams = params.containers.map(
    container => `container_${container.name}_snapshot=${container.snapshot}`
  )

  const dependenciesQueryParams = params.dependencies.map(
    dependency => `dep_${dependency.name}_snapshot=${dependency.snapshot}`
  )

  const checkoutsQueryParams = params.workspaces.flatMap(workspace => {
    return workspace.checkouts.map(
      co => `ws_${workspace.name}_co_${co.name}_version=${co.version}`
    )
  })

  const workspaceModesQueryParams = params.workspaces
    .filter(ws => ws.auto)
    .map(workspace => `ws_${workspace.name}_mode=auto`)

  const queryParams = [
    templateQueryParam,
    nameQueryParam,
    ...containersQueryParams,
    ...dependenciesQueryParams,
    ...checkoutsQueryParams,
    ...workspaceModesQueryParams
  ].join('&')

  return new Promise(resolve => {
    resolve(queryParams)
  })
}
