import { HttpParams } from "@angular/common/http";
import { ApiRequest } from "../../request/request.model";

export interface ParserProvider {
    toHttpParams(request: ApiRequest): HttpParams

    toFormData(request: ApiRequest): FormData
}