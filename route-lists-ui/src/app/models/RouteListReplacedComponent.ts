import { Executor } from "./Executor"

export interface RouteListReplacedComponent {
    id: number
    routeListId: number
    code: string
    name: string
    factoryNumber: string
    replacementReason: string
    date: string
    executorId: number
    executor: Executor
  }