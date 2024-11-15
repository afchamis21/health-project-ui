import {BaseResponse} from "./http";

export type User = {
  userId: number
  username: string
  email: string
  isPaymentActive: boolean
  isRegistrationComplete: boolean
  isClockedIn: boolean
  clockedInAt?: number
}

export type UserSummary = {
  userId: number
  username: string
  email: string
}

export type GetUserResponse = BaseResponse<User>

export type UpdateUserResponse = BaseResponse<{
  forcedLogOut: boolean
}>

export type CompleteRegistrationRequest = {
  username: string,
  password: string,
  confirmPassword: string
}

export type UpdateUserRequest = {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
} & (
  | { password: string; confirmPassword: string }
  | { password?: never; confirmPassword?: never }
  );
