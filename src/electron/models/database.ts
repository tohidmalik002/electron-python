import { Sequelize } from 'sequelize';
import { loadModel } from './utils.js';
const sequelize = new Sequelize({
    database: 'mydb',
    dialect: 'postgres',
    host: '3.20.115.50',
    username: 'chintan',
    password: 'Chintan@8848',
    port: 5432,
});

export default sequelize;






export async function init_models() {
    const models = ["orderMaster", "orderDesign", "orderRateChart"]
    console.log("initializing models")
    for (const model of models) {
        await loadModel(model);
    }
    console.log("models initialized")
}