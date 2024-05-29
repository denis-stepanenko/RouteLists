export interface CreateRouteListRepair {
  routeListId: number
  reason: string
  startDate?: string
  endDate?: string
  date?: string
  executorId: number
  ids: string[]
}