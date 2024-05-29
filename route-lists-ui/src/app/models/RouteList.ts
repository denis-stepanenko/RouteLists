export interface RouteList {
    id: number
    number: string
    date?: string
    productCode: string | null
    productName: string | null
    productCount: number
    ownerProductName: string
    esdProtectionRequired: boolean
    route: string | null
    department: number
    groupName: string
    direction: string
    clientOrder: string
    stage: string
    factoryNumber: string
    pickingListNumber: string
    order: string
    materialCode: string
    materialName: string
    materialParameter: string
    informationAboutReplacement: string
    picker: string
    recipient: string
    prbWorkerName: string
    technologistName: string
    masterName: string
  }
  