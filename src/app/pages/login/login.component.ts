import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {LoginRequest} from "../../core/types/auth";
import {ToastrService} from "ngx-toastr";
import {User} from "../../core/types/user";

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
export class LoginComponent implements OnInit {
  constructor(protected authService: AuthService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(value => this.user = value)
  }

  user: User | null = null

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  })

  handleLogin() {
    const formData: LoginRequest = {
      email: this.loginForm.get('email')?.value!,
      password: this.loginForm.get('password')?.value!,
    }

    this.authService.login(formData).subscribe({
      next: () => this.toastr.success("Logado!")
    })
  }
}
