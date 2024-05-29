import { action, makeObservable, observable, runInAction } from "mobx";

export default abstract class StoreBase {
    pageNumber: number = 1;
    totalPages: number = 0;
    filter = '';
    scrollPosition: number = 0;
    needToResetParameters = true;
    restoringParameters = false;

    constructor() {
        makeObservable(this, {
            pageNumber: observable,
            totalPages: observable,
            filter: observable,
            scrollPosition: observable,
            needToResetParameters: observable,
            restoringParameters: observable,
            setFilter: action,
            setPageNumber: action,
            setScrollPosition: action,
            setNeedToResetParameters: action,
            setTotalPages: action,
            saveScrollPosition: action,
            resetParameters: action,
            restoreScrollPosition: action,
            restoreParameters: action,
            load: action
        })
    }

    setFilter = (filter: string) => {
        this.filter = filter;
    }

    setPageNumber = (pageNumber: number) => {
        this.pageNumber = pageNumber;
    }

    setScrollPosition = (position: number) => {
        this.scrollPosition = position;
    }

    setNeedToResetParameters = (value: boolean) => {
        this.needToResetParameters = value;
    }

    setTotalPages = (value: number) => {
        this.totalPages = value;
    }

    saveScrollPosition = () => {
        this.setScrollPosition(Number(window.scrollY));
    }

    resetParameters() {
        this.pageNumber = 1;
        this.filter = '';
    }

    restoreScrollPosition = (items: any) => {
        if (!this.needToResetParameters) {
            if (items.length > 0)
                if (this.scrollPosition > 0) {
                    window.scrollTo(0, this.scrollPosition);
                    this.setScrollPosition(0);
                    this.setNeedToResetParameters(true);
                }
                else
                    this.setNeedToResetParameters(true);
        }
    }

    restoreParameters(loadItems: any) {
        if (this.needToResetParameters) {
            this.resetParameters();
            loadItems(1, '');
            this.restoringParameters = true;
        }
    }

    load(loadItems: any) {
        
        if (this.restoringParameters)
            runInAction(() => this.restoringParameters = false)
        else
            loadItems(this.pageNumber, this.filter);
    }
}