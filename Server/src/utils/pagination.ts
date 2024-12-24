import { Prisma } from "@prisma/client";
import fs from 'fs'
import {dirname} from 'path'
import path from "path";
import { fileURLToPath } from "url";


export const createPaginationQuery = async ({
    filter = undefined,
    sortField = undefined,
    sortOrder = undefined,
    page = undefined,
    perPage = undefined,
    include = undefined
}) => {
    const query = {
        where: {},
        orderBy: [],
        skip: (page - 1) * perPage || 0,
        take: parseInt(perPage) || 10,
        include: include
    }
    

    if (filter) {
        Object.keys(filter).forEach(key => {
            const modelWithField = Prisma.dmmf.datamodel.models.find(model => model.fields.some(field => field.name === key) );
            
            if (modelWithField) {
                const field = modelWithField.fields.find(f => f.name === key)
                
                const isNestedKey = include ? Object.keys(include).includes(modelWithField.name) : undefined;
                const whereTarget = isNestedKey ? (query.where[modelWithField.name] = query.where[modelWithField.name] || {}) : query.where;
                

                if (field.type === "String") {
                    whereTarget[key] = { contains: filter[key], mode: 'insensitive' };
                } 
                
                else if (field.kind === 'enum') {
                    whereTarget[key] = filter[key];
                } 
                
                else if (field.type === 'Int' || field.type == 'Float') {
                    const numericFilter = filter[key]
                    
                    
                    Object.keys(numericFilter).forEach(compOperator => {
                        whereTarget[key] = {...whereTarget[key], [compOperator]: Number(numericFilter[compOperator])}
                                
                    })
                    
                } 
                
                else if (field.type === 'DateTime') {
                    const dateTimeFilter = filter[key]
                    Object.keys(dateTimeFilter).forEach(compOperator => {
                        const dateValue = dateTimeFilter[compOperator]
                        const date = new Date(dateValue)
                        whereTarget[key] = {...whereTarget[key], [compOperator]: date};
                                
                    })
                }

                else if (field.type === 'Boolean') {
                    whereTarget[key] = filter[key] === 'true' ? true : false // since the value can only be 'true' or 'false'
                }
            }
            
        })
    }



    
    if (sortField && sortOrder) {
        const sortFields = sortField.split(',').map(field => field.trim());
        const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc'
        

        sortFields.forEach(field => {
            const modelWithField = Prisma.dmmf.datamodel.models.find(model => model.fields.some(f => f.name === field));
            if (modelWithField) {
                const fieldDef = modelWithField.fields.find(f => f.name === field)
                // const isNestedKey = include ? Object.keys(include).includes(modelWithField.name) : undefined;
                if (include && Object.keys(include).includes(modelWithField.name)) {
                    query.orderBy.push({[modelWithField.name]: {[field]: orderDirection}})
                } else {
                    query.orderBy.push({[field]: orderDirection})
                }
                
            }
        });  
        
    }
    

    return query
}