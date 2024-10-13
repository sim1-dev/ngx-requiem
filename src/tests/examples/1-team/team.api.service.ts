import { Team } from "./team.model"
import { TeamRequest } from "./team.request.model"

import { ApiResponse } from "../../../lib/api/response/response.model"
import { Observable } from "rxjs"
import { Injectable } from "@angular/core"
import { ApiService } from "../../../lib/api/api.service"

@Injectable({
    providedIn: 'root'
})
export class TeamApiService {
    url: string = '/teams'

    constructor(private api: ApiService) {}

    getTeams(request: TeamRequest): Observable<ApiResponse<Team[]>> {
        return this.api.get<Team[]>(`${this.url}`, request)
    }

    performActionTeam(request: TeamRequest): Observable<ApiResponse<Team>> {
        return this.api.post<Team>(`${this.url}/action`, request)
    }

}