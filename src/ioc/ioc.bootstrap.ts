import { InjectionMode, ContainerOptions, AwilixContainer } from "awilix";
import { isNil } from "lodash";

import { DependencyType } from "./ioc.enums";
import { IDependency, IIoCBootstrapperParameters } from "./ioc.interfaces";

const _ = {
    isNil,
};

/**
 * Starts doing the bootstrapping of elements into the IoC container
 * 
 * @class IoCBootstrapper
 */
export class IoCBootstrapper {
    /**
     * The container we are registering
     * 
     * @private
     * @type {AwilixContainer}
     * @memberof IoCBootstrapper
     */
    private createContainerInstance: () => AwilixContainer;

    /**
     * The instance of 'asClass' used to register classes
     * 
     * @private
     * @memberof IoCBootstrapper
     */
    private asClassInstance: (useClass: any, params: any) => any;

    /**
     * The instance of 'asValue' used to register resources
     * 
     * @private
     * @memberof IoCBootstrapper
     */
    private asValueInstance: (value: any, params: any) => any;

    /**
     * The actual container we have created
     * 
     * @private
     * @type {AwilixContainer}
     * @memberof IoCBootstrapper
     */
    private container: AwilixContainer;

    /**
     * The items we are inserting
     * 
     * @private
     * @type {IDependency[]}
     * @memberof IoCBootstrapper
     */
    private containerItems: IDependency[];

    /**
     * Retrieves an item from the container
     *
     * @param {string} containerItemName
     * 
     * @memberof IoCBootstrapper
     */
    public getContainerItem<T>(containerItemName: string): T {
        return this.container.resolve(containerItemName);
    }

    /**
     * Does the container actually have items?
     * 
     * @private
     * @memberof IoCBootstrapper
     */
    private checkContainerItems() {
        console.log("Checking if the IoC container has items within it");

        if (this.containerItems.length === 0) {
            throw new Error("IoC container was initialised with no items");
        } else {
            console.log(`IoC container has ${this.containerItems.length} items`);
        }
    }

    /**
     * Fills the container
     * 
     * @private
     * @memberof IoCBootstrapper
     */
    private populateContainer() {
        const asClass = this.asClassInstance;
        const asValue = this.asValueInstance;

        this.containerItems.forEach((item: IDependency) => {
            if (!_.isNil(item) && item.instance) {
                let registration: any;

                if (item.type === DependencyType.ClassOrService) {
                    registration = asClass(
                        item.instance,
                        { lifetime: item.lifetime },
                    );
                } else {
                    registration = asValue(
                        item.instance,
                        { lifetime: item.lifetime },
                    );
                }

                this.container.register(
                    item.name,
                    registration,
                );
            }
        });
    }

    /**
     * Automatically init the container items so they stay in context without needing to be called
     * 
     * @private
     * @memberof IoCBootstrapper
     */
    private autobootContainer() {
        const containerServices = this.containerItems.filter(
            containerItem => containerItem.type === DependencyType.ClassOrService,
        );

        containerServices.forEach((containerItem: IDependency) => {
            console.log(`Autobooting item: ${containerItem.name}`);

            try {
                this.container.resolve(containerItem.name);
            } catch (error) {
                console.log(`Failed to autoboot item: ${containerItem.name}: ${error}`);

                throw error;
            }
        });
    }

    /**
     * Initialises the IoC container instance
     * 
     * @private
     * @memberof IoCBootstrapper
     */
    private init() {
        const createContainer: (options?: ContainerOptions) => AwilixContainer = this.createContainerInstance;

        this.container = createContainer(
            { injectionMode: InjectionMode.CLASSIC },
        );

        this.checkContainerItems();
        this.populateContainer();
        this.autobootContainer();
    }

    /**
     * Creates an instance of IoCBootstrapper
     * 
     * @param {IIoCBootstrapperParameters} params
     * 
     * @memberof IoCBootstrapper
     */
    constructor(params: IIoCBootstrapperParameters) {
        this.createContainerInstance = params.createContainerInstance;
        this.asClassInstance = params.asClassInstance;
        this.asValueInstance = params.asValueInstance;
        this.containerItems = params.containerItems;

        this.init();
    }
}