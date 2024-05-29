import { createContext, useContext } from "react";
import RouteListStore from "./routeListStore";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import RouteListOperationStore from "./routeListOperationStore";
import OperationStore from "./operationStore";
import ExecutorStore from "./executorStore";
import RoleStore from "./roleStore";
import RouteListDocumentStore from "./routeListDocumentStore";
import RouteListFramelessComponentStore from "./routeListFramelessComponentStore";
import RouteListReplacedComponentStore from "./routeListReplacedComponentStore";
import RouteListComponentStore from "./routeListComponentStore";
import TechProcessStore from "./techProcessStore";
import TechProcessOperationStore from "./techProcessOperationStore";
import TechProcessPurchasedProductStore from "./techProcessPurchasedProductStore";
import TechProcessDocumentStore from "./techProcessDocumentStore";
import RouteListModificationStore from "./routeListModificationStore";
import RouteListRepairStore from "./routeListRepairStore";

interface Store {
    routeListStore: RouteListStore,
    userStore: UserStore,
    commonStore: CommonStore,
    routeListOperationStore: RouteListOperationStore,
    operationStore: OperationStore,
    executorStore: ExecutorStore,
    roleStore: RoleStore,
    routeListDocumentStore: RouteListDocumentStore,
    routeListFramelessComponentStore: RouteListFramelessComponentStore,
    routeListReplacedComponentStore: RouteListReplacedComponentStore,
    routeListComponentStore: RouteListComponentStore,
    techProcessStore: TechProcessStore,
    techProcessOperationStore: TechProcessOperationStore,
    techProcessPurchasedProductStore: TechProcessPurchasedProductStore,
    techProcessDocumentStore: TechProcessDocumentStore,
    routeListModificationStore: RouteListModificationStore,
    routeListRepairStore: RouteListRepairStore
}

export const store: Store = {
    routeListStore: new RouteListStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    routeListOperationStore: new RouteListOperationStore(),
    operationStore: new OperationStore(),
    executorStore: new ExecutorStore(),
    roleStore: new RoleStore(),
    routeListDocumentStore: new RouteListDocumentStore(),
    routeListFramelessComponentStore: new RouteListFramelessComponentStore(),
    routeListReplacedComponentStore: new RouteListReplacedComponentStore(),
    routeListComponentStore: new RouteListComponentStore(),
    techProcessStore: new TechProcessStore(),
    techProcessOperationStore: new TechProcessOperationStore(),
    techProcessPurchasedProductStore: new TechProcessPurchasedProductStore(),
    techProcessDocumentStore: new TechProcessDocumentStore(),
    routeListModificationStore: new RouteListModificationStore(),
    routeListRepairStore: new RouteListRepairStore()
}

export function useStore() {
    return useContext(StoreContext);
}

export const StoreContext = createContext(store);