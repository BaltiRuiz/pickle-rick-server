import sequelize, { Model, DataTypes } from "sequelize";

import { DatabaseModelNames } from "../database.enums";
import { IFavourite } from "../database.interfaces";
import { Table } from "./common.model";

/**
 * An object which represents a 'Rick and Morty' resource marked as favourite by an application user
 * 
 * @class Favourite
 * @extends {Model}
 * @implements {IFavourite}
 */
export class Favourite extends Model implements IFavourite {
    public id: number;
    public resource_type: string;
    public resource_id: number;
    public user_id: number;
}

export const FavouriteInit = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.Sequelize.literal("nextval('favourite_id_seq'::regclass)"),
    },
    resource_type: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}

export const FavouriteTable = new Table(
    {
        classDefinition: Favourite,
        className: DatabaseModelNames.Favourite,
        columnDefinitions: FavouriteInit,
        tableName: "favourite",
    },
);

export default FavouriteTable;