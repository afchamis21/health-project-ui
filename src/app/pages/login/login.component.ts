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
import {UserService} from "../../core/services/user/user.service";
import {SpinnerComponent} from "../../shared/components/loader/spinner/spinner.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SpinnerComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  isLoggingIn = false

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  ngOnInit(): void {
    const subscription = this.userService.user$.subscribe(value => this.user = value)
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

    this.isLoggingIn = true

    const subscription = this.authService.login(formData).subscribe({
      next: () => {
        this.isLoggingIn = false
        this.toastr.success("Logado com sucesso!")
        this.router.navigate(['/dashboard'])
      },
      error: () => {
        this.isLoggingIn = false
        this.loginForm.controls.password.setValue('')
      }
    })

    this.subscriptions.push(subscription)
  }
}
