import { Sequelize, Model, DataTypes } from 'sequelize';

class BaseModel extends Model {

    static async getFullObj(pk: any) {
      console.log('getFullData', this.associations);
      const obj = await this.findByPk(pk, { include: { all: true, nested: true } });
      return obj;
    }
    static beforeCreateHook?(instance: BaseModel, options:any): void;
    static beforeUpdateHook?(instance: BaseModel): void;
  }
  
export default BaseModel;
