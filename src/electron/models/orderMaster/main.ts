import sequelize from '../database.js';
import { modelConfig } from './model.js';
import BaseModel from '../baseModel.js';
import { loadModel } from '../utils.js';

class orderMaster extends BaseModel {
  static async getFullObj(pk: any = null, data: any = {}) {
    console.time("loadModel orderDesign");
    const orderDesign = await loadModel("orderDesign");
    console.timeEnd("loadModel orderDesign");
    console.time("loadModel orderRateChart");
    const orderRateChart = await loadModel("orderRateChart");
    console.timeEnd("loadModel orderRateChart");
    const include = [
      {
        model: orderDesign,
        as: 'order_design',
        duplicating: false,
        on: sequelize.literal('"orderMaster"."order_id"::TEXT = "order_design"."parent_id"'),
        include:[
          {
            model: orderRateChart,
            as: 'rate_chart',
            duplicating: false,
            on: sequelize.literal('"order_design"."order_design_id"::TEXT = "order_design->rate_chart"."parent_id"'),
          }
        ]
      
      }
    ]
    let obj  = null;
    if (pk) {
      console.time("findByPk orderMaster");
      obj = await this.findByPk(pk, { include: include});
      console.timeEnd("findByPk orderMaster");
      if (obj && data) {
        obj.set(data);
      }
    } else {
      console.time("build orderMaster");
      obj = this.build(data, { include: include });
      console.timeEnd("build orderMaster");
    }

    return obj;
  };

}

export default orderMaster;












// export async function syncDatabase() {
//     if (process.env.NODE_ENV === 'development') {
//       try {
//         await sequelize.sync({ alter: true });
//         console.log('Database & tables updated!');
//       } catch (error) {
//         console.error('Error syncing database:', error);
//       }
//     }
//   }
  
//       }
//     }
//   }
  
//       }
//     }
//   }
  
// if (process.env.NODE_ENV === 'development') {
//     syncDatabase();
//   }