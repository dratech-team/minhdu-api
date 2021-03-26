import { Injectable } from "@nestjs/common";
import { Model, ObjectId } from "mongoose";
import { IRole } from "@/interfaces/role.interface";
import { USER_TYPE } from "../constants/role-type.constant";
import { InjectModel } from "@nestjs/mongoose";
import { ModelName } from "../constants/database.constant";

import * as mongoose from "mongoose";

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
    let role: any;
    if (!roleId) {
      return null;
    }
    try {
      role = this.roleModel.findOne({
        _id:
          typeof roleId === "string"
            ? new mongoose.Schema.Types.ObjectId(roleId)
            : roleId,
      });
    } catch (err) {
      throw "as";
    }
    return role;
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
