import { Lifetime } from "awilix";
import { Sequelize } from "sequelize";

import { DependencyType, DIKeys } from "./ioc.enums";
import { IDependency } from "./ioc.interfaces";

import { AuthenticationBusinessLogic } from "../business-logic/authentication.business-logic";
import { CharacterBusinessLogic } from "../business-logic/character.business-logic";
import { EpisodeBusinessLogic } from "../business-logic/episode.business-logic";
import { LocationBusinessLogic } from "../business-logic/location.business-logic";

import { AuthenticationDatabaseLogic } from "../database/logic/authentication.database-logic";
import { ResourceDatabaseLogic } from "../database/logic/resource.database-logic";

import { DatabaseService } from "../database/database.service";

import { allModels } from "../database/models/all.models";

/**
 * IoC definition
 */
export const IoCConfiguration: IDependency[] = [
    {
        name: DIKeys.AuthenticationBusinessLogic,
        instance: AuthenticationBusinessLogic,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.CharacterBusinessLogic,
        instance: CharacterBusinessLogic,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.EpisodeBusinessLogic,
        instance: EpisodeBusinessLogic,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.LocationBusinessLogic,
        instance: LocationBusinessLogic,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.AuthenticationDatabaseLogic,
        instance: AuthenticationDatabaseLogic,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.ResourceDatabaseLogic,
        instance: ResourceDatabaseLogic,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.DatabaseService,
        instance: DatabaseService,
        lifetime: Lifetime.SINGLETON,
        type: DependencyType.ClassOrService,
    },
    {
        name: DIKeys.sequelizeInstance,
        instance: Sequelize,
        lifetime: Lifetime.TRANSIENT,
        type: DependencyType.Resource,
    },
    {
        name: DIKeys.tableInstances,
        instance: allModels,
        lifetime: Lifetime.TRANSIENT,
        type: DependencyType.Resource,
    },
];
