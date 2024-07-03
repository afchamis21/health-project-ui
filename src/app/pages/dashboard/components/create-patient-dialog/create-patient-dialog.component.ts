import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {cpfDocumentValidator, rgDocumentValidator} from "../../../../core/validators/form-validators";
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

  telefoneRegex = /^(\(\d{2}\)|\d{2})\s?9?\d{4}[-\s]?\d{4}$/;
  rgRegex = /^(\d{2}\.\d{3}\.\d{3}-[0-9Xx]|\d{8}[0-9Xx])$/;
  cpfRegex = /^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;

  createPatientForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    rg: new FormControl('', [Validators.required, Validators.pattern(this.rgRegex)]),
    cpf: new FormControl('', [Validators.required, Validators.pattern(this.cpfRegex)]),
    contactPhone: new FormControl('', [Validators.required, Validators.pattern(this.telefoneRegex)]),
    dateOfBirth: new FormControl(null, [Validators.required]),
    gender: new FormControl<"MALE" | "FEMALE" | "NOT_SPECIFIED" | null>(null, [Validators.required]),
  }, {
    validators: [rgDocumentValidator, cpfDocumentValidator]
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

  handleFormatPhone($event: Event) {
    const formatPhone = (phone: string) => {
      const digits: string = phone.replace(/[^0-9]/g, '');
      if (digits.length === 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
      } else if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
      } else {
        return phone
      }
    }

    const inputElement = ($event.target as HTMLInputElement)

    const phone = inputElement.value
    const formattedPhone = formatPhone(phone)
    if (phone === formattedPhone) {
      return
    }

    this.createPatientForm.controls.contactPhone.setValue(formattedPhone)
  }
}
