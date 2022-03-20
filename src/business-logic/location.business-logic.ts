import { Resources } from "../enums/resources.enums";
import { ResourceBusinessLogic } from "./resource.business-logic";
import { ResourceDatabaseLogic } from "../database/logic/resource.database-logic";

/**
 * Manages locations information
 * 
 * @class LocationBusinessLogic
 */
export class LocationBusinessLogic extends ResourceBusinessLogic {
    /**
     * Creates an instance of LocationBusinessLogic
     * 
     * @param {ResourceDatabaseLogic} ResourceDatabaseLogic
     * 
     * @memberof LocationBusinessLogic
     */
    constructor(ResourceDatabaseLogic: ResourceDatabaseLogic) {
        super(Resources.Location, ResourceDatabaseLogic);
    }
}
