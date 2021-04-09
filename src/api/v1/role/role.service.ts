import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { ObjectId } from "mongodb";
import { ModelName } from "../../../common/constant/database.constant";
import { IRole } from "../../../core/interfaces/role.interface";
import { USER_TYPE } from "../../../core/constants/role-type.constant";
// import { IRole } from "@/core/interfaces/role.interface";
// import { ModelName } from "@/core/constants/database.constant";
// import { USER_TYPE } from "@/core/constants/role-type.constant";

@Injectable()
export class RoleService {
  public adminAndTestUserIds: ObjectId[] = [];
  public adminUserIds: ObjectId[] = [];

  constructor(
    @InjectModel(ModelName.ROLE)
    public readonly roleModel: Model<IRole>
  ) {
    this.updateAdminUserIds().then((val) => {
      // console.log('Update admin user ids')
    });
  }

  async addUserRole(
    userId: ObjectId,
    roleType: USER_TYPE = USER_TYPE.NONE
  ): Promise<IRole> {
    const role = await this.roleModel.findOne({
      userId,
      type: roleType,
    });
    if (!role) {
      return this.roleModel.create({
        userId,
        type: roleType,
      } as IRole);
    }
    return role;
  }

  async getRoleById(roleId: string | ObjectId): Promise<IRole> {
    if (!roleId) {
      return null;
    }
    if (!ObjectId.isValid(roleId)) {
      return null;
    }
    return this.roleModel.findOne({ _id: new ObjectId(roleId) });
  }

  async findUserRole(
    userId: ObjectId,
    roleType: USER_TYPE = USER_TYPE.NONE
  ): Promise<IRole> {
    return this.roleModel.findOne({ userId, type: roleType });
  }

  async getUserRole(userId: ObjectId): Promise<USER_TYPE> {
    const role = await this.roleModel.findOne({ userId });
    return role?.type || null;
  }

  async setUpRoles(
    usersIds: ObjectId[],
    roleType: USER_TYPE = USER_TYPE.NONE
  ): Promise<void> {
    const roles = usersIds.map((userId) => ({
      userId,
      type: roleType,
    })) as IRole[];
    await this.roleModel.insertMany(roles);
  }

  async setAdminRole(userId: ObjectId): Promise<IRole> {
    const role = await this.roleModel.findOne({
      userId,
      type: USER_TYPE.ADMIN,
    });
    if (!role) {
      return this.roleModel.create({ userId, type: USER_TYPE.ADMIN } as IRole);
    }
    return role;
  }

  async updateUserRole(
    userId: ObjectId,
    roleType: USER_TYPE = USER_TYPE.NONE
  ): Promise<void> {
    const role = await this.roleModel.findOne({ userId });
    if (!role) {
      await this.roleModel.create({
        type: roleType,
        userId,
      } as IRole);
      return;
    }
    await this.roleModel.updateOne(
      {
        _id: role._id,
      },
      {
        $set: {
          type: roleType,
        } as IRole,
      }
    );
  }

  // async updateTestAndAdminUserIds(): Promise<void> {
  //   this.adminAndTestUserIds = (await this.findTestAndAdminUserIds()) || [];
  // }

  async updateAdminUserIds(): Promise<void> {
    this.adminUserIds = (await this.findAdminUserIds()) || [];
  }

  getTestAndAdminUserIds(): ObjectId[] {
    return this.adminAndTestUserIds;
  }

  getAdminUserIds(): ObjectId[] {
    return this.adminUserIds;
  }

  //
  // async findTestAndAdminUserIds(): Promise<ObjectId[]> {
  //   const roles = (await this.roleModel.aggregate([
  //     {
  //       $match: {
  //         type: {
  //           $in: [USER_TYPE.ADMIN, USER_TYPE.TEST_USER],
  //         },
  //       },
  //     },
  //   ])) as IRole[];
  //   return roles.map((role) => role.userId);
  // }

  async findAdminUserIds(): Promise<ObjectId[]> {
    const roles = (await this.roleModel.aggregate([
      {
        $match: {
          type: USER_TYPE.ADMIN,
        },
      },
    ])) as IRole[];
    return roles.map((role) => role.userId);
  }
}
