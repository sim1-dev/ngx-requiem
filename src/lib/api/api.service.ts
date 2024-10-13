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
