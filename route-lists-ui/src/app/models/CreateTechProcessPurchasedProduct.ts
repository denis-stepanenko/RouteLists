import { PickingListProduct } from "./PickingListProduct"

export interface CreateTechProcessPurchasedProduct {
    techProcessId: number
    count: number,
    products: PickingListProduct[]
}