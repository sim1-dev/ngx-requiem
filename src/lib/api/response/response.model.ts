export interface ApiResponse<TDto> {
    success: boolean
    
    dto?: TDto
    total?: number
}