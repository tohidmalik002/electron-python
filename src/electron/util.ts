import { getFormConfigPath ,getListViewPath} from "./pathResolver.js";
import { triggerFunction } from "./triggerHandler.js";


export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}
export async function getAutoCompleteData(client: any, query: any) {
  const formName = query.formName;
  const config = await getFormConfig(formName);
  return getData(client, config.autoCompleteFields[query.fieldname], query);
}


export async function getFormConfig(formName: string) {
    const configFilePath = getFormConfigPath(formName);
    const configModule = await import(configFilePath, { with: { type: "json" } });
    return configModule.default
}

async function getData(
  client: any,
  queryConfig: any,
  query: any
): Promise<any[]> {

  let queryConditions = "";
  const params: any[] = [];

  if (query && query.value) {
    const searchValue = query.value.trim().replace(/['"]/g, '');
    const searchPattern = `%${searchValue}%`;
    queryConditions = queryConfig.searchFields.map((field: any, index: number) => {
      params.push(searchPattern);
      return `${field}::TEXT ILIKE $${index + 1}`;
    }).join(" OR ");
  }
    const sqlQuery = `
      SELECT 
          ${queryConfig.columns.join(", ")}
      FROM ${queryConfig.table}
      WHERE 1=1 ${queryConditions ? "AND (" + queryConditions + ")" : ""}
      LIMIT 20;
    `;


  const result: any = await client.query(sqlQuery, params);
  return result.rows;
}

export async function getOrderDesignDetails(client: any, designCode: string) {
  let labourChart = await client.query("SELECT * FROM labour_chart WHERE design_code = $1", [designCode]);
  let rateChart = await client.query("SELECT * FROM rate_chart WHERE design_code = $1", [designCode]);
  return { rateChart: rateChart.rows, labourChart: labourChart.rows };
}
export async function saveForm(client: any, formDataArray: any) {
  let configs = {};
  let savedData = [];

  for (let formData of formDataArray) {
    // const form = getForm(formData)
    // form.save(configs)
    const path = `forms.${formData.formName}.main.saveForm`;
    const result = await triggerFunction(client,{path, inputs:{configs,formData}});
    if(result){
      savedData.push(result);
    }
  }
  let x  = {
    status: "success",
    message: "Data saved successfully",
    data: savedData
  };
  return x
}
// export async function getForm(formData: any){
//   if()
// }


export async function saveFormData(
  client: any,
  formData: any,
  configs: any,
  parent_type: any | null = null,
  parent_field: any | null = null,
  parent_id: any = null
) {
  formData._operationType = await set_operation_type(client, formData, null, null, null)
  let savedFormData: { [key: string]: any } = {};
  if (formData._operationType == "delete") {
    await deleteData(client, formData, configs);
  } else {
    const formName = formData.formName;
    const { tableName,  primaryKey } = await getFormConfigDetails(formName, configs);
    const { entries, arrayEntries } = processFormData(formData);
    let primaryKeyValue = entries[primaryKey];
    formData._operationType = await set_operation_type(client, formData,tableName,primaryKey, primaryKeyValue)
    if(formData._operationType == "insert"){
      if (parent_type && parent_field && parent_id) {
        entries["parent_type"] = parent_type;
        entries["parent_field"] = parent_field;
        entries["parent_id"] = parent_id;
      }
      savedFormData = await insertData(client, tableName, primaryKey, entries);
      primaryKeyValue = savedFormData[primaryKey]
      savedFormData._operation = 'insert';
    }
    else if (formData._operationType == "update" ){
      savedFormData = await updateData(client, tableName, primaryKey, entries);
      savedFormData._operation = 'update';
      primaryKeyValue = savedFormData[primaryKey]
    }
    if(!savedFormData){
      savedFormData = formData.copy()
    }

    // Process nested arrays
    for (let [arrayKey, arrayValue] of Object.entries(arrayEntries)) {
      savedFormData[arrayKey] = [];
      for (let element of arrayValue) {
        if (formData._operationType == "insert"){
          element._is_new = 1
        }
        const childResult = await saveFormData(
          client,
          element,
          configs,
          formName,
          arrayKey,
          primaryKeyValue
        );
        if(childResult){
          savedFormData[arrayKey].push(childResult);
        }
      }
    }
  }

  return savedFormData;
}

export async function set_operation_type(client:any, formData: any ,tableName: any | null, primaryKey: any | null, primaryKeyValue: any | null): Promise<"delete" | "insert" | "update" | null>{
  if(formData._is_deleted == 1){
    return "delete"
  }
  else if(formData._is_new || !primaryKeyValue){
    return "insert"
  }
  else if(formData._is_update && primaryKeyValue){
    return "update"

  }
  return null
}


const non_included_fields_from_form = [
  "parent_type", 
  "parent_field", 
  "parent_id", 
  "formName"
];

function processFormData(formData: any): { entries: { [key: string]: any }, arrayEntries: { [key: string]: any } } {
  let entries: { [key: string]: any } = {};
  let arrayEntries: { [key: string]: any } = {};
  for (let [key, value] of Object.entries(formData)) {
    if (!key.startsWith('_') && !non_included_fields_from_form.includes(key)) {
      if (Array.isArray(value)) {
        arrayEntries[key] = value; 
      } else {
        entries[key] = value;
      }
    }
  }
  return { entries, arrayEntries };
}

async function insertData(client: any, tableName: string, primaryKey: string, entries: any) {
  const columns = Object.keys(entries);
  const values = Object.values(entries);
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
  let query = `
    INSERT INTO ${tableName} (${columns.join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;
  console.log(query,values)
  const r = await client.query(query, values);
  console.log(r.rows)
  return r.rows[0];
}

async function updateData(client: any, tableName: string, primaryKey: string, entries: any) {
  const primaryKeyValue = entries[primaryKey];
  delete entries[primaryKey];  // Remove the primary key from entries

  const setClauses = Object.keys(entries)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(entries);
  values.push(primaryKeyValue);
  const query = `
    UPDATE ${tableName}
    SET ${setClauses}
    WHERE ${primaryKey} = $${values.length};
  `;
  await client.query(query, values);
  const selectQuery = `
    SELECT * FROM ${tableName}
    WHERE ${primaryKey} = $1;
  `;
  const result = await client.query(selectQuery, [primaryKeyValue]);
  return result.rows[0];
}

async function deleteData( client:any, 
  formData:any, 
  configs:any, 
){
  const { entries, arrayEntries } = processFormData(formData);
  const { tableName,  primaryKey } = await getFormConfigDetails(formData.formName, configs);
  const primaryKeyValue = entries[primaryKey];
  if  (primaryKeyValue && await checkIfRecordExists(client, tableName, primaryKey, primaryKeyValue)){
    for (let [arrayKey, arrayValue] of Object.entries(arrayEntries)) {
      for (let element of arrayValue) {
        await deleteData(client, element, configs);
      }
    }
  
    const query = `
      DELETE FROM ${tableName}
      WHERE ${primaryKey} = $1;
      `;
    await client.query(query, [primaryKeyValue]);

  }
}

export async function getFormConfigDetails(formName: string, configs: any) {
  let config = configs[formName] || await getFormConfig(formName);
  if (!configs[formName]) {
      configs[formName] = config;
  }
  const tableName = config.tableName;
  const primaryKey = config.primary_key || "id";
  return { tableName, primaryKey };
}

async function checkIfRecordExists(client: any, tableName: string, primaryKey: string, primaryKeyValue: any): Promise<boolean> {
  // Query to check if the record exists
  const query = `
    SELECT COUNT(*) AS count 
    FROM ${tableName} 
    WHERE ${primaryKey} = $1;
  `;
  const result = await client.query(query, [primaryKeyValue]);

  return result.rows[0].count > 0 ? true : false;
}

export async function getListView(client: any, kwargs: any) {
  let formName = kwargs.formName;
  let filters = kwargs.filters || {};
  
  // Example filter object
  // filters = { "order_id": 1, "customer_id": 2 };

  const configpath = await getListViewPath(formName);
  const configModule = await import(configpath, { with: { type: "json" } });
  let listViewConfig = configModule.default;

  let query = `SELECT ${listViewConfig.columns} FROM ${listViewConfig.table}`;

  // If filters exist, format them for SQL query using LIKE
  if (Object.keys(filters).length > 0) {
    const filterConditions = Object.entries(filters)
      .map(([key, value]) => `${key}::text LIKE '%${value}%'`) // Using LIKE operator for partial match
      .join(' AND ');

    query += ` WHERE ${filterConditions}`;
  }
  const result = await client.query(query);
  return result.rows;
}
