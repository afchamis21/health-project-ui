import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";

export type CheckoutDialogInput = {
  email?: string
}

export type CheckoutDialogOutput = {
  complete: false
} | {
  complete: true,
  email: string
}

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './checkout-dialog.component.html',
  styleUrl: './checkout-dialog.component.css'
})
export class CheckoutDialogComponent {
  constructor(public dialogRef: MatDialogRef<CheckoutDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: CheckoutDialogInput) {
  }

  checkoutForm = new FormGroup({
    email: new FormControl({
      value: this.data.email || "",
      disabled: !!this.data.email
    }, [Validators.required, Validators.email]),
  })

  closeDialog() {
    this.dialogRef.close({
      complete: false
    });
  }

  submitForm() {
    if (!this.checkoutForm.valid && !this.data.email) {
      this.checkoutForm.markAllAsTouched()
      return
    }

    this.dialogRef.close({
      email: this.checkoutForm.get("email")?.value,
      complete: true
    })
  }
}
