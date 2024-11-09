import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth/auth.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {LoginRequest} from "../../core/types/auth";
import {ToastrService} from "ngx-toastr";
import {User} from "../../core/types/user";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../shared/utils/subscription-utils";
import {UserStateService} from "../../core/services/user/user-state.service";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgxSpinnerComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []

  constructor(
    private userStateService: UserStateService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
    this.spinner.hide()
  }

  ngOnInit(): void {
     const subscription = this.userStateService.user$.subscribe(value => this.user = value)
    this.subscriptions.push(subscription)
  }

  user: User | null = null

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  })

  handleLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    const formData: LoginRequest = {
      email: this.loginForm.get('email')?.value!,
      password: this.loginForm.get('password')?.value!,
    }

    this.spinner.show()

    const subscription = this.authService.login(formData).subscribe({
      next: () => {
        this.spinner.hide()
        this.toastr.success("Logado com sucesso!")
        this.router.navigate(['/dashboard'])
      },
      error: () => {
        this.spinner.hide()
        this.loginForm.controls.password.setValue('')
      }
    })

    this.subscriptions.push(subscription)
  }
}
