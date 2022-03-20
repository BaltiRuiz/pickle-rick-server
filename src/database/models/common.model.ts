import { ITable } from "../database.interfaces";

/**
 * Used to gather together all the bits required for tables
 * 
 * @class Table
 * @implements {ITable}
 */
export class Table implements ITable {
    public className: string;
    public classDefinition: any;
    public columnDefinitions: object;
    public tableName: string;

    /**
     * Creates an instance of Table
     * 
     * @param {ITable} params
     * 
     * @memberof Table
     */
    constructor(params: ITable) {
        this.className = params.className;
        this.classDefinition = params.classDefinition;
        this.columnDefinitions = params.columnDefinitions;
        this.tableName = params.tableName;
    }
}