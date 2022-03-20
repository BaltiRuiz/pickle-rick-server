import { createContainer, asClass, asValue } from "awilix";

import { IoCBootstrapper } from "./ioc.bootstrap";
import { IoCConfiguration } from "./ioc.config";

export let AppContainerInstance: IoCBootstrapper; 

export function initIoCContainer() {
    AppContainerInstance = new IoCBootstrapper(
        {
            createContainerInstance: createContainer,
            asClassInstance: asClass,
            asValueInstance: asValue,
            containerItems: IoCConfiguration,
        },
    );
}
