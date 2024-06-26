import {User} from "./user";
import {BaseResponse, PaginatedResponse} from "./http";

export type Collaborator = {
  patientId: number
  isMemberActive: boolean
  createDt: Date
  user: User
}

export type PatientCollaboratorName = Pick<User, "userId" | "username">


export type GetCollaboratorsResponse = PaginatedResponse<Collaborator>

export type GetCollaboratorsNamesResponse = BaseResponse<PatientCollaboratorName[]>

export type CreateCollaboratorRequest = {
  email: string
  patientId: number
}

export type GetCollaboratorResponse = BaseResponse<Collaborator>
