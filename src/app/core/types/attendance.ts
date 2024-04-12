import {BaseResponse, PaginatedResponse} from "./http";

export type Attendance = {
  workspaceId: number
  userId: number
  clockInTime: Date
  clockOutTime: Date
}

export type AttendanceWithUsername = Attendance & {
  username: string
}

export type ClockInRequest = {
  workspaceId: number
}

export type GetAttendanceResponse = BaseResponse<Attendance>

export type GetAttendancesResponse = PaginatedResponse<AttendanceWithUsername>
