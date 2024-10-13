# [wip] Angular Requiem

## Simple HTTP API with filter, order and pagination support

⚠️ **Disclaimer**: This library is intended for experimental purposes only. **Do not use it in production environments**! It was created for play and exploration.

**NgxRequiem** is an Angular library designed to simplify the creation and management of REST API requests. It includes standardized structures for API requests and responses, allowing for intuitive filtering, sorting, and pagination.

## Installation

You can install `ngx-requiem` using npm:

```bash
npm install ngx-requiem
```
## Configuration
To configure the library in your application, import the NgxRequiemModule into your main module and provide your API configuration with the 'apiConfig' section inside your environment file.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxRequiemModule } from 'ngx-requiem';
import { ApiConfig } from 'ngx-requiem';
import { environment } from './environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxRequiemModule.forRoot(environment.apiConfig as ApiConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
## Usage
ApiRequest and ApiResponse are used to manage API requests and responses in a standardized way.

1) Create an api service:
```typescript
import { Router } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiRequest } from './request/request.model';
import { ApiResponse } from './response/response.model';

import { API_CONFIG, ApiConfig } from './api-config.token';

@Injectable()
export class ApiService {
  
    constructor(
      private http: HttpClient, 
      public router: Router, 
      // you can also pass your environment here
      @Inject(API_CONFIG) private config: ApiConfig
    ) { }


  get<T>(path: string, request: ApiRequest): Observable<ApiResponse<T>> {
    const params: HttpParams = request.toHttpParams()

    return this.http
      .get<ApiResponse<T>>(`${this.config.url}${path}`, { params })
  }

  getFile(path: string): Observable<unknown> {
    return this.http
      .get(`${this.config.url}${path}`, { responseType: 'blob' as 'json' })
  }



  post<T>(path: string, request: ApiRequest): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(`${this.config.url}${path}`, request)
  }

  postMultipart<T>(path: string, request: ApiRequest): Observable<ApiResponse<T>> {
    const formData: FormData = request.toFormData()

    return this.http
      .post<ApiResponse<T>>(`${this.config.url}${path}`, formData)
  }



  put<T>(path: string, request: ApiRequest): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(`${this.config.url}${path}`, request)
  }

  patch<T>(path: string, request: ApiRequest): Observable<ApiResponse<T>> {
    return this.http
      .patch<ApiResponse<T>>(`${this.config.url}${path}`, request)
  }




  delete<T>(path: string, request: ApiRequest): Observable<ApiResponse<T>> {
    
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      request
    }

    return this.http
      .delete<ApiResponse<T>>(`${this.config.url}${path}`, options)
  }

  
}
```

2) Create a custom request for your entity:
```typescript
// you can avoid passing types completely. Your class will reuse the standard ones
export class TeamRequest extends ApiRequest<TeamRequestFilter, TeamRequestOrder, TeamRequestPagination> {
    teamName?: string
    action?: string

    setTeamName(teamName: string): this {
        this.teamName = teamName
        return this
    }

    setAction(action: string): this {
        this.action = action
        return this
    }
}

// optional generic type in the filter allows you to force developers to only pass dto names as conditions
export class TeamRequestFilter extends ApiRequestFilter<Team> {}
export class TeamRequestOrder extends ApiRequestOrder {}
export class TeamRequestPagination extends ApiRequestPagination {}
```
3) Create the service for your entity API:
```typescript
import { ApiService } from "../../../public-api"
import { Team } from "./team.model"
import { TeamRequest } from "./team.request.model"

import { ApiResponse } from "../../../lib/api/response/response.model"
import { Observable } from "rxjs"
import { Injectable } from "@angular/core"

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
```

4) Compose your request
```typescript
import { Component } from '@angular/core';
import { ApiService } from 'ngx-requiem';
import { ApiResponse } from 'ngx-requiem';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-teams',
})
export class TeamComponent implements OnInit {
  teams: Team[]
  
  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.getTeams()
  }

  getItems(): void {
      const request: TeamRequest = new TeamRequest()
        .setFilter(new TeamRequestFilter()
            .addCondition('id', QueryOperator.GREATER, 5)
            .addCondition('name', QueryOperator.LIKE, 'TeamBallo')
            // this errors, price is not a valid Team property as per TeamRequestFilter composition
            //.addCondition('price', QueryOperator.EQUAL, 54.2)
        )
        .setOrder(new TeamRequestOrder()
            .setField('id')
            .setDirection(OrderDirection.ASC)
        )
        .setPagination(new TeamRequestPagination()
            .setPage(3)
            .setSize(20)
        )

      this.teamServce.getTeams(request).pipe(
        tap((response: ApiResponse<Team[]>) => expect(response).toEqual(mockResponse)),
        map((response: ApiResponse<Team[]>) => response.dto as Team[])
      )
      .subscribe((teams: Team[]) => {
        this.teams = teams
      })
  }
}
```

## Examples
The library also contains some examples of real world usage.
For more informations check either tests runner or the tests/examples folder.

## Documentation
For further details on using the library, please refer to the official documentation in your source code or repository.

## Contributing
If you would like to contribute to NgxRequiem, feel free to open an issue or a pull request in the repository.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.