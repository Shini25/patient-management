import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { User_account } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  user: User_account = new User_account('', '', '', '', 'ONLINE', 'SIMPLE', 'ACTIVE');
  accountStatuses = ['ONLINE', 'OFFLINE'];
  accountTypes = ['ADMIN', 'SIMPLE', 'OTHER'];
  accountStates = ['ACTIVE', 'INACTIVE'];

  showLoginForm = true;

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private toastr: ToastrService, private location: Location) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit(): void {}

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
    if (this.loginForm.invalid) {
      this.toastr.error('Please enter valid username and password');
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password }).subscribe(
      data => {
        this.authService.saveToken(data.jwt);
        this.toastr.success('Login successful');
        this.router.navigate(['/home/list-doctor']);
      },
      err => {
        console.error('Login error:', err); // Log the error details for debugging
        if (err.status === 404) {
          this.errorMessage = 'User not found';
          this.toastr.error('User not found');
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid credentials';
          this.toastr.error('Invalid credentials');
        } else if (err.status === 403) {
          this.errorMessage = 'Access denied';
          this.toastr.error('Access denied');
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
          this.toastr.error(err.error.message);
        } else {
          this.errorMessage = 'Login error';
          this.toastr.error('Login error');
        }
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
