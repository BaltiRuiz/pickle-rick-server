import axios from "axios";

jest.mock("../src/database/logic/resource.database-logic");
jest.mock("axios");

import { Resources } from "../src/enums/resources.enums";

import { ResourceBusinessLogic } from "../src/business-logic/resource.business-logic";

import { ResourceDatabaseLogic } from "../src/database/logic/resource.database-logic";

interface IResourceDatabaseLogicMethods {
    getFavouriteResourceObject: jest.Mock;
    getFavouriteResourcesIDsFromUser: jest.Mock;
    markResourceAsFavourite: jest.Mock;
    removeResourceAsFavourite: jest.Mock;
}

function getResourceDatabaseLogicMock(methods: IResourceDatabaseLogicMethods): jest.Mock<any> {
    const mock = ResourceDatabaseLogic as unknown as jest.Mock<any>;

    mock.mockImplementation(() => {
        return {
            ...methods,
        };
    });

    return mock;
}

const USERID = 1;

describe("ResourceBusinessLogic tests", () => {
    let resourceBusinessLogic: ResourceBusinessLogic;

    let resourceDatabaseLogicMock: jest.Mock<any>;
    let resourceDatabaseLogicMockMethods: IResourceDatabaseLogicMethods;

    const axiosGetMock = jest.spyOn(axios, "get");

    beforeAll(() => {
        resourceDatabaseLogicMockMethods = {
            getFavouriteResourceObject: jest.fn(),
            getFavouriteResourcesIDsFromUser: jest.fn().mockImplementation(() => Promise.resolve([1, 2, 3])),
            markResourceAsFavourite: jest.fn(),
            removeResourceAsFavourite: jest.fn(),
        };

        resourceDatabaseLogicMock = getResourceDatabaseLogicMock(resourceDatabaseLogicMockMethods);

        resourceBusinessLogic = new ResourceBusinessLogic(
            Resources.Character,
            new resourceDatabaseLogicMock(),
        );
    });

    it("ResourceBusinessLogic - appendIsFavouriteField", async () => {
        const resources: any[] = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
        ];

        await resourceBusinessLogic.appendIsFavouriteField(resources, USERID);

        expect(resources[0].favourite).toBeTruthy();
        expect(resources[1].favourite).toBeTruthy();
        expect(resources[2].favourite).toBeTruthy();
        expect(resources[3].favourite).toBeFalsy();
    });

    it("ResourceBusinessLogic - getAllResources", async () => {
        axiosGetMock.mockImplementationOnce(() => {
            return Promise.resolve(
                {
                    data: {
                        results: [
                            { id: 1 },
                            { id: 2 },
                            { id: 3 },
                            { id: 4 },
                            { id: 5 },
                        ],
                    },
                },
            );
        });

        jest.spyOn(resourceBusinessLogic, "appendIsFavouriteField").mockImplementation(() => Promise.resolve());

        const response = await resourceBusinessLogic.getAllResources(USERID);

        expect(response.statusCode).toEqual(200);
        expect(response.result.data.length).toEqual(5);
    });

    it("ResourceBusinessLogic - getResource - Success case", async () => {
        axiosGetMock.mockImplementationOnce(() => {
            return Promise.resolve(
                {
                    data: { id: 1 },
                },
            );
        });

        jest.spyOn(resourceBusinessLogic, "appendIsFavouriteField").mockImplementation(() => Promise.resolve());

        const response = await resourceBusinessLogic.getResource(USERID, "1");

        expect(response.statusCode).toEqual(200);
        expect(response.result.data.length).toEqual(1);
    });

    it("ResourceBusinessLogic - getResource - Non numeric ID", async () => {
        const response = await resourceBusinessLogic.getResource(USERID, "Something");

        expect(response.statusCode).toEqual(400);
        expect(response.result.data).toBeNull();
        expect(axios.get).not.toHaveBeenCalled();
    });

    it("ResourceBusinessLogic - getMultipleResources - Success case", async () => {
        axiosGetMock.mockImplementationOnce(() => {
            return Promise.resolve(
                {
                    data: [
                        { id: 1 },
                        { id: 2 },
                        { id: 3 },
                        { id: 4 },
                    ],
                },
            );
        });

        jest.spyOn(resourceBusinessLogic, "appendIsFavouriteField").mockImplementation(() => Promise.resolve());

        const response = await resourceBusinessLogic.getMultipleResources(USERID, ["1", "2", "3", "4"]);

        expect(response.statusCode).toEqual(200);
        expect(response.result.data.length).toEqual(4);
    });

    it("ResourceBusinessLogic - getMultipleResources - Non numeric IDs", async () => {
        const response = await resourceBusinessLogic.getMultipleResources(USERID, ["A", "B", "C", "D"]);

        expect(response.statusCode).toEqual(400);
        expect(response.result.data).toBeNull();
        expect(axios.get).not.toHaveBeenCalled();
    });

    it("ResourceBusinessLogic - filterResources", async () => {
        axiosGetMock.mockImplementationOnce(() => {
            return Promise.resolve(
                {
                    data: {
                        results: [
                            { id: 1 },
                            { id: 2 },
                            { id: 3 },
                        ],
                    },
                },
            );
        });

        jest.spyOn(resourceBusinessLogic, "appendIsFavouriteField").mockImplementation(() => Promise.resolve());

        const response = await resourceBusinessLogic.filterResources(USERID, { name: "Rick" });

        expect(response.statusCode).toEqual(200);
        expect(response.result.data.length).toEqual(3);
    });

    it("ResourceBusinessLogic - markOrRemoveFavouriteResource - Adding favourite resource", async () => {
        resourceDatabaseLogicMockMethods.getFavouriteResourceObject.mockImplementationOnce(() => Promise.resolve(null));
        resourceDatabaseLogicMockMethods.markResourceAsFavourite.mockImplementationOnce(() => Promise.resolve());

        await resourceBusinessLogic.markOrRemoveFavouriteResource(1, USERID);

        expect(resourceDatabaseLogicMockMethods.getFavouriteResourceObject).toHaveBeenCalled();
        expect(resourceDatabaseLogicMockMethods.removeResourceAsFavourite).not.toHaveBeenCalled();
        expect(resourceDatabaseLogicMockMethods.markResourceAsFavourite).toHaveBeenCalled();
    });

    it("ResourceBusinessLogic - markOrRemoveFavouriteResource - Removing favourite resource", async () => {
        resourceDatabaseLogicMockMethods.getFavouriteResourceObject.mockImplementationOnce(() => Promise.resolve({ id: 1 }));
        resourceDatabaseLogicMockMethods.removeResourceAsFavourite.mockImplementationOnce(() => Promise.resolve(1));

        await resourceBusinessLogic.markOrRemoveFavouriteResource(1, USERID);

        expect(resourceDatabaseLogicMockMethods.getFavouriteResourceObject).toHaveBeenCalled();
        expect(resourceDatabaseLogicMockMethods.removeResourceAsFavourite).toHaveBeenCalled();
        expect(resourceDatabaseLogicMockMethods.markResourceAsFavourite).not.toHaveBeenCalled();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
