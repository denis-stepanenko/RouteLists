import axios, { AxiosError, AxiosResponse } from 'axios';
import { RouteList } from './models/RouteList';
import { toast } from 'react-toastify';
import { User } from './models/User';
import { UserFormValues } from './models/UserFormValues';
import { store } from './stores/store';
import { Tokens } from './models/Tokens';
import { Profile } from './models/Profile';
import { PaginatedResult } from './models/Pagination';
import { Product } from './models/Product';
import { Order } from './models/Order';
import { Material } from './models/Material';
import { RouteListOperation } from './models/RouteListOperation';
import { Operation } from './models/Operation';
import { Executor } from './models/Executor';
import { Role } from './models/Role';
import { CreateRouteListOperation } from './models/CreateRouteListOperation';
import { RouteListDocument } from './models/RouteListDocument';
import { RouteListFramelessComponent } from './models/RouteListFramelessComponent';
import { CreateRouteListFramelessComponent } from './models/CreateRouteListFramelessComponent';
import { RouteListReplacedComponent } from './models/RouteListReplacedComponent';
import { CreateRouteListReplacedComponent } from './models/CreateRouteListReplacedComponent';
import { RouteListComponent } from './models/RouteListComponent';
import { CreateRouteListComponent } from './models/CreateRouteListComponent';
import { TechProcess } from './models/TechProcess';
import { CreateTechProcess } from './models/CreateTechProcess';
import { TechProcessOperation } from './models/TechProcessOperation';
import { CreateTechProcessOperaion } from './models/CreateTechProcessOperaion';
import { TechProcessPurchasedProduct } from './models/TechProcessPurchasedProduct';
import { CreateTechProcessPurchasedProduct } from './models/CreateTechProcessPurchasedProduct';
import { PickingListProduct } from './models/PickingListProduct';
import { TechProcessDocument } from './models/TechProcessDocument';
import { CreateByTechProcess } from './models/CreateByTechProcess';
import { RouteListModification } from './models/RouteListModification';
import { CreateRouteListModification } from './models/CreateRouteListModification';
import { RouteListRepair } from './models/RouteListRepair';
import { CreateRouteListRepair } from './models/CreateRouteListRepair';

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api';

let isRefreshing = false;

function isTokenExpired() {
    let token = store.commonStore.token;
    if (token) {
        const tokenDecode = JSON.parse(atob(token!.split('.')[1]));

        return tokenDecode.exp * 1000 < new Date().getTime();
    }

    return false;
}

axios.interceptors.request.use(async config => {

    if (isRefreshing)
    {
        return config;
    }

    let token = store.commonStore.token;
    if (token) {
        if (isTokenExpired()) {
            isRefreshing = true;
            const tokens = { accessToken: store.commonStore.token ?? '', refreshToken: store.commonStore.refreshToken ?? '' };
            
            try {
                const result = await agent.Account.refreshTokens(tokens);
                store.commonStore.setToken(result.accessToken);
                store.commonStore.setRefreshToken(result.refreshToken);    
            } catch (error) {
                store.userStore.logout();
            }

            isRefreshing = false;
        }

        config.headers.Authorization = `Bearer ${store.commonStore.token}`;
    }

    return config;
});

axios.interceptors.response.use(async response => {
    // await sleep(5000);
    const pagination = response.headers['pagination'];
    if(pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }

    return response;
}, (error: AxiosError) => {

    if(error.code === 'ERR_NETWORK') {
        toast.error('Сервер недоступен');
    }

    const { status } = error.response as AxiosResponse;
    switch (status) {
        case 401:
            window.location.href = '/login';
            break;
        case 403:
            toast.error('Доступ запрещен');
            break;
        case 404:
            toast.error('Ресурс не найден');
            break;
        case 500:
            toast.error('Ошибка на сервере');
            break;
    }

    return Promise.reject(error);
})

