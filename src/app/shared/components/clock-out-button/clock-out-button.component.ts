import {Component, OnInit} from '@angular/core';
import {User} from "../../../core/types/user";
import {UserStateService} from "../../../core/services/user/user-state.service";
import {PatientStateService} from "../../../core/services/patient/patient-state.service";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";
import {PatientSummary} from "../../../core/types/patient";

@Component({
  selector: 'app-clock-out-button',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './clock-out-button.component.html',
  styleUrl: './clock-out-button.component.css'
})
export class ClockOutButtonComponent implements OnInit {
  user: User | null = null
  patient: PatientSummary | null = null
  subscriptions: Subscription[] = []

  constructor(protected userStateService: UserStateService, private patientStateService: PatientStateService) {
  }

  ngOnInit(): void {
    const user$ = this.userStateService.user$.subscribe({
      next: user => {
        this.user = user
      }
    })

    const patient$ = this.patientStateService.patientSummary$.subscribe({
      next: value => {
        this.patient = value
      }
    })

    this.subscriptions.push(user$, patient$)
  }
}
