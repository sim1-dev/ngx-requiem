import { Condition, NO_RELATION, UNIQUE } from "./condition.model"
import { QueryOperator } from "./query-operator.model"

/*
    Supporting "any" here allows more flexibility. 
    You can avoid passing type completely and be allowed to filter for any string. 
    Beware for the potential implications tho...
*/
export class ApiRequestFilter<TDto = any> {
    conditions: Condition[] = []
    
    addCondition(
        field: Extract<keyof TDto, string>, 
        operation = QueryOperator.EQUAL,
        value: string | number | boolean, 
        relation: string = NO_RELATION, 
        unique: boolean = UNIQUE
    ) {
        if(!this.conditionValueIsValid(value))
            return this

        let condition: Condition = new Condition(field, value, operation, relation) 

        if(unique) {
            if(this.conditionAlreadyExists(condition))
                return this
        }
        
        this.conditions.push(condition)



        this.removeEmptyConditions()

        return this
    }

    conditionValueIsValid(value: string | number | boolean): boolean {
        if(typeof(value) === 'string' && value.length === 0)
            return false

        if(typeof(value) === 'number' && !isFinite(value))
            return false

        return true
    }

    conditionAlreadyExists(condition: Condition): boolean {
        return this.conditions.some(
            c => c.field === condition.field
            && c.relation === condition.relation
        )
    }


    removeEmptyConditions(): this {
        this.conditions = this.conditions.filter((condition: Condition) => {
            return condition.value !== "" 
                && condition.value !== null 
                && condition.value !== undefined
        })

        return this
    }
}