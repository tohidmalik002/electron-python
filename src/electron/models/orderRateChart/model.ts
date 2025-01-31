import { Sequelize, Model, DataTypes } from 'sequelize';

export const modelConfig = {
    "attributes": {
        "id": {
          "type": DataTypes.INTEGER,
          "autoIncrement": true,
          "primaryKey": true,
        },
        "depth": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "quantity": { 
            "type": DataTypes.INTEGER, 
            "allowNull": true 
        },
        "pm_pointer": { 
            "type": DataTypes.STRING(100), 
            "allowNull": true 
        },
        "wt": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "lme_rate": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "sales_rate": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "qw": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "sales_value": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "production_quantity": { 
            "type": DataTypes.INTEGER, 
            "allowNull": true 
        },
        "production_weight": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "setting": { 
            "type": DataTypes.STRING(100), 
            "allowNull": true 
        },
        "setting_rate": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "setting_value": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "alloy": { 
            "type": DataTypes.STRING(100), 
            "allowNull": true 
        },
        "alloy_rate": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "wset": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "h_set": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "sshp": { 
            "type": DataTypes.DOUBLE, 
            "allowNull": true 
        },
        "m_material": { 
            "type": DataTypes.STRING(100), 
            "allowNull": true 
        },
        "parent_type": { 
            "type": DataTypes.STRING(255), 
            "allowNull": true 
        },
        "parent_field": { 
            "type": DataTypes.STRING(255), 
            "allowNull": true 
        },
        "parent_id": { 
            "type": DataTypes.STRING(255), 
            "allowNull": true 
        },
        "OrderDesignOrderDesignId": { 
            "type": DataTypes.INTEGER, 
            "allowNull": true 
        },
      },
    "options": {
        "modelName": 'orderRateChart',
        "tableName": 'order_rate_chart',
        "timestamps": false,
    },
    "relationships": {
        "belongsTo": [
            {
                "modelName": 'orderDesign',
                "options":{
                  "foreignKey": 'parent_id',
                  "constraints": false,
                }
            }
        ]
    }
}
