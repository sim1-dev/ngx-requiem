export enum OrderDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export class ApiRequestOrder {
    field: string
    direction: OrderDirection

    constructor() {
        this.field = ""
        this.direction = OrderDirection.ASC
    }

    setField(field: string): this {
        this.field = field
        return this
    }

    setDirection(direction: OrderDirection): this {
        this.direction = direction
        return this
    }

    reset(): this {
        this.field = ""
        this.direction = OrderDirection.ASC
        return this
    }

}