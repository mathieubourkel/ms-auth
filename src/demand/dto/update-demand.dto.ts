import { IsInt, Max } from "class-validator"

export class UpdateDemandDto {
    @IsInt()
    @Max(3)
    status:number
}
