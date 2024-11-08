import { ApiRequestFilter } from "./filter/filter.model"
import { ApiRequestOrder } from "./order/order.model"
import { ApiRequestPagination } from "./pagination/pagination.model"
import { MoesifParserProvider } from "../providers/parser/moesif-parser.provider"
import { ParserProvider } from "../providers/parser/parser.provider"
import { HttpParams } from "@angular/common/http"


// Filter argument describes the condition model. 
// You will be forced to use Dto types as condition fields
export abstract class ApiRequest<
    TFilter extends ApiRequestFilter<any> = ApiRequestFilter<any>, 
    TOrder extends ApiRequestOrder = ApiRequestOrder, 
    TPagination extends ApiRequestPagination = ApiRequestPagination,
> {
    filter: TFilter
    order: TOrder
    pagination: TPagination

    parser: ParserProvider

    [key: string]: any

    constructor(
        filter?: TFilter, 
        order?: TOrder, 
        pagination?: TPagination,

        parser?: ParserProvider
    ) {
        this.filter = filter || new ApiRequestFilter<any>() as TFilter
        this.order = order || new ApiRequestOrder() as TOrder
        this.pagination = pagination || new ApiRequestPagination() as TPagination

        this.parser = parser || new MoesifParserProvider()
    }

    getRequestFields(): string[] {
        return Object.getOwnPropertyNames(this).filter((field: string) => {
            return field !== 'filter'
                && field !== 'order'
                && field !== 'pagination'
                && field !== 'parser'
        })
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

    setParser(parser: ParserProvider): this {
        this.parser = parser

        return this
    }


    

    toHttpParams(): HttpParams {
        return this.parser.toHttpParams(this)
    }

    toFormData(): FormData {
        return this.parser.toFormData(this)
    }
}