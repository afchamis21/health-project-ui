import {Component} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {UpdateUserRequest, User} from "../../../core/types/user";
import {AuthService} from "../../../core/services/auth/auth.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {confirmPasswordValidator, passwordValidator} from "../../../core/validators/form-validators";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../core/services/user/user.service";
import {PaymentService} from "../../../core/services/payment/payment.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isEditingProfile = false
  isGoingToBillingPortal = false
  user: User = {} as User

  constructor(private userService: UserService, private authService: AuthService, private paymentService: PaymentService, private toastr: ToastrService) {
    userService.user$.subscribe(value => {
      if (!value) {
        return
      }

      this.user = value
      this.editUserForm.get('username')?.setValue(this.user.username)
    })
  }

  editUserForm = new FormGroup({
    username: new FormControl(
      {
        value: "",
        disabled: !this.isEditingProfile
      },
      [Validators.minLength(5), Validators.pattern(/^[A-Za-z0-9_ -]+$/)]),
    password: new FormControl(
      {
        value: "",
        disabled: !this.isEditingProfile
      }, [Validators.minLength(8)]),
    confirmPassword: new FormControl(
      {
        value: "",
        disabled: !this.isEditingProfile
      }, []),
  }, {
    validators: [confirmPasswordValidator, passwordValidator]
  })

  toggleEditingProfile() {
    this.isEditingProfile = !this.isEditingProfile
    Object.values(this.editUserForm.controls).forEach(control => {
      if (this.isEditingProfile) {
        control.enable()
      } else {
        control.disable()
      }
    })
  }

  submitForm() {
    if (!this.editUserForm.valid) {
      this.editUserForm.markAllAsTouched()
      return
    }

    let payload: UpdateUserRequest = {}

    const username = this.editUserForm.get('username')?.value
    if (username) {
      payload.username = username
    }

    const password = this.editUserForm.get('password')?.value
    const confirmPassword = this.editUserForm.get('confirmPassword')?.value
    if (password && confirmPassword) {
      payload = {...payload, password, confirmPassword}
    }

    this.userService.updateUser(payload).subscribe({
      next: () => {
        this.toastr.success("Usuário atualizado com sucesso!")
        this.authService.forceLogout()
      }
    })
  }

  goToBillingPortal() {
    this.isGoingToBillingPortal = true
    this.paymentService.goToBillingPortal()
  }
}
