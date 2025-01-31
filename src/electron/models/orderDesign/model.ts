import { Sequelize, Model, DataTypes } from 'sequelize';

export const modelConfig = {
    "attributes": {
        "order_design_id": {
            "type": DataTypes.INTEGER,
            "primaryKey": true,
            "autoIncrement": true,
            "allowNull": false,
          },
          "design_code": {
            "type": DataTypes.STRING(100),
            "allowNull": true,
          },
          "suffix": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
          },
          "size": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
          },
          "qty": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 0,
          },
          "calc_price": {
            "type": DataTypes.DECIMAL(15, 2),
            "allowNull": true,
            "defaultValue": 0,
          },
          "sales_price": {
            "type": DataTypes.DECIMAL(15, 2),
            "allowNull": true,
            "defaultValue": 0,
          },
          "prod_dely_date": {
            "type": DataTypes.DATE,
            "allowNull": true,
          },
          "exp_dely_date": {
            "type": DataTypes.DATE,
            "allowNull": true,
          },
          "prod_setting": {
            "type": DataTypes.TEXT,
            "allowNull": true,
          },
          "fixed_price": {
            "type": DataTypes.BOOLEAN,
            "allowNull": true,
            "defaultValue": false,
          },
          "sr_no": {
            "type": DataTypes.INTEGER,
            "allowNull": true,
          },
          "parent_type": {
            "type": DataTypes.STRING(255),
            "allowNull": true,
          },
          "parent_field": {
            "type": DataTypes.STRING(255),
            "allowNull": true,
          },
          "parent_id": {
            "type": DataTypes.STRING(255),
            "allowNull": true,
          },
    },
    "options": {
        "modelName": 'orderDesign',
        "tableName": 'order_design',
        "timestamps": false,
    },
    "relationships": {
        "belongsTo": [
            {
                "modelName": 'orderMaster',
                "options":{
                  "foreignKey": 'parent_id',
                  "constraints": false,
                }
            }
        ],
        "hasMany": [
            {
                "modelName": 'orderRateChart',
                "options":{
                    "foreignKey": 'parent_id',
                    "scope": {
                        "parent_type": 'orderDesign',
                        "parent_field": 'rate_chart'
                    },
                    "as": "rate_chart"
                }
            }
        ]
    }
}
