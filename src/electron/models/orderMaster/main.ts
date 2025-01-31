import sequelize from '../database.js';
import { modelConfig } from './model.js';
import BaseModel from '../baseModel.js';
import { createModel } from '../utils.js';

class orderMaster extends BaseModel {
  static beforeCreateHook(instance: orderMaster): void {   
    console.log('beforeCreateHook'); 
  }
}
// orderMaster.addHook('beforeFind', (options) => {
//   console.log(options, "beforeFind")
// });

// createModel(orderMaster, modelConfig.attributes, modelConfig.options, modelConfig.relationships);
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
  
// if (process.env.NODE_ENV === 'development') {
//     syncDatabase();
//   }