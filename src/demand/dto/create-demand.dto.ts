import { IsInt, Max, ValidateNested } from "class-validator"

export class GroupDto {
    id: number
}

export class UserDto {
    id: number
}

export class CreateDemandDto {
    @ValidateNested()
    group: GroupDto
    
    @ValidateNested()
    user: UserDto

    @IsInt()
    @Max(3)
    status:number
}

