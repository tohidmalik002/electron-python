import { Sequelize } from 'sequelize';
import { loadModel } from './utils.js';

const sequelize = new Sequelize({
    database: 'mydb',
    dialect: 'postgres',
    host: '3.20.115.50',
    username: 'chintan',
    password: 'Chintan@8848',
    port: 5432,
    pool: {
        max: 20,       
        min: 5,       
        acquire: 30000, 
        idle: 10000    
    },
    logging: false 
});

export default sequelize;

export async function init_models() {
    const models = ["orderMaster", "orderDesign", "orderRateChart"];
    console.log("Initializing models...");
    
    for (const model of models) {
        await loadModel(model);
    }
    
    console.log("Models initialized");
}
