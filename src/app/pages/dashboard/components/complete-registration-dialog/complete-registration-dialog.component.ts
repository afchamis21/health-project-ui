import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {confirmPasswordValidator, passwordValidator} from "../../../../core/validators/form-validators";

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
    validators: [confirmPasswordValidator, passwordValidator]
  })

  submitForm() {
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
