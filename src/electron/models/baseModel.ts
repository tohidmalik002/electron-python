import { Sequelize, Model, DataTypes } from 'sequelize';

class BaseModel extends Model {

    static async getFullObj(pk: any = null, data: any = {}) {
      let include: any[] = [];
      let obj = null;
      if (pk) {
        obj = await this.findByPk(pk, { include: include });
        if (obj && data) {
          obj.set(data);
        }
      } else {
        obj = this.build(data, { include: include });
      }

      return obj;
    };
    static async saveObj() {
      console.log(this,"saveObj")
    };
    
    static beforeCreateHook?(instance: BaseModel, options:any): void;
    static beforeUpdateHook?(instance: BaseModel): void;
  }
  
export default BaseModel;
