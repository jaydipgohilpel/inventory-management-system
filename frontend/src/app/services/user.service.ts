import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPayload } from '../interface/user.interface';
import { HttpService } from './http.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpService) { }

  register(payload: UserPayload): Observable<any> {
    return this.http.post(`users/register`, payload);
  }

  login(payload: UserPayload): Observable<any> {
    return this.http.post(`users/login`, payload);
  }
}
