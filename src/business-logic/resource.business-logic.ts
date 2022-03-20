import axios from "axios";
import { isNaN, isNil } from "lodash";

import { Resources } from "../enums/resources.enums";
import { IFavourite } from "../database/database.interfaces";
import { ResourceDatabaseLogic } from "../database/logic/resource.database-logic";

const _ = {
    isNaN,
    isNil,
};

/**
 * Parent class of the resources managers
 * 
 * @class ResourceBusinessLogic
 */
export class ResourceBusinessLogic {
    private resourceType: Resources;
    private resourceDatabaseLogic: ResourceDatabaseLogic;

    /**
     * Adds the property 'favourite' to the corresponding resources of the given array
     *
     * @param {*[]} resources
     * @param {number} userID
     * 
     * @memberof ResourceBusinessLogic
     */
    public async appendIsFavouriteField(resources: any[], userID: number) {
        const favouriteResourcesIDs = await this.resourceDatabaseLogic.getFavouriteResourcesIDsFromUser(
            userID,
            this.resourceType,
        );

        resources.forEach((resource) => {
            resource.favourite = favouriteResourcesIDs.includes(resource.id);
        });
    }

    /**
     * Retrieves all records from the corresponding resource
     * 
     * @param {number} userID Current application user
     * 
     * @memberof ResourceBusinessLogic
     */
    public async getAllResources(userID: number) {
        console.log(`Retrieving all resources from type [${this.resourceType}] for user: ${userID}`);

        const axiosResult = await axios.get(`https://rickandmortyapi.com/api/${this.resourceType}`);

        await this.appendIsFavouriteField(axiosResult.data.results, userID);

        return {
            statusCode: 200,
            result: {
                data: axiosResult.data.results,
                message: "All resources retrieved successfully",
            },
        };
    }

    /**
     * Retrieves a specific resource given its corresponding ID
     *
     * @param {number} userID Current application user
     * @param {string} resourceID Unique ID of the resource
     * 
     * @memberof ResourceBusinessLogic
     */
    public async getResource(userID: number, resourceID: string) {
        console.log(`Retrieving resource ${resourceID} from type [${this.resourceType}] for user: ${userID}`);

        if (!_.isNaN(+resourceID)) {
            const axiosResult = await axios.get(`https://rickandmortyapi.com/api/${this.resourceType}/${resourceID}`);

            if (axiosResult.data) {
                const favouriteObject = await this.resourceDatabaseLogic.getFavouriteResourceObject(
                    this.resourceType,
                    +resourceID,
                    userID,
                );
    
                axiosResult.data.favourite = !_.isNil(favouriteObject);
            }

            return {
                statusCode: 200,
                result: {
                    data: [axiosResult.data],
                    message: `Resource ${resourceID} retrieved successfully`,
                },
            };
        } else {
            return {
                statusCode: 400,
                result: {
                    data: null,
                    message: "ID must be a number",
                },
            };
        }
    }

    /**
     * Retrieves multiple resources given their corresponding IDs
     * 
     * @param {number} userID Current application user
     * @param {string[]} resourcesIDs Unique IDs of the resources
     * 
     * @memberof ResourceBusinessLogic
     */
    public async getMultipleResources(userID: number, resourcesIDs: string[]) {
        console.log(`Retrieving ${resourcesIDs.length} resources from type [${this.resourceType}] for user: ${userID}`);

        const hasInvalidIDs = resourcesIDs.some(id => _.isNaN(+id));

        if (hasInvalidIDs) {
            return {
                statusCode: 400,
                result: {
                    data: null,
                    message: "At least one ID is not a number",
                },
            };
        } else {
            const axiosResult = await axios.get(`https://rickandmortyapi.com/api/${this.resourceType}/${resourcesIDs}`);

            await this.appendIsFavouriteField(axiosResult.data, userID);

            return {
                statusCode: 200,
                result: {
                    data: axiosResult.data,
                    message: `${resourcesIDs.length} resources retrieved successfully`,
                },
            };
        }
    }

    /**
     * Retrieves one or more resources according to a few filtering parameters
     * 
     * @param {number} userID Current application user
     * @param {*} params Attributes used for filtering
     * 
     * @memberof ResourceBusinessLogic
     */
    public async filterResources(userID: number, params: any) {
        console.log(`Filtering resources from type [${this.resourceType}] with params ${JSON.stringify(params)} for user: ${userID}`);

        const axiosResult = await axios.get(
            `https://rickandmortyapi.com/api/${this.resourceType}`,
            { params },
        );

        await this.appendIsFavouriteField(axiosResult.data.results, userID);

        return {
            statusCode: 200,
            result: {
                data: axiosResult.data.results,
                message: "Resources filtered successfully",
            },
        };
    }

    /**
     * Adds a new resource to the 'favourite' table if it does not exist and removes it otherwise
     *
     * @param {number} resourceID
     * @param {number} userID
     *
     * @memberof ResourceBusinessLogic
     */
    public async markOrRemoveFavouriteResource(resourceID: number, userID: number) {
        const favouriteResource: IFavourite = await this.resourceDatabaseLogic.getFavouriteResourceObject(
            this.resourceType,
            resourceID,
            userID,
        );

        if (favouriteResource) {
            return await this.resourceDatabaseLogic.removeResourceAsFavourite(favouriteResource.id);
        } else {
            return await this.resourceDatabaseLogic.markResourceAsFavourite(
                this.resourceType,
                resourceID,
                userID,
            );
        }
    }

    /**
     * Creates an instance of ResourceBusinessLogic
     *
     * @param {Resources} resourceType
     * @param {ResourceDatabaseLogic} resourceDatabaseLogic
     * 
     * @memberof ResourceBusinessLogic
     */
    public constructor(resourceType: Resources, resourceDatabaseLogic: ResourceDatabaseLogic) {
        this.resourceType = resourceType;
        this.resourceDatabaseLogic = resourceDatabaseLogic;
    }
}
