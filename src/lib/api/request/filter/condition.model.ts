import { QueryOperator } from "./query-operator.model"

export const NO_RELATION: string = ''

export const UNIQUE: boolean = true
export const NOT_UNIQUE: boolean = false


export class Condition {
    field: string
    operation: QueryOperator
    value: string | number | boolean
    relation?: string

    constructor(
        field: string,
        value: string | number | boolean,
        operation = QueryOperator.EQUAL,
        relation = NO_RELATION
    ) {
        this.field = field
        this.operation = operation
        this.value = value

        if (relation) 
            this.relation = relation

        if (operation === QueryOperator.LIKE) {

            if (typeof value !== 'string')
                throw new Error('Condition: QueryOperator LIKE only supports strings')

            this.value = `%${value}%`
        }
    }
}
