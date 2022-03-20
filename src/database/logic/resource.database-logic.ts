import { DatabaseModelNames } from "../database.enums";
import { DatabaseService } from "../database.service";
import { BaseDatabaseLogic } from "./base.database-logic";

/**
 * Handles database logic for 'Rick and Morty' API objects
 * 
 * @class ResourceDatabaseLogic
 * @extends BaseDatabaseLogic
 */
export class ResourceDatabaseLogic extends BaseDatabaseLogic {
    /**
     * Retrieves a specific favourite resource for a specific user
     *
     * @param {string} resourceType
     * @param {number} resourceID
     * @param {number} userID
     * 
     * @memberof ResourceDatabaseLogic
     */
    public async getFavouriteResourceObject(resourceType: string, resourceID: number, userID: number) {
        return await this.DatabaseService.usingTable(DatabaseModelNames.Favourite).findOne(
            { where: { resource_type: resourceType, resource_id: resourceID, user_id: userID } },
        );
    }

    /**
     * Returns all the favourite resources IDs of the given user
     *
     * @param {number} userID
     * @param {string} resourceType
     * 
     * @memberof ResourceDatabaseLogic
     */
    public async getFavouriteResourcesIDsFromUser(userID: number, resourceType: string) {
        const favouriteResources = await this.DatabaseService.usingTable(DatabaseModelNames.Favourite).findAll(
            { where: { resource_type: resourceType, user_id: userID } },
        );

        return favouriteResources.map((favouriteResource) => favouriteResource.resource_id);
    }

    /**
     * Sets a specific resource as 'favourite' for a specific user
     *
     * @param {string} resourceType
     * @param {number} resourceID
     * @param {number} userID
     * 
     * @memberof ResourceDatabaseLogic
     */
    public async markResourceAsFavourite(resourceType: string, resourceID: number, userID: number) {
        try {
            await this.DatabaseService.usingTable(DatabaseModelNames.Favourite).create(
                { resource_type: resourceType, resource_id: resourceID, user_id: userID },
            );
        } catch (error) {
            throw new Error(`There was an error while marking resource as favourite: ${error}`);
        }
    }

    /**
     * Unsets a favourite resource given its ID
     *
     * @param {number} favouriteID
     * 
     * @memberof ResourceDatabaseLogic
     */
    public async removeResourceAsFavourite(favouriteID: number) {
        try {
            await this.DatabaseService.usingTable(DatabaseModelNames.Favourite).destroy(
                { where: { id: favouriteID } },
            );
        } catch (error) {
            throw new Error(`There was an error while removing favourite resource: ${error}`);
        }
    }

    /**
     * Creates an instance of ResourceDatabaseLogic
     *
     * @param {DatabaseService} DatabaseService
     * 
     * @memberof ResourceDatabaseLogic
     */
    constructor(DatabaseService: DatabaseService) {
        super(DatabaseService);
    }
}