import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {rgDocumentValidator} from "../../../../core/validators/form-validators";
import {CreatePatientRequest} from "../../../../core/types/patient";

export type CreatePatientDialogReturn = {
  complete: false
} | {
  complete: true
  value: CreatePatientRequest
}

@Component({
  selector: 'app-create-patient-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIconModule
  ],
  templateUrl: './create-patient-dialog.component.html',
  styleUrl: './create-patient-dialog.component.css'
})
export class CreatePatientDialogComponent {
  constructor(public dialogRef: MatDialogRef<CreatePatientDialogComponent, CreatePatientDialogReturn>) {
  }

  telefoneRegex = /^(\([1-9]{2}\) 9?[0-9]{4}-[0-9]{4}|\([1-9]{2}\) [2-9][0-9]{3,4}-[0-9]{4})$/;
  rgRegex = /^(\d{2}\.\d{3}\.\d{3}-[0-9Xx]|\d{8}[0-9Xx])$/;

  createPatientForm = new FormGroup({
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
    if (!this.createPatientForm.valid) {
      this.createPatientForm.markAllAsTouched()
      return
    }


    this.dialogRef.close({
      complete: true,
      value: this.createPatientForm.value as unknown as CreatePatientRequest
    })
  }
}
