import { HttpParams } from '@angular/common/http';
import { ParserProvider } from './parser.provider';
import { ApiRequest } from '../../request/request.model';
import { Condition } from '../../request/filter/condition.model';

// Converts the object with the exact JSON structure it came from
// It works but beware of URL characters limit. It is NOT recommended to use it if you have more than 20 filters
// Legacy
export class PlainParserProvider implements ParserProvider {
    toHttpParams(request: ApiRequest): HttpParams {
        let params = new HttpParams()

        // HTTP body params
        const requestFields: string[] = request.getRequestFields()

        if (requestFields?.length > 0) {
            requestFields.forEach((field: string) => {
                if (request[field])
                    params = params.append(field, request[field])
            })
        }

        // filters
        if (request.filter.conditions?.length > 0) {
            request.filter.conditions = request.filter.conditions.filter((condition: Condition) => {
                return condition.value !== "" && condition.value !== null && condition.value !== undefined
            })

            params = params.set('filters', JSON.stringify(request.filter))
        }

        // order
        if (request.order.field)
            params = params.set('order', JSON.stringify(request.order))

        // pagination
        if (request.pagination.page > 0)
            params = params.set('pagination', JSON.stringify(request.pagination))

        return params
    }

    toFormData(request: ApiRequest): FormData {
        const formData = new FormData()

        request.getRequestFields().forEach((field) => {
            let value = request[field]
            if (value instanceof Date) value = value.toISOString()
            formData.append(field, value)
        })

        return formData
    }


}
