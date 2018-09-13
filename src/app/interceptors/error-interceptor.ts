import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// This is a angular http feature which enables it's code to run on every http request
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                this.snackBar.open(error.error.message || error.error.error.message, 'Okay!', {
                    duration: 4000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
                return throwError(error);
            })
        );
    }
}
