import {User, UserSummary} from "./user";
import {BaseResponse, PaginatedResponse} from "./http";

export type Collaborator = {
  patientId: number
  isCollaboratorActive: boolean
  description?: string
  createDt: Date
  user: UserSummary
}

export type PatientCollaboratorName = Pick<User, "userId" | "username">

export type GetCollaboratorsResponse = PaginatedResponse<Collaborator>

export type GetCollaboratorsNamesResponse = BaseResponse<PatientCollaboratorName[]>

export type CreateCollaboratorRequest = {
  email: string
  patientId: number
}

export type GetCollaboratorResponse = BaseResponse<Collaborator>

export type UpdateCollaboratorRequest = {
  patientId: number
  userId: number
  description: string
}
