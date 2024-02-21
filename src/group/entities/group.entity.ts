import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DemandEntity } from "../../demand/entities/demand.entity";

@Entity({name:"group"})
export class GroupEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type:"varchar"})
    name: string;

    @Column({type:"varchar"})
    additionalInfos: string;

    @Column({type:"varchar"})
    description: string;

    @ManyToOne (() => UserEntity, owner => owner.myOwnGroups, { onDelete: "CASCADE" }) owner:UserEntity;
    @OneToMany (() => DemandEntity, demand => demand.group) demands: DemandEntity[];
    
}