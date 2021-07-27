import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    public hasValidAccessToken = false;
    constructor(public auth: AuthenticationService,
        private oauthService: OAuthService,
    ) {
        this.hasValidAccessToken = this.oauthService.hasValidAccessToken();
    }

    tiggerAuthentication(): void {
        this.auth.authenticate();
    }
}
