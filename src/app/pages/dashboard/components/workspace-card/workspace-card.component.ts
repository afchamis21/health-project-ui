import {Component, Input} from '@angular/core';
import {Workspace} from "../../../../core/types/workspace";

@Component({
  selector: 'app-workspace-card',
  standalone: true,
  imports: [],
  templateUrl: './workspace-card.component.html',
  styleUrl: './workspace-card.component.css'
})
export class WorkspaceCardComponent {
  @Input("workspace") workspace!: Workspace
}
