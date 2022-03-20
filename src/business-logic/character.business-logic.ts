import { Resources } from "../enums/resources.enums";
import { ResourceBusinessLogic } from "./resource.business-logic";
import { ResourceDatabaseLogic } from "../database/logic/resource.database-logic";

/**
 * Manages characters information
 * 
 * @class CharacterBusinessLogic
 */
export class CharacterBusinessLogic extends ResourceBusinessLogic {
    /**
     * Creates an instance of CharacterBusinessLogic
     * 
     * @param {ResourceDatabaseLogic} ResourceDatabaseLogic
     * 
     * @memberof CharacterBusinessLogic
     */
    constructor(ResourceDatabaseLogic: ResourceDatabaseLogic) {
        super(Resources.Character, ResourceDatabaseLogic);
    }
}
