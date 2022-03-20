import { DatabaseService } from "../database.service";

/**
 * Father class for all database logic handlers
 * 
 * @class BaseDatabaseLogic
 */
export class BaseDatabaseLogic {
    private databaseService: DatabaseService;

    /**
     * Getter for the database service
     * 
     * @memberof BaseDatabaseLogic
     */
    public get DatabaseService(): DatabaseService {
        return this.databaseService;
    }

    /**
     * Creates an instance of BaseDatabaseLogic
     *
     * @param {DatabaseService} DatabaseService
     * 
     * @memberof BaseDatabaseLogic
     */
    constructor(DatabaseService: DatabaseService) {
        this.databaseService = DatabaseService;
    }
}