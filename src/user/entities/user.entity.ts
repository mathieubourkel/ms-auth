import { Column, Entity, JoinColumn,  ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRoleEnum } from "../../../enums/user.role.enum";
import { UserStatusEnum } from "../../../enums/user.status.enum";
import { GroupEntity } from "src/group/entities/group.entity";
import { TokensEntity } from "src/tokens/entities/tokens.entity";
import { DemandEntity } from "src/demand/entities/demand.entity";

@Entity({name:"user"})
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type:"varchar"})
    firstname: string;

    @Column({type:"varchar"})
    lastname: string;

    @Column({type:"varchar"})
    email: string;

    @Column({type:"varchar", select: false})
    password: string;

    @Column({type: "varchar"})
    address: string

    @Column({type:"varchar"})
    zip: string;

    @Column({type:"varchar"})
    city: string;

    @Column({type:"varchar"})
    phone: string;

    @Column({type:"int", default:0})
    count: number;

    @Column({type:"enum", enum: UserStatusEnum, default: UserStatusEnum.PENDING})
    status: UserStatusEnum;

    @Column({type:"enum", enum: UserRoleEnum, default: UserRoleEnum.USER})
    role: UserRoleEnum;

    @OneToMany (() => GroupEntity, group => group.owner, {cascade: ["remove"]}) myOwnGroups: GroupEntity[];

    @OneToMany (() => DemandEntity, demand => demand.user) demands: DemandEntity[];

    @OneToOne  (() => TokensEntity, tokens => tokens.user) 
    @JoinColumn()
    tokens: TokensEntity;



}