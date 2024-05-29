import { action, makeObservable, observable, runInAction } from "mobx";
import StoreBase from "./storeBase";

export default class RouteListStore extends StoreBase  {    
    departmentFilter: number | null = null;

    constructor() {
        super();

        makeObservable(this, {
            departmentFilter: observable,
            setDepartmentFilter: action
        })
    }

    setDepartmentFilter = (value: number | null) => {
        this.departmentFilter = value;
    }

    resetParameters() {
        this.pageNumber = 1;
        this.filter = '';
        this.departmentFilter = null;
    }

    load(loadItems: any) {
        if (this.restoringParameters)
            runInAction(() => this.restoringParameters = false)
        else
            loadItems(this.pageNumber, this.filter, this.departmentFilter);
    }

    restoreParameters(loadItems: any) {
        if (this.needToResetParameters) {
            this.resetParameters();
            loadItems(1, '', null);
            this.restoringParameters = true;
        }
    }
}

