import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

import { UsersService } from './../services/users.service';

// This is a angular http feature which enables it's code to run on every http request
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    constructor(private usersService: UsersService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.usersService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });
        return next.handle(authRequest);
    }
}