function handleValidationErrors(response: any) {
    if (response.data.errors) {
        const modalStateErrors = [];
        for (const key in response.data.errors) {
            if (response.data.errors[key]) {
                modalStateErrors.push(response.data.errors[key]);
            }
        }
        return modalStateErrors.flat();
    } else {
        return [response.data];
    }
}

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const RouteLists = {
    list: (pageNumber: number, filter: string) => requests.get<PaginatedResult<RouteList[]>>(`/routelist?pageNumber=${pageNumber}&filter=${filter}`),
    listWithDepartment: (pageNumber: number, filter: string, department: number) => requests.get<PaginatedResult<RouteList[]>>(`/routelist?pageNumber=${pageNumber}&filter=${filter}&department=${department}`),
    get: (id: number) => requests.get<RouteList>(`/routelist/${id}`),
    duplicate: (id: number, newNumber: string) => requests.get<RouteList>(`/routelist/Duplicate?id=${id}&newNumber=${newNumber}`),
    create: (routeList: RouteList) => requests.post<RouteList>('/routelist', routeList),
    createByTechProcess: (data: CreateByTechProcess) => requests.post<void>('/routelist/CreateByTechProcess', data),
    update: (routeList: RouteList) => requests.put<void>('/routelist', routeList),
    delete: (id: number) => requests.del<void>(`/routelist/${id}`),
    getNewNumber: (department: number) => requests.get<number>(`/routelist/GetNewNumber?department=${department}`),
}

