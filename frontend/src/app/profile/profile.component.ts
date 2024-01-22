import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(private router: Router, private authService: AuthService) { }
  user: any = {};
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '');
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/log-in']);
    this.authService.setIsAuthentic(false);
  }
}
