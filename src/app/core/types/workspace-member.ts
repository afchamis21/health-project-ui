import {User} from "./user";
import {BaseResponse, PaginatedResponse} from "./http";

export type WorkspaceMember = {
  workspaceId: number
  isMemberActive: boolean
  createDt: Date
  user: User
}

export type GetWorkspaceMembersResponse = PaginatedResponse<WorkspaceMember>

export type CreateWorkspaceMemberRequest = {
  email: string
}

export type CreateWorkspaceMemberResponse = BaseResponse<WorkspaceMember>

export type DeleteWorkspaceMemberResponse = BaseResponse<null>
