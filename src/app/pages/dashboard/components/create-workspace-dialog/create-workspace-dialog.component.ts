import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";

export type CreateWorkspaceDialogReturn = {
  complete: false
} | {
  complete: true
  value: {
    name: string
  }
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

  createWorkspaceForm = new FormGroup({
    name: new FormControl('', [Validators.required])
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
      value: {
        name: this.createWorkspaceForm.controls.name.value!,
      }
    })
  }
}
