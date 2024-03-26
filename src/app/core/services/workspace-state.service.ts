import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Workspace} from "../types/workspace";
import {ActivatedRoute, Router} from "@angular/router";
import {WorkspaceService} from "./workspace.service";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceStateService {
  private workspaceIdRouteParam = "workspaceId"
  private localStorageKey = "workspace-id"

  private workspaceSubject = new BehaviorSubject<Workspace | null>(null)

  get workspace$(): Observable<Workspace | null> {
    return this.workspaceSubject.asObservable();
  }

  constructor(private route: ActivatedRoute, private router: Router, private workspaceService: WorkspaceService) {
    this.route.queryParams.subscribe(params => {
      let workspaceId = params[this.workspaceIdRouteParam]
      if (!workspaceId) {
        workspaceId = localStorage.getItem(this.localStorageKey)
        if (workspaceId) {
          this.selectWorkspace(workspaceId)
          return
        }
      }

      if (workspaceId) {
        this.workspaceService.fetchWorkspace(workspaceId).subscribe({
          next: (response => {
            if (response.body) {
              this.workspaceSubject.next(response.body)
              localStorage.setItem(this.localStorageKey, workspaceId)
            }
          }),
          error: () => {
            this.clearState()
          }
        })
      }
    })
  }

  selectWorkspace(workspaceId: number) {
    const routeParams = {
      ...this.route.snapshot.queryParams,
      [this.workspaceIdRouteParam]: workspaceId
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: routeParams
    });
  }

  deselectWorkspace() {
    const routeParams = {
      ...this.route.snapshot.queryParams,
      [this.workspaceIdRouteParam]: null
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: routeParams
    });
  }

  clearState() {
    localStorage.removeItem(this.localStorageKey)
    this.deselectWorkspace()
  }
}
