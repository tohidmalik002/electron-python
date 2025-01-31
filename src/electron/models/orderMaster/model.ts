import { Sequelize, Model, DataTypes } from 'sequelize';

export const modelConfig = {
    "attributes": {
        "order_id": {
            "type": DataTypes.INTEGER,
            "primaryKey": true,
            "autoIncrement": true,
        },
        "customer_id": {
            "type": DataTypes.INTEGER,
            "allowNull": true,
        },
        "voucher_part1": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
        },
        "voucher_part2": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
        },
        "voucher_part3": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
        },
        "voucher_part4": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
        },
        "order_date": {
            "type": DataTypes.DATE,
            "allowNull": true,
        },
        "currency": {
            "type": DataTypes.STRING(10),
            "allowNull": true,
        },
        "multi_div": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
        },
        "customer_name": {
            "type": DataTypes.STRING(255),
            "allowNull": true,
        },
        "conv_fact": {
            "type": DataTypes.STRING(100),
            "allowNull": true,
        },
        "conv_d": {
            "type": DataTypes.STRING(100),
            "allowNull": true,
        },
        "lmg_sales": {
            "type": DataTypes.DECIMAL(15, 2),
            "defaultValue": 0,
            "allowNull": false,
        },
        "lmp_sales": {
            "type": DataTypes.DECIMAL(15, 2),
            "defaultValue": 0,
            "allowNull": false,
        },
        "lms_sales": {
            "type": DataTypes.DECIMAL(15, 2),
            "defaultValue": 0,
            "allowNull": false,
        },
        "lml_sales": {
            "type": DataTypes.DECIMAL(15, 2),
            "defaultValue": 0,
            "allowNull": false,
        },
        "chi_x_kt": {
            "type": DataTypes.STRING(100),
            "allowNull": true,
        },
        "po_no": {
            "type": DataTypes.STRING(100),
            "allowNull": true,
        },
        "po_date": {
            "type": DataTypes.DATE,
            "allowNull": true,
        },
        "priority": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
        },
        "exp_del_date": {
            "type": DataTypes.DATE,
            "allowNull": true,
        },
        "prod_del_date": {
            "type": DataTypes.DATE,
            "allowNull": true,
        },
        "ord_lock": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
        },
        "pwd": {
            "type": DataTypes.STRING(50),
            "allowNull": true,
        },
        "lk_sales_price": {
            "type": DataTypes.DECIMAL(15, 2),
            "defaultValue": 0,
            "allowNull": false,
        },
        "refresh_date": {
            "type": DataTypes.DATE,
            "allowNull": true,
        },
    },
    "options": {
        "modelName": 'orderMaster',
        "tableName": 'order_master',
        "timestamps": false,
    },
    "relationships": {
        "hasMany": [
            {
                "modelName": 'orderDesign',
                "options":{
                    "foreignKey": 'parent_id',
                    "scope": {
                        "parent_type": 'orderMaster',
                        "parent_field": 'order_design'
                    },
                    "as": "order_design"
                }
            }
        ]
    }
}
