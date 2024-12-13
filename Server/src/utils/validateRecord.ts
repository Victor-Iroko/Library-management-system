import { notFound, conflictError } from "errors";

// checks if a record exists using find unique
export const validateRecordExists = async (client, tableId) => {
  const resource = await client.findUnique({ where: { id: tableId } });
  if (resource) {
    return true // record exists
  }
  return false // the record does exist
}

// to be used in a joi validation schema to check if foreign keys provided exists when creating a record with foreign keys
export const validateRecordWithJoi = (client) => {
  return async (value, helpers) => {
    const isExists = await validateRecordExists(client, value)
    if (!isExists) {
      throw new notFound(`The record ${value} does not exist`);
    }
    return value
  }
}

// checks if a record exists using find first
export const validateDuplicateRecord = async (client, col, record) => {
  const resource = await client.findFirst({ where: { [col]: record } });
  if (resource) {
    return true // duplicate exist
  }
  return false // no duplicates
}


// used in a joi valiidation schema to check if a unique col already has the value when you're creating or updating
export const validateDuplicateRecordwithJoi = (client, col) => {
  return async (value, helpers) => {
    const isDuplicate = await validateDuplicateRecord(client, col, value)
    if (isDuplicate) {
      throw new conflictError(`This record already exists`);
    }
    return value
  }
}