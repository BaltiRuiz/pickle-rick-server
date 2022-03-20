import { Resources } from "../enums/resources.enums";
import { ResourceBusinessLogic } from "./resource.business-logic";
import { ResourceDatabaseLogic } from "../database/logic/resource.database-logic";

/**
 * Manages episodes information
 * 
 * @class EpisodeBusinessLogic
 */
export class EpisodeBusinessLogic extends ResourceBusinessLogic {
    /**
     * Creates an instance of EpisodeBusinessLogic
     * 
     * @param {ResourceDatabaseLogic} ResourceDatabaseLogic
     * 
     * @memberof EpisodeBusinessLogic
     */
    constructor(ResourceDatabaseLogic: ResourceDatabaseLogic) {
        super(Resources.Episode, ResourceDatabaseLogic);
    }
}
