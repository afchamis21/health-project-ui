import {BaseResponse} from "./http";
import {User} from "./user";

export type AuthResponse = BaseResponse<{
  accessToken: string
  refreshToken: string
  user: User | null
}>

export type LoginRequest = {
  email: string
  password: string
}
