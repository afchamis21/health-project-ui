import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PatientStateService} from "../../../../core/services/patient/patient-state.service";
import {NgClass, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {SubscriptionUtils} from "../../../../shared/utils/subscription-utils";
import {MatIconModule} from "@angular/material/icon";
import {PatientSummary} from "../../../../core/types/patient";

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [
    NgClass,
    MatIconModule,
    NgIf
  ],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.css'
})
export class PatientCardComponent implements OnInit, OnDestroy {
  @Input() patientSummary!: PatientSummary
  @Input() isOpen!: boolean

  isSelected = false

  subscriptions: Subscription[] = []

  abbreviatedName = ''

  constructor(private patientStateService: PatientStateService) {
  }

  selectPatient() {
    this.patientStateService.selectPatient(this.patientSummary.patientId)
  }

  ngOnInit(): void {
    const isActiveSubscription = this.patientStateService.patientSummary$.subscribe((value) => {
      this.isSelected = value?.patientId === this.patientSummary.patientId
    })

    this.subscriptions.push(isActiveSubscription)

    this.abbreviatedName = this.patientSummary.name.split(' ')
      .map(word => word.at(0)?.toUpperCase())
      .join('')
  }

  ngOnDestroy(): void {
    SubscriptionUtils.unsubscribe(this.subscriptions)
  }
}
