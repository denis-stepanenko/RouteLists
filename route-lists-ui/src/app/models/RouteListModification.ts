import { Executor } from "./Executor"

export interface RouteListModification {
    id: number
    routeListId: number
    code: string
    name: string
    documentNumber: string
    executorId: number
    executor: Executor
}