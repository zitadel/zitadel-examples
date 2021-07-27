import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user$: Observable<any>;

    constructor(private auth: AuthenticationService) {
        this.user$ = this.auth.getOIDCUser();
    }

    ngOnInit(): void {
    }

    triggerSignout(): void {
        this.auth.signout();
    }
}
