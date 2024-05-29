import { Product } from "./Product"

export interface CreateRouteListComponent {
    routeListId: number
    code: string
    name: string
    factoryNumber: string
    accompanyingDocument: string
    count: number
    products: Product[]
}