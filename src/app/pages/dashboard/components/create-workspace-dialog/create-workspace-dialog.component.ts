import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {CreateWorkspaceRequest} from "../../../../core/types/workspace";
import {rgDocumentValidator} from "../../../../core/validators/form-validators";

export type CreateWorkspaceDialogReturn = {
  complete: false
} | {
  complete: true
  value: CreateWorkspaceRequest
}

@Component({
  selector: 'app-create-workspace-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIconModule
  ],
  templateUrl: './create-workspace-dialog.component.html',
  styleUrl: './create-workspace-dialog.component.css'
})
export class CreateWorkspaceDialogComponent {
  constructor(public dialogRef: MatDialogRef<CreateWorkspaceDialogComponent, CreateWorkspaceDialogReturn>) {
  }

  telefoneRegex = /^(\([1-9]{2}\) 9?[0-9]{4}\-[0-9]{4}|\([1-9]{2}\) [2-9][0-9]{3,4}\-[0-9]{4})$/;
  rgRegex = /^(\d{2}\.\d{3}\.\d{3}-[0-9Xx]|\d{8}[0-9Xx])$/;

  createWorkspaceForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    document: new FormControl('', [Validators.required, Validators.pattern(this.rgRegex)]),
    contactPhone: new FormControl('', [Validators.required, Validators.pattern(this.telefoneRegex)]),
    dateOfBirth: new FormControl(new Date(1900, 1, 1), [Validators.required]),
    gender: new FormControl<"MALE" | "FEMALE" | "NOT_SPECIFIED" | "UNKNOWN">("UNKNOWN", [Validators.required]),
  }, {
    validators: [rgDocumentValidator]
  })

  close() {
    this.dialogRef.close({
      complete: false,
    })
  }

  submitForm() {
    if (!this.createWorkspaceForm.valid) {
      this.createWorkspaceForm.markAllAsTouched()
      return
    }


    this.dialogRef.close({
      complete: true,
      value: this.createWorkspaceForm.value as unknown as CreateWorkspaceRequest
    })
  }
}
