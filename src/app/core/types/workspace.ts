import {BaseResponse, PaginatedResponse} from "./http";

export type Workspace = {
  workspaceId: number
  name: string
  ownerId: number
  isActive: boolean
  createDt: Date
}

export type CreateWorkspaceRequest = {
  name: string
}

export type CreateWorkspaceResponse = BaseResponse<Workspace>

export type DeleteWorkspaceResponse = BaseResponse<null>

export type UpdateWorkspaceRequest = {
  name: string
}

export type GetWorkspacesResponse = PaginatedResponse<Workspace>
