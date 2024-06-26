import { IsInt, IsNumber, IsOptional, IsString, Length, Max } from 'class-validator';

export class UpdateUserDto  {
    @IsOptional()
    @IsString()
    @Length(1, 50)
    firstname: string
    @IsOptional()
    @IsString()
    @Length(1, 50)
    lastname: string
    @IsOptional()
    @IsString()
    @Length(1, 250)
    address: string
    @IsOptional()
    @IsString()
    @Length(1, 20)
    zip: string
    @IsOptional()
    @IsString()
    @Length(1,50)
    city: string
    @IsOptional()
    @IsString()
    @Length(1,20)
    phone: string
    @IsOptional()
    @IsInt()
    @Max(5)
    status: number
}
