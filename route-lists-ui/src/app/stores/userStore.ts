import { makeObservable, observable, runInAction } from "mobx";
import { User } from "../models/User";
import { UserFormValues } from "../models/UserFormValues";
import agent from "../agent";
import { store } from "./store";
import { router } from "../Routes";
import { Profile } from "../models/Profile";
import StoreBase from "./storeBase";

export default class UserStore extends StoreBase {
    user: User | null = null;
    profile: Profile | null = null;
    loading = false;
    photoUploading = false;
    photoDeleting = false;

    constructor() {
        super();
        makeObservable(this, {
            user: observable,
            profile: observable,
            loading: observable,
            photoUploading: observable,
            photoDeleting: observable,
            login: observable,
            logout: observable,
            getUser: observable,
            getProfile: observable,
            changePhoto: observable,
            deletePhoto: observable
        })
    }

    get isLoggedIn() {
        return !!this.user;
    }

    get isCurrentUser() {
        if(this.user && this.profile)
            return this.user.username === this.profile.username;

        return false;
    }

    login = async (creds: UserFormValues) => {
        this.loading = true;

        try {
            const user = await agent.Account.login(creds);
            console.log('Tokens received after login:');
            console.log(user);
            store.commonStore.setToken(user.token);
            store.commonStore.setRefreshToken(user.refreshToken);
            console.log(user);
            runInAction(() => this.user = user);
            router.navigate('/routelists')
        } catch (error) {
            throw error;
        }
        finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        store.commonStore.setRefreshToken(null);
        this.user = null;

        router.navigate('/');
    }

    getUser = async () => {
        const user = await agent.Account.current();
        runInAction(() => this.user = user);
    }

    getProfile = async (username: string) => {
        this.loading = true;

        try {
            const profile = await agent.Account.getProfile(username);
            runInAction(() => this.profile = profile);
        } catch (error) {
            throw error;
        }
        finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    changePhoto = async (file: Blob) => {
        this.photoUploading = true;

        try {
            await agent.Account.changePhoto(file);

            runInAction(() => {
                if(this.profile && this.user)
                {
                    let random = (Math.random() + 1).toString(36).substring(7);
                    this.profile.photoUrl = '/account/getphoto/' + this.user?.username + '/' + random;
                    this.user.photoUrl = '/account/getphoto/' + this.user?.username + '/' + random;
                }
            })
            
        } catch (error) {
            throw error;
        }
        finally {
            runInAction(() => this.photoUploading = false);
        }
    }

    deletePhoto = async () => {
        try {
            this.photoDeleting = true;

            await agent.Account.deletePhoto();

            if(this.profile && this.user)
            {
                this.profile.photoUrl = undefined;
                this.user.photoUrl = undefined;
            }

        } catch (error) {
            throw error;
        } finally {
            this.photoDeleting = false;
        }
    }
}