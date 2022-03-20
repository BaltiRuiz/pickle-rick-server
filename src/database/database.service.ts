import { Sequelize, ModelAttributes } from "sequelize";

import { Table } from "./models/common.model";
import { SequelizeModel } from "./database.interfaces";

/**
 * Manages the connection to the database
 * 
 * @class DatabaseService
 */
export class DatabaseService {
    private sequelizeConnection: Sequelize;
    private tableInstances: Array<Table> = [];
    private tables: Map<string, SequelizeModel> = new Map<string, SequelizeModel>([]);

    /**
     * Gets an individual table to be used
     *
     * @param {string} tableName
     * 
     * @memberof DatabaseService
     */
    public usingTable(tableName: string): SequelizeModel {
        return this.tables.get(tableName);
    }

    /**
     * Creates a connection to the sequelize instance
     * 
     * @memberof DatabaseService
     */
    createConnection() {
        this.sequelizeConnection = new Sequelize(
            process.env.DATABASE_NAME,
            process.env.DATABASE_USERNAME,
            process.env.DATABASE_PASSWORD,
            {
                dialect: "postgres",
                host: process.env.DATABASE_HOST,
                port: +process.env.DATABASE_PORT,
            },
        );

        this.sequelizeConnection.authenticate()
            .then(() => {
                console.log("Successfully connected to database instance");
            })
            .catch((error) => {
                throw new Error(`There was an error while connecting to database instance: ${error}`);
            });
    }

    /**
     * Initialises the tables in the sequelize instance
     * 
     * @memberof DatabaseService
     */
    initialiseTableInstances() {
        this.tableInstances.forEach((table: Table) => {
            console.log(`Initialising database table: ${table.tableName}`);

            const createdModel = (this.sequelizeConnection.define(
                table.className,
                table.columnDefinitions as ModelAttributes,
                {
                    tableName: table.tableName,
                    timestamps: false,
                },
            ) as unknown) as SequelizeModel;

            this.tables.set(table.className, createdModel);
        });
    }

    /**
     * Starts up the service
     * 
     * @memberof DatabaseService
     */
    init() {
        try {
            this.createConnection();
            this.initialiseTableInstances();
        } catch (error) {
            throw new Error(`There was an error while starting the database service: ${error}`);
        }
    }

    /**
     * Creates an instance of DatabaseService
     * 
     * @param {*} sequelizeInstance
     * @param {Array<Table>} tableInstances
     * 
     * @memberof DatabaseService
     */
    constructor(sequelizeInstance: any, tableInstances: Array<Table>) {
        this.sequelizeConnection = sequelizeInstance;
        this.tableInstances = tableInstances;

        this.init();
    }
}