export type AppLanguages = 'es' | 'en'

export type ApiResponse<T> = {
  data: T
  status: number
  statusText: string
  isOk: boolean
}