const RouteListOperations = {
    list: (routeListId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<RouteListOperation[]>>(`/RouteListOperation?routeListId=${routeListId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<RouteListOperation>(`/routeListOperation/${id}`),
    areThereOperations: (routeListId: number) => requests.get<boolean>(`/routeListOperation/AreThereOperations/?routeListId=${routeListId}`),
    getNewNumber: (routeListId: number) => requests.get<string>(`/routeListOperation/GetNewNumber/?routeListId=${routeListId}`),
    create: (data: CreateRouteListOperation) => requests.post<RouteList>('/routeListOperation', data),
    update: (item: RouteListOperation) => requests.put<void>('/routeListOperation', item),
    delete: (id: number) => requests.del<void>(`/RouteListOperation/${id}`),
    swap: (id: number, id2: number) => requests.post<void>('/routeListOperation/Swap', { id, id2 }),
}

const RouteListDocuments = {
    list: (routeListId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<RouteListDocument[]>>(`/RouteListDocument?routeListId=${routeListId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<RouteListDocument>(`/routeListDocument/${id}`),
    create: (item: RouteListDocument) => requests.post<RouteList>('/routeListDocument', item),
    update: (item: RouteListDocument) => requests.put<void>('/routeListDocument', item),
    delete: (id: number) => requests.del<void>(`/RouteListDocument/${id}`)
}

const RouteListFramelessComponents = {
    list: (routeListId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<RouteListFramelessComponent[]>>(`/RouteListFramelessComponent?routeListId=${routeListId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<RouteListFramelessComponent>(`/RouteListFramelessComponent/${id}`),
    create: (data: CreateRouteListFramelessComponent) => requests.post<RouteList>('/RouteListFramelessComponent', data),
    update: (item: RouteListFramelessComponent) => requests.put<void>('/RouteListFramelessComponent', item),
    delete: (id: number) => requests.del<void>(`/RouteListFramelessComponent/${id}`)
}

const RouteListReplacedComponents = {
    list: (routeListId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<RouteListReplacedComponent[]>>(`/RouteListReplacedComponent?routeListId=${routeListId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<RouteListReplacedComponent>(`/RouteListReplacedComponent/${id}`),
    create: (data: CreateRouteListReplacedComponent) => requests.post<void>('/RouteListReplacedComponent', data),
    update: (item: RouteListReplacedComponent) => requests.put<void>('/RouteListReplacedComponent', item),
    delete: (id: number) => requests.del<void>(`/RouteListReplacedComponent/${id}`)
}

const RouteListComponents = {
    list: (routeListId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<RouteListComponent[]>>(`/RouteListComponent?routeListId=${routeListId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<RouteListComponent>(`/RouteListComponent/${id}`),
    create: (data: CreateRouteListComponent) => requests.post<void>('/RouteListComponent', data),
    update: (item: RouteListComponent) => requests.put<void>('/RouteListComponent', item),
    delete: (id: number) => requests.del<void>(`/RouteListComponent/${id}`)
}

const RouteListModifications = {
    list: (routeListId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<RouteListModification[]>>(`/RouteListModification?routeListId=${routeListId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<RouteListModification>(`/RouteListModification/${id}`),
    create: (data: CreateRouteListModification) => requests.post<void>('/RouteListModification', data),
    update: (item: RouteListModification) => requests.put<void>('/RouteListModification', item),
    delete: (id: number) => requests.del<void>(`/RouteListModification/${id}`),
}

const RouteListRepairs = {
    list: (routeListId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<RouteListRepair[]>>(`/RouteListRepair?routeListId=${routeListId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<RouteListRepair>(`/RouteListRepair/${id}`),
    create: (data: CreateRouteListRepair) => requests.post<void>('/RouteListRepair', data),
    update: (item: RouteListRepair) => requests.put<void>('/RouteListRepair', item),
    delete: (id: number) => requests.del<void>(`/RouteListRepair/${id}`),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    refreshTokens: (tokens: Tokens) => requests.post<Tokens>('/account/refresh', tokens),
    getProfile: (username: string) => requests.get<Profile>(`/account/profile/${username}`),
    changePhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post('/account/changephoto', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
    },
    deletePhoto: () => requests.del('/account/deletephoto')
}

const Products = {
    getRoute: (productCode: string) => requests.get<string>(`/product/getroute?productCode=${productCode}`),
    list: (filter: string) => requests.get<Product[]>(`/Product?filter=${filter}`),
    getPurchasedProducts: (pageNumber: number, filter: string) => requests.get<PaginatedResult<Product[]>>(`/product/getPurchasedProducts?pageNumber=${pageNumber}&filter=${filter}`),
    getProducts: (pageNumber: number, filter: string) => requests.get<PaginatedResult<Product[]>>(`/product/getProducts?pageNumber=${pageNumber}&filter=${filter}`),
    getPickingList: (productCode: string, pageNumber: number, filter: string) => requests.get<PaginatedResult<PickingListProduct[]>>(`/product/GetPickingList?productCode=${productCode}&pageNumber=${pageNumber}&filter=${filter}`),

}

const Orders = {
    get: (productCode: string) => requests.get<Order[]>(`/order?productCode=${productCode}`)
}

const Materials = {
    get: (filter: string) => requests.get<Material[]>(`/material?filter=${filter}`),
    getByProduct: (productCode: string) => requests.get<Material[]>(`/material/GetByProduct?productCode=${productCode}`)
}

const Operations = {
    list: (pageNumber: number, filter: string) => requests.get<PaginatedResult<Operation[]>>(`/Operation?pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<Operation>(`/Operation/${id}`),
    create: (item: Operation) => requests.post<Operation>('/Operation', item),
    update: (item: Operation) => requests.put<void>('/Operation', item),
    delete: (id: number) => requests.del<void>(`/Operation/${id}`)
}

const Executors = {
    list: (pageNumber: number, filter: string) => requests.get<PaginatedResult<Executor[]>>(`/Executor?pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<Executor>(`/Executor/${id}`),
    find: (filter: string) => requests.get<Executor[]>(`/Executor/Find?filter=${filter}`),
    create: (item: Executor) => requests.post<Executor>('/Executor', item),
    update: (item: Executor) => requests.put<void>('/Executor', item),
    delete: (id: number) => requests.del<void>(`/Executor/${id}`)
}

const Roles = {
    list: (pageNumber: number, filter: string) => requests.get<PaginatedResult<Role[]>>(`/Role?pageNumber=${pageNumber}&filter=${filter}`),
    getAll: () => requests.get<Role[]>('/Role/GetAll'),
    get: (id: string) => requests.get<Role>(`/Role/${id}`),
    create: (item: Role) => requests.post<Role>('/Role', item),
    update: (item: Role) => requests.put<void>('/Role', item),
    delete: (id: string) => requests.del<void>(`/Role/${id}`)
}

const Users = {
    list: (pageNumber: number, filter: string) => requests.get<PaginatedResult<User[]>>(`/User?pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: string) => requests.get<User>(`/User/${id}`),
    create: (item: User) => requests.post<User>('/User', item),
    update: (item: User) => requests.put<void>('/User', item),
    delete: (id: string) => requests.del<void>(`/User/${id}`),
    changePassword: (id: string, newPassword: string) => requests.post<void>('/User/ChangePassword', { id, newPassword })
}

const TechProcesses = {
    list: (pageNumber: number, filter: string) => requests.get<PaginatedResult<TechProcess[]>>(`/TechProcess?pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<TechProcess>(`/TechProcess/${id}`),
    find: (filter: string) => requests.get<TechProcess[]>(`/TechProcess/Find?filter=${filter}`),
    create: (data: CreateTechProcess) => requests.post<void>('/TechProcess', data),
    update: (item: TechProcess) => requests.put<void>('/TechProcess', item),
    delete: (id: number) => requests.del<void>(`/TechProcess/${id}`),
    confirmOrUnconfirm: (id: number) => requests.get<void>(`/TechProcess/ConfirmOrUnconfirm/${id}`)
}

const TechProcessOperations = {
    list: (techProcessId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<TechProcessOperation[]>>(`/TechProcessOperation?techProcessId=${techProcessId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<TechProcessOperation>(`/TechProcessOperation/${id}`),
    create: (data: CreateTechProcessOperaion) => requests.post<void>('/TechProcessOperation', data),
    update: (item: TechProcessOperation) => requests.put<void>('/TechProcessOperation', item),
    delete: (id: number) => requests.del<void>(`/TechProcessOperation/${id}`),
    swap: (id: number, id2: number) => requests.post<void>('/TechProcessOperation/Swap', { id, id2 }),
}

const TechProcessPurchasedProducts = {
    list: (techProcessId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<TechProcessPurchasedProduct[]>>(`/TechProcessPurchasedProduct?techProcessId=${techProcessId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<TechProcessPurchasedProduct>(`/TechProcessPurchasedProduct/${id}`),
    create: (data: CreateTechProcessPurchasedProduct) => requests.post<void>('/TechProcessPurchasedProduct', data),
    update: (item: TechProcessPurchasedProduct) => requests.put<void>('/TechProcessPurchasedProduct', item),
    delete: (id: number) => requests.del<void>(`/TechProcessPurchasedProduct/${id}`),
}

const TechProcessDocuments = {
    list: (techProcessId: number, pageNumber: number, filter: string) => requests.get<PaginatedResult<TechProcessDocument[]>>(`/TechProcessDocument?techProcessId=${techProcessId}&pageNumber=${pageNumber}&filter=${filter}`),
    get: (id: number) => requests.get<TechProcessDocument>(`/TechProcessDocument/${id}`),
    create: (item: TechProcessDocument) => requests.post<void>('/TechProcessDocument', item),
    update: (item: TechProcessDocument) => requests.put<void>('/TechProcessDocument', item),
    delete: (id: number) => requests.del<void>(`/TechProcessDocument/${id}`),
}

const agent = {
    RouteLists,
    Account,
    Products,
    Orders,
    Materials,
    RouteListOperations,
    Operations,
    Executors,
    Roles,
    Users,
    RouteListDocuments,
    RouteListFramelessComponents,
    RouteListReplacedComponents,
    RouteListComponents,
    RouteListModifications,
    RouteListRepairs,
    TechProcesses,
    TechProcessOperations,
    TechProcessPurchasedProducts,
    TechProcessDocuments,
    handleValidationErrors,
    isTokenExpired
}

export default agent;