import { Executor } from "./Executor"

export interface RouteListRepair {
  id: number
  routeListId: number
  code: string
  name: string
  reason: string
  startDate: string
  endDate: string
  date: string
  executorId: number
  executor: Executor
}
