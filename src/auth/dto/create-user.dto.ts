import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(1, 50)
    firstname: string 
    @IsString()
    @Length(1, 50)
    lastname: string
    @IsString()
    @Length(1, 50)
    @IsEmail()
    email: string
    @IsString()
    @Length(12, 100)
    password: string
    @IsString()
    @Length(1, 250)
    address: string
    @IsString()
    @Length(1, 20)
    zip: string
    @IsString()
    @Length(1,50)
    city: string
    @IsString()
    @Length(1,20)
    phone: string
    @IsOptional()
    @IsString()
    @Length(1, 50)
    @IsNotEmpty()
    name: string
    @IsOptional()
    @IsString()
    @Length(1, 50)
    additionalInfos: string
    @IsOptional()
    @IsString()
    @Length(0, 255)
    description: string
   
}