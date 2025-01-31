import sequelize from './database.js';
import BaseModel from './baseModel.js';
import orderMaster from './orderMaster/main.js';

export async function loadModel(modelName: any) {
    if (sequelize.models[modelName]) {
        return sequelize.models[modelName];
    } else {
        const modelConfig = await import(`./${modelName}/model.js`);
        const modelClass = (await import(`./${modelName}/main.js`)).default;
        console.log(modelClass)
        if (!modelConfig) {
            throw new Error(`Model ${modelName} not found in configuration`);
        }
        const model = await createModel(modelClass, modelConfig.modelConfig.attributes, modelConfig.modelConfig.options, modelConfig.modelConfig.relationships);
        return model;
    }
}

export async function getModelObj(modelName: any = null, data: any = null) {
    const orderMaster = await loadModel("orderMaster");
    // orderMaster.getFullData(1);
    // orderMaster.addHook('beforeFind', (options: any) => {
    //     console.log(options, "beforeFind")
    // });
    const orderDesign = await loadModel("orderDesign");
    const orderRateChart = await loadModel("orderRateChart");



    const doc = await orderMaster.findByPk(777,{
        include: [
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
      });
    console.log(doc, "doc")

    //   doc.save()
    // // console.log(data instanceof orderMaster, "data")








    // let model = await loadModel(modelName);
    // if (data[model.primaryKeyAttribute]) {
    //     return await model.getFullData(data[model.primaryKeyAttribute]);
    // }
    // else{
    //     return model.build(data);
    // }
    
}




export async function createModel(modelClass:any, attributes: any, options: any = {}, relationships: any = {}) {

    modelClass.init(
        attributes, {
        sequelize,
        ...options,
    });
    await createAssociations(modelClass, relationships);

    return modelClass;
}

export async function createAssociations(modelClass:any, relationships: any) {
    if (relationships) {
        for (const [relationType, models] of Object.entries(relationships)) {
            for (const relation of models as any[]) {
                let RelatedModel;
                try {
                    RelatedModel = await loadModel(relation.modelName);
                } catch (error) {
                    console.error(`Error loading related model class for ${relation.modelName}:`, error);
                    console.warn(`Related model class for ${relation.modelName} not found`);
                    continue;
                }
                modelClass[relationType](RelatedModel, {...relation.options});
            }
        }
    }
}


export async function saveFormData(data: any) {
    data = {
        voucher_part1: null,
        voucher_part2: null,
        voucher_part3: null,
        order_date: null,
        currency: null,
        customer_id: null,
        customer_name: null,
        conv_fact: null,
        conv_d: null,
        lmg_sales: 0,
        lmp_sales: 0,
        lms_sales: 0,
        lml_sales: 0,
        chi_x_kt: null,
        po_no: null,
        po_date: null,
        priority: null,
        exp_del_date: null,
        prod_del_date: null,
        ord_lock: null,
        pwd: null,
        lk_sales_price: 0,
        refresh_date: null,
        _is_new: 1,
        order_design: [
          {
            parent_type: 'orderMaster',
            design_code: null,
            suffix: null,
            size: 0,
            qty: 0,
            calc_price: 0,
            sales_price: 0,
            prod_dely_date: null,
            exp_dely_date: null,
            prod_setting: null,
            fixed_price: 0,
            _is_new: 1,
            formName: 'orderDesign'
          }
        ]
      }
    let model = await loadModel('orderMaster');
    let orderDesign = await loadModel('orderDesign');
    console.log(model.associations, "sequlize")

    const instance = await model.create({
        ...data,
      }, {
        include: [{
          model: orderDesign, 
          as: 'order_design',
        }]
      });
    console.log("instance", instance);


   
    // const instance = await Model.create(formData, {
    //     include: [{model: OrderDesign,  as: 'OrderDesigns', required: true }]
    // });

    // // Recursively save child records
    // for (const association of Object.keys(Model.associations)) {
    //     if (formData[association] && Array.isArray(formData[association])) {
    //         for (const childData of formData[association]) {
    //             childData[Model.associations[association].foreignKey] = instance[Model.primaryKeyAttribute];
    //             await saveFormData(childData);
    //         }
    //     }
    // }

    // return instance;
}

export async function saveObj(data: any) {
    data = {
        voucher_part1: "test",
        voucher_part2: "test",
        voucher_part3: "test",
        order_date: new Date(),
        currency: "USD",
        customer_id: 1,
        customer_name: "John Doe",
        conv_fact: "1.0",
        conv_d: "1.0",
        lmg_sales: 100,
        lmp_sales: 200,
        lms_sales: 300,
        lml_sales: 400,
        chi_x_kt: "test",
        po_no: "12345",
        po_date: new Date(),
        priority: "High",
        exp_del_date: new Date(),
        prod_del_date: new Date(),
        ord_lock: "Lock",
        pwd: "password",
        lk_sales_price: 500,
        refresh_date: new Date(),
        _is_new: 1,
        orderDesigns: [
            {
                parent_type: 'orderMaster',
                design_code: "D001",
                suffix: "A",
                size: "M",
                qty: 10,
                calc_price: 100,
                sales_price: 150,
                prod_dely_date: new Date(),
                exp_dely_date: new Date(),
                prod_setting: "Setting1",
                fixed_price: false,
                _is_new: 1,
                formName: 'orderDesign'
            }
        ]
    }
    const orderMasterConfig = await import('./orderMaster/model.js');
        const orderDesignConfig = await import('./orderDesign/model.js');
        console.log(orderMasterConfig.modelConfig.options)

        // Initialize orderMaster first
        const orderMaster = BaseModel.init(
            orderMasterConfig.modelConfig.attributes,
            {
                sequelize,
                modelName: 'orderMaster',
                tableName: 'order_master1',
                timestamps: false,
            }
        );
        console.log("orderMaster", orderMaster);


        const orderDesign = BaseModel.init(
            orderDesignConfig.modelConfig.attributes,
            {
                sequelize,
                modelName: 'orderDesign',
                tableName: 'order_design1',
                timestamps: false,
            }
        );
        console.log("orderMaster", orderMaster);
        console.log("orderDesign", orderDesign);


        // Set up associations
        // orderMaster.hasMany(orderDesign, {
        //     foreignKey: 'parent_id',
        //     constraints: false,
        //     scope: {
        //         parent_type: 'orderMaster',
        //     },
        //     as: 'orderDesigns'  // This explicit alias is crucial
        // });

        // orderDesign.belongsTo(orderMaster, { 
        //     foreignKey: 'parent_id', 
        //     constraints: false 
        // });

        // Prepare the data - ensure parent_id is cast to string
        // const preparedData = {
        //     ...data,
        // };

        // const result = await orderMaster.create(preparedData, {
        // });
        // console.log("saveObj", result);

        // return result;

}