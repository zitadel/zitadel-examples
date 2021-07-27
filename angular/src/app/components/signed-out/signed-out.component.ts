import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-signed-out',
    templateUrl: './signed-out.component.html',
    styleUrls: ['./signed-out.component.scss']
})
export class SignedOutComponent implements OnInit {

    constructor(private auth: AuthenticationService) { }

    ngOnInit(): void {
    }

    triggerAuthentication(): void {
        this.auth.authenticate();
    }
}
