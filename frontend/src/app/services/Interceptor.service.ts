
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(0),
        catchError((error: HttpErrorResponse) => {
          var message = ''
          if (!error.status && error.statusText === "Unknown Error")
            message = 'Network Error occurred'
          else message = error?.error?.message
          this.notificationService.showError(message);
          return throwError(() => message);
        })
      )
  }
}
