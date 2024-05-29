import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Profile from "../features/profile/Profile";
import RouteLists from "../features/route-list/RouteLists";
import RouteListDetails from "../features/route-list/RouteListDetails";
import Login from "../features/user/Login";
import Operations from "../features/operation/Operations";
import Operation from "../features/operation/Operation";
import Executor from "../features/executor/Executor";
import Executors from "../features/executor/Executors";
import Role from "../features/role/Role";
import Roles from "../features/role/Roles";
import Users from "../features/user/Users";
import ChangePassword from "../features/user/ChangePassword";
import UpdateUser from "../features/user/UpdateUser";
import CreateUser from "../features/user/CreateUser";
import CreateRouteList from "../features/route-list/CreateRouteList";
import RouteListOperations from "../features/route-list/operation/RouteListOperations";
import UpdateRouteListOperation from "../features/route-list/operation/UpdateRouteListOperation";
import CreateRouteListOperation from "../features/route-list/operation/CreateRouteListOperation";
import RouteListDocument from "../features/route-list/document/RouteListDocument";
import RouteListDocuments from "../features/route-list/document/RouteListDocuments";
import RouteListFramelessComponents from "../features/route-list/frameless-component/RouteListFramelessComponents";
import UpdateRouteListFramelessComponent from "../features/route-list/frameless-component/UpdateRouteListFramelessComponent";
import CreateRouteListFramelessComponent from "../features/route-list/frameless-component/CreateRouteListFramelessComponent";
import RouteListReplacedComponents from "../features/route-list/replaced-component/RouteListReplacedComponents";
import CreateRouteListReplacedComponent from "../features/route-list/replaced-component/CreateRouteListReplacedComponent";
import UpdateRouteListReplacedComponent from "../features/route-list/replaced-component/UpdateRouteListReplacedComponent";
import RouteListComponents from "../features/route-list/component/RouteListComponents";
import UpdateRouteListComponent from "../features/route-list/component/UpdateRouteListComponent";
import CreateRouteListComponent from "../features/route-list/component/CreateRouteListComponent";
import TechProcesses from "../features/tech-process/TechProcesses";
import TechProcessDetails from "../features/tech-process/TechProcessDetails";
import CreateTechProcess from "../features/tech-process/CreateTechProcess";
import TechProcessDocuments from "../features/tech-process/document/TechProcessDocuments";
import TechProcessDocument from "../features/tech-process/document/TechProcessDocument";
import TechProcessOperations from "../features/tech-process/operation/TechProcessOperations";
import CreateTechProcessOperation from "../features/tech-process/operation/CreateTechProcessOperation";
import UpdateTechProcessOperation from "../features/tech-process/operation/UpdateTechProcessOperation";
import TechProcessPurchasedProducts from "../features/tech-process/purchased-product/TechProcessPurchasedProducts";
import CreateTechProcessPurchasedProduct from "../features/tech-process/purchased-product/CreateTechProcessPurchasedProduct";
import UpdateTechProcessPurchasedProduct from "../features/tech-process/purchased-product/UpdateTechProcessPurchasedProduct";
import CreateRouteListByTechProcess from "../features/route-list/CreateRouteListByTechProcess";
import RouteListModifications from "../features/route-list/modification/RouteListModifications";
import CreateRouteListModification from "../features/route-list/modification/CreateRouteListModification";
import UpdateRouteListModification from "../features/route-list/modification/UpdateRouteListModification";
import RouteListRepairs from "../features/route-list/repair/RouteListRepairs";
import CreateRouteListRepair from "../features/route-list/repair/CreateRouteListRepair";
import UpdateRouteListRepair from "../features/route-list/repair/UpdateRouteListRepair";

