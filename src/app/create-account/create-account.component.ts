import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User_account } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  user: User_account = new User_account('', '', '', '', 'ONLINE', 'SIMPLE', 'ACTIVE');
  accountStatuses = ['ONLINE', 'OFFLINE'];
  accountTypes = ['ADMIN', 'SIMPLE', 'OTHER'];
  accountStates = ['ACTIVE', 'INACTIVE'];

  constructor(private userService: UserService, private toastr: ToastrService) {}

  onSubmit() {
    this.userService.addUser(this.user).subscribe(
      response => {
        console.log('User created successfully', response);
      },
      error => {
        this.toastr.error('Error creating user', error.message);
      }
    );
  }
}