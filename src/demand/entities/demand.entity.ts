import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupEntity } from "../../group/entities/group.entity";
import { DemandsStatusEnum } from "./demands.status.enum";

@Entity({name:"demand"})
export class DemandEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "enum", enum: DemandsStatusEnum, default: DemandsStatusEnum.PENDING})
    status: DemandsStatusEnum

    @ManyToOne(() => UserEntity, (user) => user.demands) user: UserEntity

    @ManyToOne(() => GroupEntity, (group) => group.demands) group: GroupEntity
}