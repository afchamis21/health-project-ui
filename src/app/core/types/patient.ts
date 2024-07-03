import {BaseResponse, PaginatedResponse} from "./http";

export type Patient = {
  patientId: number
  name: string
  surname: string
  rg: string
  cpf: string
  contactPhone: string
  dateOfBirth: Date
  gender: "MALE" | "FEMALE" | "NOT_SPECIFIED" | "UNKNOWN"
}

export type PatientSummary = {
  patientId: number
  name: string
  ownerId: number
  isActive: boolean
  createDt: Date
}

export type CreatePatientRequest = Partial<Omit<Patient, "patientId">>

export type GetPatientSummaryResponse = BaseResponse<PatientSummary>

export type UpdatePatientRequest = {
  name: string
}

export type GetPatientSummariesResponse = PaginatedResponse<PatientSummary>

export type GetPatientResponse = BaseResponse<Patient>
