import {Component} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {UpdateUserRequest, User} from "../../../core/types/user";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {confirmPasswordValidator, passwordValidator} from "../../../core/validators/form-validators";
import {PaymentService} from "../../../core/services/payment/payment.service";
import {UserStateService} from "../../../core/services/user/user-state.service";
import {BehaviorSubject} from "rxjs";
import {NgxSpinnerComponent} from "ngx-spinner";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    ReactiveFormsModule,
    NgxSpinnerComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  isEditingProfile = false
  isGoingToBillingPortal = false
  user: User = {} as User

  usernameRegex = /^[A-Za-z0-9_ -]+$/
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  isSubmittingProfileChanges = false


  constructor(
    private paymentService: PaymentService,
    private userStateService: UserStateService
  ) {
    userStateService.user$.subscribe(value => {
      if (!value) {
        return
      }

      this.user = value
      this.editUserForm.get('username')?.setValue(this.user.username)
      this.editUserForm.get('email')?.setValue(this.user.email)

      this.loadingSubject.subscribe(value => this.isSubmittingProfileChanges = value)
    })
  }

  editUserForm = new FormGroup({
    username: new FormControl(
      {
        value: "",
        disabled: !this.isEditingProfile
      },
      [Validators.minLength(5), Validators.pattern(this.usernameRegex)]),
    email: new FormControl(
      {
        value: "",
        disabled: !this.isEditingProfile
      },
      [Validators.pattern(this.emailRegex)]),
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

    const email = this.editUserForm.controls.email.value
    if (email) {
      payload.email = email
    }

    const password = this.editUserForm.get('password')?.value
    const confirmPassword = this.editUserForm.get('confirmPassword')?.value
    if (password && confirmPassword) {
      payload = {...payload, password, confirmPassword}
    }

    this.loadingSubject.next(true)

    this.userStateService.handleUpdateUser(payload).subscribe({
      next: () => {
        this.loadingSubject.next(false)
      },
      error: () => {
        this.loadingSubject.next(false)
      }
    })
  }

  goToBillingPortal() {
    this.isGoingToBillingPortal = true
    this.paymentService.goToBillingPortal()
  }

  goToCheckout() {
    this.isGoingToBillingPortal = true
    this.paymentService.goToCheckout(this.user.email)
  }
}
