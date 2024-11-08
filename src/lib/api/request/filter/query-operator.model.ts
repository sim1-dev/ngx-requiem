export enum QueryOperator {
    EQUAL = 'eq',
    NOT_EQUAL = 'neq',
    LIKE = 'lke',
    GREATER = 'gte',
    GREATEREQUAL = 'gteq',
    LOWER = 'lt',
    LOWEREQUAL = 'lteq',
    IN = 'in',
}

export function getOperator(operator: string): string {
    for (const key in QueryOperator) {
        if (QueryOperator[key as keyof typeof QueryOperator] === operator)
            return key
    }

    return QueryOperator.EQUAL
}