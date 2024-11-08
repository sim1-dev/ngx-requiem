import { HttpParams } from '@angular/common/http';
import { ParserProvider } from './parser.provider';
import { ApiRequest } from '../../request/request.model';
import { ApiRequestFilter } from '../../request/filter/filter.model';
import { ApiRequestPagination } from '../../request/pagination/pagination.model';
import { ApiRequestOrder } from '../../request/order/order.model';

// MOESIF-like implementation
// https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/
// The current standard mode. Any improvement tip is welcomed
export class MoesifParserProvider implements ParserProvider {
    toHttpParams(request: ApiRequest): HttpParams {
        let params = new HttpParams()

        params = this.appendBody(params, request)
        params = this.appendFilters(params, request.filter)
        params = this.appendOrder(params, request.order)
        params = this.appendPagination(params, request.pagination)

        return params
    }

    toFormData(request: ApiRequest): FormData {
        const formData = new FormData()

        request.getRequestFields().forEach((field) => {
            let value = request[field]

                if (value instanceof Date) 
                    value = value.toISOString()

            formData.append(field, value)
        })

        return formData
    }








    private appendBody(params: HttpParams, request: ApiRequest): HttpParams {
        request.getRequestFields().forEach((field) => {
            if (request[field] !== undefined)
                params = params.append(field, request[field])
        })

        return params
    }

    private appendFilters(params: HttpParams, filter: ApiRequestFilter<any>): HttpParams {
        filter.conditions.forEach((condition) => {
            params = params.append(`${condition.field}[${condition.operation}]`, condition.value)
        })
        return params
    }

    private appendOrder(params: HttpParams, order: ApiRequestOrder): HttpParams {
        if (order.field)
            params = params.append('orderField', order.field).append('orderDirection', order.direction)

        return params
    }

    private appendPagination(params: HttpParams, pagination: ApiRequestPagination): HttpParams {
        if (pagination.page > 0)
            params = params.append('paginationPage', pagination.page).append('paginationSize', pagination.size)

        return params
    }
}
