import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {PatientSummary} from "../../types/patient";
import {PatientService} from "./patient.service";

@Injectable({
  providedIn: 'root'
})
export class PatientStateService {
  private patientIdRouteParam = "patientId"
  private localStorageKey = "patient-id"

  private patientSummarySubject = new BehaviorSubject<PatientSummary | null>(null)

  get patientSummary$(): Observable<PatientSummary | null> {
    return this.patientSummarySubject.asObservable();
  }

  constructor(private route: ActivatedRoute, private router: Router, private patientService: PatientService) {
    this.route.queryParams.subscribe(params => {
      let patientId = params[this.patientIdRouteParam]
      if (!patientId) {
        patientId = localStorage.getItem(this.localStorageKey)
        if (patientId) {
          this.selectPatient(patientId)
          return
        }
      }

      if (patientId) {
        this.patientService.fetchPatientSummary(patientId).subscribe({
          next: (response => {
            if (response.body) {
              this.patientSummarySubject.next(response.body)
              localStorage.setItem(this.localStorageKey, patientId)
            }
          }),
          error: () => {
            this.clearState()
          }
        })
      }
    })
  }

  selectPatient(patientId: number) {
    const routeParams = {
      ...this.route.snapshot.queryParams,
      [this.patientIdRouteParam]: patientId
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: routeParams
    });
  }

  deselectPatient() {
    const routeParams = {
      ...this.route.snapshot.queryParams,
      [this.patientIdRouteParam]: null
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: routeParams
    });
  }

  clearState() {
    localStorage.removeItem(this.localStorageKey)
    this.deselectPatient()
  }
}
