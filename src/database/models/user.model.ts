import sequelize, { Model, DataTypes } from "sequelize";

import { DatabaseModelNames } from "../database.enums";
import { IUser } from "../database.interfaces";
import { Table } from "./common.model";

/**
 * Database model of a 'Rick and Morty' application user
 * 
 * @class User
 * @extends {Model}
 * @implements {IUser}
 */
export class User extends Model implements IUser {
    public id: number;
    public name: string;
    public password: string;
}

export const UserInit = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('user_id_seq'::regclass)"),
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}

export const UserTable = new Table(
    {
        classDefinition: User,
        className: DatabaseModelNames.User,
        columnDefinitions: UserInit,
        tableName: "user",
    },
);

export default UserTable;