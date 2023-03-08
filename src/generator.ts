export interface CheckoutParams {
  version: string
  name: string
}

export interface WorkspaceParams {
  name: string
  auto: boolean
  checkouts: CheckoutParams[]
}

export interface DependencyParams {
  name: string
  snapshot: string
}

export interface ContainerParams {
  name: string
  snapshot: string
}

export interface SandboxParams {
  template: string
  sandboxName: string
  workspaces: WorkspaceParams[]
  dependencies: DependencyParams[]
  containers: ContainerParams[]
  autoLaunch: boolean
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
      co => `ws_${workspace.name}_co_${co.name}=${co.version}`
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
    resolve(encodeURIComponent(queryParams))
  })
}
