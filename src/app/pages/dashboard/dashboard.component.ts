import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../core/services/auth.service";
import {
  CompleteRegistrationDialog,
  CompleteRegistrationDialogComponent
} from "./components/complete-registration-dialog/complete-registration-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {User} from "../../core/types/user";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  user: User | null = null

  constructor(private authService: AuthService, private dialog: MatDialog, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    const userSubscription = this.authService.user$.subscribe(user => {
      this.user = user
      if (user && !user.isRegistrationComplete) {
        this.openCompleteRegistrationDialog()
      }
    })


    this.subscriptions.push(userSubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    })
  }

  openCompleteRegistrationDialog() {
    const dialogRef = this.dialog.open(CompleteRegistrationDialogComponent)

    dialogRef.afterClosed().subscribe((value: CompleteRegistrationDialog) => {
      console.log("Form Submitted:")
      console.table(value)
      if (!value.complete) {
        return
      }

      this.authService.completeRegistration({
        ...value
      }).subscribe({
        next: () => {
          this.toastr.success("Usuário atualizado com sucesso!")
          this.authService.forceLogout()
        }
      })
    })
  }
}
