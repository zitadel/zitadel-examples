import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthConfig, OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SignedOutComponent } from './components/signed-out/signed-out.component';
import { UserComponent } from './components/user/user.component';
import { StatehandlerProcessorService, StatehandlerProcessorServiceImpl } from './services/statehandler-processor.service';
import { StatehandlerService, StatehandlerServiceImpl } from './services/statehandler.service';
import { StorageService } from './services/storage.service';

const authConfig: AuthConfig = {
    scope: 'openid profile email',
    responseType: 'code',
    oidc: true,
    clientId: '98809213261836203@angular-test', // replace with your appid
    issuer: 'https://issuer.zitadel.dev', // you may use https://issuer.zitadel.ch
    redirectUri: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/signedout',
    requireHttps: false // required for running locally
};

const stateHandlerFn = (stateHandler: StatehandlerService) => {
    return () => {
        return stateHandler.initStateHandler();
    };
};

@NgModule({
    declarations: [
        AppComponent,
        SignedOutComponent,
        UserComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: ['https://test.api.zitadel.caos.ch/caos.zitadel.auth.api.v1.AuthService', 'https://test.api.zitadel.caos.ch/oauth/v2/userinfo', 'https://test.api.zitadel.caos.ch/caos.zitadel.management.api.v1.ManagementService/', 'https://preview.api.zitadel.caos.ch'],
                sendAccessToken: true,
            },
        }),
    ],

    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: stateHandlerFn,
            multi: true,
            deps: [StatehandlerService],
        },
        {
            provide: AuthConfig,
            useValue: authConfig,
        },
        {
            provide: StatehandlerProcessorService,
            useClass: StatehandlerProcessorServiceImpl,
        },
        {
            provide: StatehandlerService,
            useClass: StatehandlerServiceImpl,
        },
        {
            provide: OAuthStorage,
            useClass: StorageService,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
