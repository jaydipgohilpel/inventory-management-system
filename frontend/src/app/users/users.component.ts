import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { UserList } from '../interface/user.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users: UserList[] = []

  constructor(
    private userService: UserService,
    public notificationService: NotificationService) { }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    try {
      this.userService.getUserList().subscribe((user) => {
        if (!user.data) return;
        this.users = user.data;
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

}
