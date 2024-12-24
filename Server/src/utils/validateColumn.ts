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
export const validateColumnwithJoi = (tableNames) => {
  return (value, helpers) => {
    const tables = Array.isArray(tableNames) ? tableNames : [tableNames];
    const columns = value.split(",");
    const invalidColumns = []
    for (const column of columns) {
      const trimmedColumn = column.trim();
      const isValid = tables.some((tableName) => validateColumn(trimmedColumn, tableName));
      if (!isValid) {
        invalidColumns.push(trimmedColumn)
      }
    }

    if (invalidColumns.length > 0) {
      // Return an error listing all invalid columns
      return helpers.error(
        `The following columns are not valid in the given table ${tables}: ${invalidColumns.join(", ")}`, 
        { value, tables, invalidColumns }
      );
    }

    return value
  }
}


