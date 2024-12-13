import {Prisma} from "@prisma/client"

export const getColumns = Prisma.dmmf.datamodel.models.reduce((acc, model) => {
    // Add the model name as key, and the columns as the value (array)
    acc[model.name] = model.fields.map(field => field.name);
    return acc;
  }, {});
  

// check if a column is in a table
export const validateColumn = (value, tableName) => {
  const columns = getColumns[tableName]
  if (columns.includes(value)) {
    return true
  }
  return false
}

// to be used in the custom method of joi to check if the provided query parameter is a valid column
//validates both one string like "name" and multiple own like "name,email"
export const validateColumnwithJoi = (tableName) => {
  return (value, helpers) => {
    const columns = value.split(",");
    for (const column of columns) {
      if(!validateColumn(column.trim(), tableName)){
        return helpers.error(`${column} provided is not a valid column`, {value, tableName})
      }
    }
    return value
  }
}

