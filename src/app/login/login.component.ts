import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { User_account } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  user: User_account = new User_account('', '', '', '', 'ONLINE', 'SIMPLE', 'ACTIVE');
  accountStatuses = ['ONLINE', 'OFFLINE'];
  accountTypes = ['ADMIN', 'SIMPLE', 'OTHER'];
  accountStates = ['ACTIVE', 'INACTIVE'];

  showLoginForm = true;


  constructor(private router: Router,private userService: UserService, private authService: AuthService, private toastr: ToastrService, private location: Location) {}


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


  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }


  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      data => {
        this.authService.saveToken(data.jwt);
        this.toastr.success('Login successful');
        this.router.navigate(['/home']);
      },
      err => {
        this.errorMessage = 'Invalid credentials';
        this.toastr.error('Login error');

      }
    );
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Logout successful');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }


}
