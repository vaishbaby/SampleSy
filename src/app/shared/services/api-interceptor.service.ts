import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppSettings } from '../../../environments/environment';
import { Resource } from '../app-config/app-config.model';

@Injectable()
export class APIInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let reqUrl: string = req.url;
        let requestClone = null;

        if (AppSettings.hasResource(reqUrl)) {
            const resource: Resource = AppSettings.resources[reqUrl];
            reqUrl = resource.url;
            requestClone = req.clone({ url: `${AppSettings.BASE_URL}${reqUrl}`});
        } else {
            reqUrl = `${reqUrl}`;
            requestClone = req.clone({ url: `${reqUrl}`});
        }
        return next.handle(requestClone);
    }
}
