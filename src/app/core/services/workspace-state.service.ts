import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Workspace} from "../types/workspace";
import {ActivatedRoute} from "@angular/router";
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

  constructor(private route: ActivatedRoute, private workspaceService: WorkspaceService) {
    this.route.queryParams.subscribe(params => {
      let workspaceId = params[this.workspaceIdRouteParam]
      if (!workspaceId) {
        workspaceId = localStorage.getItem(this.localStorageKey)
        console.log(workspaceId)
      }

      if (workspaceId) {
        this.workspaceService.fetchWorkspace(workspaceId).subscribe({
          next: (response => {
            if (response.body) {
              this.workspaceSubject.next(response.body)
              localStorage.setItem(this.localStorageKey, workspaceId)
            }
          })
        })
      }
    })
  }

  selectWorkspace(workspace: Workspace) {
    this.workspaceSubject.next(workspace)
  }

  deselectWorkspace() {
    this.workspaceSubject.next(null)
  }
}