export const routers: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            { path: '', element: <RouteLists/> },
            { path: 'routeLists', element: <RouteLists/> },
            { path: 'createRouteList', element: <CreateRouteList/> },
            
            { path: 'routeListDetails/:id', element: <RouteListDetails/> },

            { path: 'routeListOperations/:id', element: <RouteListOperations/> },
            { path: 'updateRouteListOperation/:id', element: <UpdateRouteListOperation/> },
            { path: 'createRouteListOperation/:id', element: <CreateRouteListOperation/> },
           
            { path: 'routeListDocuments/:id', element: <RouteListDocuments/> },
            { path: 'updateRouteListDocument/:routeListId/:id', element: <RouteListDocument/> },
            { path: 'createRouteListDocument/:routeListId', element: <RouteListDocument/> },

            { path: 'routeListFramelessComponents/:id', element: <RouteListFramelessComponents/> },
            { path: 'updateRouteListFramelessComponent/:id', element: <UpdateRouteListFramelessComponent/> },
            { path: 'createRouteListFramelessComponent/:id', element: <CreateRouteListFramelessComponent/> },

            { path: 'routeListReplacedComponents/:id', element: <RouteListReplacedComponents/> },
            { path: 'updateRouteListReplacedComponent/:id', element: <UpdateRouteListReplacedComponent/> },
            { path: 'createRouteListReplacedComponent/:id', element: <CreateRouteListReplacedComponent/> },

            { path: 'routeListComponents/:id', element: <RouteListComponents/> },
            { path: 'updateRouteListComponent/:id', element: <UpdateRouteListComponent/> },
            { path: 'createRouteListComponent/:id', element: <CreateRouteListComponent/> },
            
            { path: 'routeListModifications/:id', element: <RouteListModifications/> },
            { path: 'createRouteListModification/:id', element: <CreateRouteListModification/> },
            { path: 'updateRouteListModification/:id', element: <UpdateRouteListModification/> },
            
            { path: 'routeListRepairs/:id', element: <RouteListRepairs/> },
            { path: 'createRouteListRepair/:id', element: <CreateRouteListRepair/> },
            { path: 'updateRouteListRepair/:id', element: <UpdateRouteListRepair/> },

            { path: 'techProcesses', element: <TechProcesses/> },
            { path: 'techProcessDetails/:id', element: <TechProcessDetails/> },
            { path: 'createTechProcess/', element: <CreateTechProcess/> },

            { path: 'techProcessDocuments/:id', element: <TechProcessDocuments/> },
            { path: 'createTechProcessDocument/:techProcessId', element: <TechProcessDocument/> },
            { path: 'updateTechProcessDocument/:techProcessId/:id', element: <TechProcessDocument/> },

            { path: 'techProcessOperations/:id', element: <TechProcessOperations/> },
            { path: 'updateTechProcessOperation/:id', element: <UpdateTechProcessOperation/> },
            { path: 'createTechProcessOperation/:id', element: <CreateTechProcessOperation/> },

            { path: 'techProcessPurchasedProducts/:id', element: <TechProcessPurchasedProducts/> },
            { path: 'updateTechProcessPurchasedProduct/:id', element: <UpdateTechProcessPurchasedProduct/> },
            { path: 'createTechProcessPurchasedProduct/:id', element: <CreateTechProcessPurchasedProduct/> },

            { path: 'createRouteListByTechProcess', element: <CreateRouteListByTechProcess/> },

            { path: 'login', element: <Login/> },
            { path: 'profiles/:username', element: <Profile/> },
            { path: 'operations', element: <Operations/> },
            { path: 'operations/:id', element: <Operation/>},
            { path: 'createoperation', element: <Operation/>},
            { path: 'createexecutor', element: <Executor/>},
            { path: 'executors', element: <Executors/> },
            { path: 'executors/:id', element: <Executor/>},
            { path: 'createrole', element: <Role/>},
            { path: 'roles', element: <Roles/> },
            { path: 'roles/:id', element: <Role/>},
            { path: 'users', element: <Users/> },
            { path: 'users/:id', element: <UpdateUser/>},
            { path: 'createUser', element: <CreateUser/>},
            { path: 'users/changePassword/:id', element: <ChangePassword/>},
        ]
    }
]

export const router = createBrowserRouter(routers);