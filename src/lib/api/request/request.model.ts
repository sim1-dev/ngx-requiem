import { HttpParams } from "@angular/common/http"
import { Condition } from "./filter/condition.model"
import { ApiRequestFilter } from "./filter/filter.model"
import { ApiRequestOrder } from "./order/order.model"
import { ApiRequestPagination } from "./pagination/pagination.model"
import { getOperator } from "./filter/query-operator.model"


// Filter argument describes the condition model. 
// You will be forced to use Dto types as condition fields
export abstract class ApiRequest<
    TFilter extends ApiRequestFilter<any> = ApiRequestFilter<any>, 
    TOrder extends ApiRequestOrder = ApiRequestOrder, 
    TPagination extends ApiRequestPagination = ApiRequestPagination
> {
    filter: TFilter
    order: TOrder
    pagination: TPagination

    [key: string]: any

    constructor(
        filter?: TFilter, 
        order?: TOrder, 
        pagination?: TPagination
    ) {
        this.filter = filter || new ApiRequestFilter<any>() as TFilter
        this.order = order || new ApiRequestOrder() as TOrder
        this.pagination = pagination || new ApiRequestPagination() as TPagination
    }

    toHttpParams(): HttpParams {
        let params = new HttpParams()

        params = this._appendBody(params)
        params = this._appendFilters(params)
        params = this._appendOrder(params)
        params = this._appendPagination(params)

        return params
    }


    toFormData(): FormData {
        let formData = new FormData()

        const requestFields: string[] = this._getRequestFields()

        if (requestFields?.length > 0) {
            requestFields.forEach((requestField: string) => {
                let field: any = this[requestField]

                if (!field) 
                    return

                if (field instanceof Date)
                    field = field.toISOString()

                formData.append(requestField, field)
            })
        }

        return formData
    }

    setFilter(filter: TFilter): this {
        this.filter = filter
        this.order.reset()
        this.pagination.resetPage()
        return this
    }

    setOrder(order: TOrder): this {
        this.order = order
        this.pagination.resetPage()
        return this
    }

    setPagination(pagination: TPagination): this {
        pagination.active = true
        this.pagination = pagination
        return this
    }




    private _getRequestFields(): string[] {
        return Object.getOwnPropertyNames(this).filter((requestField: string) => {
            return requestField !== 'filter'
                && requestField !== 'order'
                && requestField !== 'pagination'
        })
    }

    private _appendBody(params: HttpParams): HttpParams {
        const requestFields: string[] = this._getRequestFields()

        if (requestFields?.length > 0) {
            requestFields.forEach((requestField: string) => {
                if (this[requestField])
                    params = params.append(requestField, this[requestField])
            })
        }

        return params
    }

    private _appendFilters(params: HttpParams): HttpParams {
        if (this.filter.conditions?.length > 0) {
            this.filter.conditions.forEach((condition: Condition) => {
                params = params.append(`${condition.field}[${condition.operation}]`, condition.value)
            })
        }

        return params
    }

    private _appendOrder(params: HttpParams): HttpParams {
        if (this.order.field) {
            params = params.append('orderField', this.order.field)
            params = params.append('orderDirection', this.order.direction)
        }

        return params
    }

    private _appendPagination(params: HttpParams): HttpParams {
        if (this.pagination.page > 0) {
            params = params.append('paginationPage', this.pagination.page)
            params = params.append('paginationSize', this.pagination.size)
        }

        return params
    }

        // toHttpParamsLegacy(): HttpParams {
    //     let params = new HttpParams()

    //     // HTTP body params
    //     const requestFields: string[] = this._getRequestFields()

    //     if (requestFields?.length > 0) {
    //         requestFields.forEach((requestField: string) => {
    //             if (this[requestField])
    //                 params = params.append(requestField, this[requestField])
    //         })
    //     }

    //     // filters
    //     if (this.filter.conditions?.length > 0) {
    //         this.filter.conditions = this.filter.conditions.filter((condition: Condition) => {
    //             return condition.value !== "" && condition.value !== null && condition.value !== undefined
    //         })

    //         params = params.set('filters', JSON.stringify(this.filter))
    //     }

    //     // order
    //     if (this.order.field)
    //         params = params.set('order', JSON.stringify(this.order))

    //     // pagination
    //     if (this.pagination.page > 0)
    //         params = params.set('pagination', JSON.stringify(this.pagination))

    //     return params
    // }
}