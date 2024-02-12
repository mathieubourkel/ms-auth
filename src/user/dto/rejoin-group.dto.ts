import { IsInt, IsOptional, Min } from "class-validator";

export class RejoinGroupDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    id: number
}