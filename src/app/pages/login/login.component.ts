import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {LoginRequest} from "../../core/types/auth";
import {ToastrService} from "ngx-toastr";
import {User} from "../../core/types/user";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../shared/utils/subscription-utils";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []

  constructor(
    protected authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }

  ngOnInit(): void {
    const subscription = this.authService.user$.subscribe(value => this.user = value)
    this.subscriptions.push(subscription)
  }

  user: User | null = null

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required]),
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

    const subscription = this.authService.login(formData).subscribe({
      next: (response) => {
        this.toastr.success("Logado com sucesso!")
        this.router.navigate(['/dashboard'], {
          queryParams: {
            isRegistrationComplete: response.body.user?.isRegistrationComplete
          }
        })
      }
    })

    this.subscriptions.push(subscription)
  }
}
