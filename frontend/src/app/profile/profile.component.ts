import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(private router: Router,) { }
  user: any = {};
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '');
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/log-in']);
    // this.authService.setIsAuthentic(false);
  }
}
