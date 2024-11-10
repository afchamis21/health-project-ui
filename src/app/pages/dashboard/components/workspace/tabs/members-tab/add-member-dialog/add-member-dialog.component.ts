import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";

export type AddMemberDialogReturn = {
  complete: false
} | {
  complete: true,
  value: {
    email: string
    description: string
  }
}

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './add-member-dialog.component.html',
  styleUrl: './add-member-dialog.component.css'
})
export class AddMemberDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddMemberDialogComponent, AddMemberDialogReturn>) {
  }

  addMemberForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    description: new FormControl('', [Validators.required])
  })

  close() {
    this.dialogRef.close({
      complete: false,
    })
  }

  submitForm() {
    if (!this.addMemberForm.valid) {
      this.addMemberForm.markAllAsTouched()
      return
    }

    this.dialogRef.close({
      complete: true,
      value: {
        email: this.addMemberForm.controls.email.value!,
        description: this.addMemberForm.controls.description.value!,
      }
    })
  }
}
