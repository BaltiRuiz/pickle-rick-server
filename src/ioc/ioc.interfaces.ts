import { AwilixContainer, asClass, asValue, LifetimeType } from "awilix";

import { DependencyType, DIKeys } from "./ioc.enums";

/**
 * A dependency that we are going to inject into the IoC
 * 
 * @interface IDependency
 */
export interface IDependency {
    name: DIKeys;
    instance: unknown;
    lifetime: LifetimeType;
    type: DependencyType;
}

/**
 * Parameters needed to construct the Inversion of Control bootstrapper
 * 
 * @interface IIoCBootstrapperParameters
 */
export interface IIoCBootstrapperParameters {
    createContainerInstance: () => AwilixContainer;
    asClassInstance: typeof asClass;
    asValueInstance: typeof asValue;
    containerItems: IDependency[];
}