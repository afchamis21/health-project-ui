import {BaseResponse, PaginatedResponse} from "./http";

export type Attendance = {
  patientId: number
  userId: number
  clockInTime: Date
  clockOutTime: Date
  username: string
}

export type GetAttendanceResponse = BaseResponse<Attendance>

export type GetAttendancesResponse = PaginatedResponse<Attendance>
