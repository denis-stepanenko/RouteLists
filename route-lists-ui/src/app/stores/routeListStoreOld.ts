import { makeAutoObservable, reaction, runInAction } from "mobx";
import { RouteList } from "../models/RouteList";
import agent from "../agent";
import { Pagination } from "../models/Pagination";

export default class routeListStoreOld {
    routeListRegistry = new Map<number, RouteList>();
    routeLists: RouteList[] = [];
    selectedRouteList: RouteList | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pageNumber: number = 1;
    filter: string = '';
    scrollPosition: number = 0;

    constructor() {
        makeAutoObservable(this)

        reaction(
            () => this.filter,
            () => {
                this.routeListRegistry.clear();
                this.loadRouteLists();
            }
        )
    }

    get getItems() {
        return Array.from(this.routeListRegistry.values());
    }

    loadRouteLists = async () => {
        try {
            const result = await agent.RouteLists.list(this.pageNumber, this.filter);

            runInAction(() => {
                result.data.forEach(routeList => {
                    this.setRouteList(routeList);
                });
                console.log(this.routeListRegistry);
                this.setPagination(result.pagination);
            })

        } catch(error) {
            console.log(error);
        } 
    }

    setPageNumber = (pageNumber: number) => {
        this.pageNumber = pageNumber;
    }

    setFilter = (filter: string) => {
        this.filter = filter;
    }

    setScrollPosition = (position: number) => {
        this.scrollPosition = position;
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    loadRouteList = async (id: number) => {
            this.setLoadingInitial(true);

            try {
                let routeList = await agent.RouteLists.get(id);
                this.setRouteList(routeList);
                runInAction(() => this.selectedRouteList = routeList);
                return routeList;
            } catch(error) {
                console.log(error);
            }
            finally {
                this.setLoadingInitial(false);
            }
    }

    private setRouteList = (routeList: RouteList) => {
        routeList.date = routeList.date!.split('T')[0];
        this.routeListRegistry.set(routeList.id, routeList);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createRouteList = async (routeList: RouteList) => {
        this.loading = true;

        try {
            const result = await agent.RouteLists.create(routeList);

            runInAction(() => {
                // this.routeLists.push(routeList);
                this.routeListRegistry.set(routeList.id, routeList);
                this.loadRouteLists();
                this.selectedRouteList = routeList;
                this.editMode = false;
            })

            return result;
        } catch(error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    updateRouteList = async (routeList: RouteList) => {
        this.loading = true;

        try {
            await agent.RouteLists.update(routeList);

            runInAction(() => {
                // this.routeLists = [...this.routeLists.filter(x => x.id !== routeList.id), routeList];
                this.routeListRegistry.set(routeList.id, routeList);
            });
        } catch(error) {
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    deleteRouteList = async (id: number) => {
        this.loading = true;

        try {
            await agent.RouteLists.delete(id);

            runInAction(() => {
                // this.routeLists = [...this.routeLists.filter(x => x.id !== id)];
                this.routeListRegistry.delete(id);
            });
        } catch(error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}