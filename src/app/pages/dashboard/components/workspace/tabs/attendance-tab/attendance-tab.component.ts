import {Component, Input} from '@angular/core';
import {WorkspaceMember} from "../../../../../../core/types/workspace-member";

@Component({
  selector: 'app-attendance-tab',
  standalone: true,
  imports: [],
  templateUrl: './attendance-tab.component.html',
  styleUrl: './attendance-tab.component.css'
})
export class AttendanceTabComponent {
  @Input() members: WorkspaceMember[] = [];

}
