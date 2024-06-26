import {User} from "../../../core/types/user";
import {EventEmitter} from "@angular/core";
import {PatientSummary} from "../../../core/types/patient";

export interface Menu {
  user: User | null;
  patientSummaries: PatientSummary[];
  isMenuOpen: boolean;
  onCreatePatient: EventEmitter<void>;
  onToggleMenu: EventEmitter<void>;

  createPatient(): void;

  toggleMenu(): void;
}
