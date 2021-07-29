import { Injectable } from '@angular/core';
import { SpinnerService } from '../service/spinner.services';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
    } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'
@Injectable()
export class HttpSpinnerInterceptor implements HttpInterceptor {

    constructor(private spinnerService: SpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // emit onStarted event before request execution
        this.spinnerService.onStarted(req);

      return next.handle(req).pipe( finalize(() => this.spinnerService.onFinished(req)));
    }


}
