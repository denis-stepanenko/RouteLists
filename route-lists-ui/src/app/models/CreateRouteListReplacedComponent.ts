import { Product } from "./Product"

export interface CreateRouteListReplacedComponent {
    routeListId: number
    factoryNumber: string
    replacementReason: string
    date?: string
    executorId: number
    products: Product[]
}