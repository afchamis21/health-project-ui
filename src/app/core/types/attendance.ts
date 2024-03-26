import {BaseResponse} from "./http";

export type Attendance = {
  workspaceId: number
  userId: number
  clockInTime: Date
  clockOutTime: Date
}

export type ClockInRequest = {
  workspaceId: number
}

export type GetAttendanceResponse = BaseResponse<Attendance>
