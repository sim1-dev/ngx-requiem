// page < 0 || size < 0 -> No pagination
// page = 1 -> First page

export const DEFAULT_PAGE = 1
export const DEFAULT_SIZE = 20

export class ApiRequestPagination {
    page: number
    size: number

    active: boolean

    constructor() {
        this.page = 0
        this.size = 0
        this.active = false
    }

    setPage(page: number): this {
        this.page = page
        return this
    }

    // elements per page
    setSize(size: number): this {
        this.size = size
        return this
    }
    

    nextPage(): this {
        this.page++
        return this
    }

    previousPage(): this {
        if(this.page > 1)
            this.page--

        return this
    }


    
    reset(): this {
        this.resetPage()
        this.resetSize()
        return this
    }


    resetPage(): this {
        this.active 
            ? this.page = DEFAULT_PAGE
            : this.page = 0
        return this
    }

    resetSize(): this {
        this.active
            ? this.size = DEFAULT_SIZE
            : this.size = 0
        return this
    }

}