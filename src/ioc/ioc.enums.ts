export enum DependencyType {
    ClassOrService,
    Resource,
}

export enum DIKeys {
    AuthenticationBusinessLogic = "AuthenticationBusinessLogic",

    CharacterBusinessLogic = "character",
    EpisodeBusinessLogic = "episode",
    LocationBusinessLogic = "location",

    AuthenticationDatabaseLogic = "AuthenticationDatabaseLogic",
    ResourceDatabaseLogic = "ResourceDatabaseLogic",

    DatabaseService = "DatabaseService",

    sequelizeInstance = "sequelizeInstance",
    tableInstances = "tableInstances",
}
