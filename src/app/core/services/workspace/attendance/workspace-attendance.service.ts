import {Injectable} from '@angular/core';
import {ClockInRequest, GetAttendanceResponse} from "../../../types/attendance";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WorkspaceAttendanceService {
  private baseUrl = environment.apiURL + "/workspace"

  constructor(private http: HttpClient) {
  }

  clockIn(clockInRequest: ClockInRequest) {
    return this.http.post<GetAttendanceResponse>(`${this.baseUrl}/clock-in`, clockInRequest)
  }

  clockOut() {
    return this.http.post<GetAttendanceResponse>(`${this.baseUrl}/clock-out`, {})
  }
}
