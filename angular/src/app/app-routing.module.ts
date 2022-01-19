import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { SignedOutComponent } from './components/signed-out/signed-out.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard],
    },
    { 
        path: 'auth/callback',
        redirectTo: 'user'
    },
    {
        path: 'signedout',
        component: SignedOutComponent
    },
    { 
        path: '**',
        redirectTo: '/'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
