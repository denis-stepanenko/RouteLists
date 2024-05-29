import { makeAutoObservable, reaction } from "mobx";

export default class CommonStore {
    token: string | null = localStorage.getItem('jwt');
    refreshToken: string | null = localStorage.getItem('refreshJwt');

    constructor() {
        makeAutoObservable(this);

        reaction(() => this.token,
            (token) => {
                if (token) {
                    localStorage.setItem('jwt', token);
                } else {
                    localStorage.removeItem('jwt');
                }
            });

        reaction(() => this.refreshToken,
            (token) => {
                if (token) {
                    localStorage.setItem('refreshJwt', token);
                } else {
                    localStorage.removeItem('refreshJwt');
                }
            });
    }

    setToken = (token: string | null) => {
        if (token)
            localStorage.setItem('jwt', token);
        this.token = token;
    }

    setRefreshToken = (token: string | null) => {
        if (token)
            localStorage.setItem('refreshJwt', token);
        this.refreshToken = token;
    }
}