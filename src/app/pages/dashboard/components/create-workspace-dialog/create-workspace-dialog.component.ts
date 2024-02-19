import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-workspace-dialog',
  standalone: true,
  imports: [],
  templateUrl: './create-workspace-dialog.component.html',
  styleUrl: './create-workspace-dialog.component.css'
})
export class CreateWorkspaceDialogComponent {
  constructor(public dialogRef: MatDialogRef<CreateWorkspaceDialogComponent>) {
  }
}
