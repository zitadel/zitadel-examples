import { UserManager, WebStorageStateStore, User } from 'oidc-client';

export default class AuthService {
    private userManager: UserManager;

    constructor() {
        const ZITADEL_ISSUER_DOMAIN: string = "ZITADEL_ISSUER_DOMAIN"; // e.g. https://issuer.zitadel.ch    

        const settings: any = {
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            authority: ZITADEL_ISSUER_DOMAIN,
            client_id: 'YOUR_ZITADEL_CLIENT_ID',
            redirect_uri: 'http://localhost:44444/callback.html',
            response_type: 'code',
            scope: 'openid profile',
            post_logout_redirect_uri: 'http://localhost:44444/',
        };

        this.userManager = new UserManager(settings);
    }

    public getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }

    public login(): Promise<void> {
        return this.userManager.signinRedirect();
    }

    public logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }

    public getAccessToken(): Promise<string> {
        return this.userManager.getUser().then((data: any) => {
            return data.access_token;
        });
    }
}
