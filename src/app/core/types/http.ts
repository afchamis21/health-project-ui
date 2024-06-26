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
  size: number,
  lastPage: number,
  maxPages: 5,
  sort: 'ASC' | 'DESC'
}

export type VoidResponse = BaseResponse<null>
