import {BaseResponse} from "./response";

export type User = {
  userId: number
  username: string
  email: string
  isRegistrationComplete: string
  isActive: string
}

export type GetUserResponse = BaseResponse<User>
