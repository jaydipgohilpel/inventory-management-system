import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  mainTitle$ = new BehaviorSubject('Home');

  setIsAuthentic(title: string) {
    this.mainTitle$.next(title);
  }
}
