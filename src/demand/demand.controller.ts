import { Controller } from "@nestjs/common";
import { BaseUtils } from "libs/base/base.utils";
import { DemandService } from "./demand.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { DemandEntity } from "./entities/demand.entity";
import { DemandsStatusEnum } from "enums/demands.status.enum";

@Controller()
export class DemandController extends BaseUtils {
  constructor(
    private readonly demandService: DemandService,
    ) {
    super()
  }

  @MessagePattern("GET_ONE_DEMAND")
  async getOneGroup(@Payload('idDemand') idDemand:number) {
    try {
      return await this.demandService.getOneById(idDemand, ['group', 'user']);
    } catch (error) {
        this._catchEx(error)
    }
  }

  @MessagePattern("MODIFY_DEMAND")
  async changeStatusDemand(@Payload() data:{demand:DemandEntity, status:number}):Promise<string> {
    try {
      const result = await this.demandService.update(data.demand, {status:data.status})
      if (!result) this._Ex("FAILED TO MODIFY DEMAND", 400, 'GC-FLD')
      return "CHANGE STATUS GROUP SUCCESFUL"
    } catch (error) {
        this._catchEx(error)
    }
  }

  @MessagePattern("DELETE_DEMAND")
  async deleteDemand(@Payload('idDemand') idDemand:number):Promise<unknown> {
    try {
      return await this.demandService.delete(idDemand)
    } catch (error) {
        this._catchEx(error)
    }
  }

  @MessagePattern("CREATE_DEMAND")
  async addGroupDemand(@Payload('idUser') idUser:number, @Payload('idGroup') idGroup:number):Promise<string> {
    try {
    const exists = await this.demandService.getOneBySearchOption({user:{id:idUser}, group:{id:idGroup}})
    if (exists) this._Ex("YOU ALREADY MADE A DEMAND", 401, "MS-AUTH-DMD-CTRL")
      const result = await this.demandService.create({user:idUser, group: idGroup, status:DemandsStatusEnum.PENDING})
      if (!result) this._Ex("FAILED TO ADD DEMAND", 400, 'GC-FLD')
      return "REJOIN GROUP SUCCESFUL"
    } catch (error) {
        this._catchEx(error)
    }
  }

}
