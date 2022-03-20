import { Model, BuildOptions } from "sequelize";

/**
 * Definition of a table
 * 
 * @interface ITable
 */
export interface ITable {
    className: string;
    classDefinition: any;
    columnDefinitions: object;
    tableName: string;
}

/**
 * Definition of a 'user' table
 * 
 * @interface IUser
 */
export interface IUser {
    id: number;
    name: string;
    password: string;
}

/**
 * Definition of a 'favourite' table
 * 
 * @interface IFavourite
 */
export interface IFavourite {
    id: number;
    resource_type: string;
    resource_id: number;
    user_id: number;
}

export type SequelizeModel = typeof Model & (new (values?: object, options?: BuildOptions) => any);
