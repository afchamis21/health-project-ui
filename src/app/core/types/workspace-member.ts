import {User} from "./user";
import {BaseResponse, PaginatedResponse} from "./http";

export type WorkspaceMember = {
  workspaceId: number
  isMemberActive: boolean
  createDt: Date
  user: User
}

export type WorkspaceMemberName = Pick<User, "userId" | "username">


export type GetWorkspaceMembersResponse = PaginatedResponse<WorkspaceMember>

export type GetWorkspaceMembersNamesResponse = BaseResponse<WorkspaceMemberName[]>

export type CreateWorkspaceMemberRequest = {
  email: string
}

export type CreateWorkspaceMemberResponse = BaseResponse<WorkspaceMember>
