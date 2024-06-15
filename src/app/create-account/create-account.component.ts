import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { User_account } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { AccountCreatedDialogComponent } from './account-created-dialog/account-created-dialog.component';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  createAccountForm: FormGroup;
  accountStatuses = ['ONLINE', 'OFFLINE'];
  accountTypes = ['ADMIN', 'SIMPLE', 'OTHER'];
  accountStates = ['ACTIVE', 'INACTIVE'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.createAccountForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,}$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      accountType: ['', Validators.required],
      accountStatus: ['OFFLINE'],
      accountState: ['INACTIVE']
    });
  }

  onSubmit() {
    if (this.createAccountForm.valid) {
      const usernameControl = this.createAccountForm.get('username');
      if (usernameControl) {
        const username = usernameControl.value;
        this.userService.checkUsernameExists(username).subscribe(
          exists => {
            if (exists) {
              this.toastr.error('Username already exists');
            } else {
              const user: User_account = this.createAccountForm.value;
              console.log('Form Values:', this.createAccountForm.value); // Log form values for debugging
              this.userService.addUser(user).subscribe(
                response => {
                  console.log('User created successfully', response);
                  this.toastr.success('User created successfully');
                  const dialogRef = this.dialog.open(AccountCreatedDialogComponent); // Open the dialog

                  dialogRef.afterClosed().subscribe(() => {
                    this.createAccountForm.reset(); // Reset the form
                    this.createAccountForm.patchValue({
                      accountStatus: 'OFFLINE',
                      accountState: 'INACTIVE'
                    });
                  });
                },
                error => {
                  this.toastr.error('Error creating user', error.message);
                }
              );
            }
          },
          error => {
            this.toastr.error('Error checking username', error.message);
          }
        );
      }
    } else {
      console.log('Form Invalid:', this.createAccountForm); // Log invalid form state for debugging
    }
  }
}
