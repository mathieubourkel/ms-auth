import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"tokens"})
export class TokensEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type:"varchar"})
    refreshToken: string;

    @Column({type:"varchar"})
    token: string;

    @Column({type:"varchar"})
    validationToken: string;

    @Column({type:"varchar"})
    emailToken: string;

    @OneToOne  (() => UserEntity, user => user.tokens) user: UserEntity;

}