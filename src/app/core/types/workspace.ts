import {BaseResponse, PaginatedResponse} from "./http";
import {Patient} from "./patient";

export type Workspace = {
  workspaceId: number
  name: string
  ownerId: number
  isActive: boolean
  createDt: Date
}

export type CreateWorkspaceRequest = Partial<Omit<Patient, "patientId">>

export type CreateWorkspaceResponse = BaseResponse<Workspace>

export type DeleteWorkspaceResponse = BaseResponse<null>

export type UpdateWorkspaceRequest = {
  name: string
}

export type GetWorkspaceResponse = BaseResponse<Workspace>

export type GetWorkspacesResponse = PaginatedResponse<Workspace>
