import {IsInt} from "class-validator";

export class CreateDemandDto {
    @IsInt()
    status:number
    @IsInt()
    user:any
    @IsInt()
    group:any
}