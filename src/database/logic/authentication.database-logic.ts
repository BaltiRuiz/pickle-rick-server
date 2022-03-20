import { DatabaseModelNames } from "../database.enums";
import { DatabaseService } from "../database.service";
import { BaseDatabaseLogic } from "./base.database-logic";

/**
 * Handles database logic related with users and authentication
 * 
 * @class AuthenticationDatabaseLogic
 * @extends BaseDatabaseLogic
 */
export class AuthenticationDatabaseLogic extends BaseDatabaseLogic {
    /**
     * Adds a new user to the database
     *
     * @param {string} userName
     * @param {string} userPassword
     * 
     * @memberof AuthenticationDatabaseLogic
     */
    public async createUser(userName: string, userPassword: string) {
        try {
            const newUser = await this.DatabaseService.usingTable(DatabaseModelNames.User).create(
                { name: userName, password: userPassword },
            );

            return newUser.get({ plain: true });
        } catch (error) {
            throw new Error(`There was an error while registering user ${userName}: ${error}`);
        }
    }

    /**
     * Retrieves a user from database given its name
     *
     * @param {string} userName
     * 
     * @memberof AuthenticationDatabaseLogic
     */
    public async getUserByName(userName: string) {
        const user = await this.DatabaseService.usingTable(DatabaseModelNames.User).findOne(
            { where: { name: userName } },
        );

        if (user) {
            return user.get({ plain: true });
        } else {
            return null;
        }
    }

    /**
     * Creates an instance of DatabaseService
     *
     * @param {DatabaseService} DatabaseService
     * 
     * @memberof AuthenticationDatabaseLogic
     */
    constructor(DatabaseService: DatabaseService) {
        super(DatabaseService);
    }
}