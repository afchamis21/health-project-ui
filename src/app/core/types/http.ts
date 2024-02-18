export type BaseResponse<T> = {
  metadata: string[]
  body: T
}

export type PaginatedResponse<T> = BaseResponse<{
  lastPage: 0,
  data: T[]
}>

export type PaginationData = {
  page: number,
  size: number
}
