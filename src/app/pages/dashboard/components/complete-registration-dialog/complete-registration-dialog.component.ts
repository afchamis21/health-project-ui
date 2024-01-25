import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";

export type CompleteRegistrationDialog = {
  complete: boolean,
  username: string,
  password: string,
  confirmPassword: string
}

@Component({
  selector: 'app-complete-registration-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './complete-registration-dialog.component.html',
  styleUrl: './complete-registration-dialog.component.css'
})
export class CompleteRegistrationDialogComponent {
  constructor(public dialogRef: MatDialogRef<CompleteRegistrationDialogComponent>) {
  }

  checkoutForm = new FormGroup({
    username: new FormControl(
      "",
      [Validators.required, Validators.minLength(5), Validators.pattern(/^[A-Za-z0-9_ -]+$/)]),
    password: new FormControl(
      "",
      [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl(
      "",
      [Validators.required]),
  }, {
    validators: [this.confirmPasswordValidator, this.passwordValidator]
  })

  private confirmPasswordValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      const confirmPasswordControl = control.get('confirmPassword')
      confirmPasswordControl?.setErrors({mismatch: true, ...confirmPasswordControl?.errors});
    }

    return null;
  }

  private passwordValidator(control: AbstractControl) {
    const errors: { [key: string]: true } = {}

    const passControl = control.get('password');

    const password: string = passControl?.value

    const hasUpperCaseLetter = password.split('')
      .filter(letter => letter === letter.toUpperCase())
      .length > 0

    if (!hasUpperCaseLetter) {
      errors["hasUpperCase"] = true
    }

    const hasLowerCaseLetter = password.split('')
      .filter(letter => letter === letter.toLowerCase())
      .length > 0

    if (!hasLowerCaseLetter) {
      errors["hasLowerCase"] = true
    }

    const hasDigit = password.split('')
      .filter(letter => !isNaN(Number(letter)))
      .length > 0

    if (!hasDigit) {
      errors["hasDigit"] = true
    }

    const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*"]
    const hasSpecialChar = password.split('')
      .filter(letter => specialChars.includes(letter))
      .length > 0

    if (!hasSpecialChar) {
      errors["hasSpecialChar"] = true
    }

    if (Object.keys(errors).length) {
      passControl?.setErrors({...passControl?.errors, ...errors});
    }

    return null;
  }

  submitForm() {
    console.log("Trying to submit form", this.checkoutForm.valid, this.checkoutForm)
    if (!this.checkoutForm.valid) {
      this.checkoutForm.markAllAsTouched()
      return
    }

    this.dialogRef.close({
      complete: true,
      username: this.checkoutForm.get("username")?.value,
      password: this.checkoutForm.get("password")?.value,
      confirmPassword: this.checkoutForm.get("confirmPassword")?.value,
    })
  }
}
