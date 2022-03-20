import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock("../src/database/logic/authentication.database-logic");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

import { AuthenticationBusinessLogic } from "../src/business-logic/authentication.business-logic";

import { AuthenticationDatabaseLogic } from "../src/database/logic/authentication.database-logic";

import {
    InvalidPasswordConfirmationError,
    InvalidPasswordError,
    UserAlreadyExistsError,
    UserNotFoundError,
} from "../src/errors/authentication.errors";

interface IAuthenticationDatabaseLogicMethods {
    createUser: jest.Mock;
    getUserByName: jest.Mock;
}

function getAuthenticationDatabaseLogicMock(methods: IAuthenticationDatabaseLogicMethods): jest.Mock<any> {
    const mock = AuthenticationDatabaseLogic as unknown as jest.Mock<any>;

    mock.mockImplementation(() => {
        return {
            ...methods,
        };
    });

    return mock;
}

const USERNAME = "Test";
const USERPASSWORD = "Secret";
const ENCRYPTEDPASSWORD = "SuperSecret";
const TOKEN = "Token";

describe("AuthenticationBusinessLogic tests", () => {
    let authenticationBusinessLogic: AuthenticationBusinessLogic;

    let authenticationDatabaseLogicMock: jest.Mock<any>;
    let authenticationDatabaseLogicMockMethods: IAuthenticationDatabaseLogicMethods;

    const jwtSignMock = jest.spyOn(jsonwebtoken, "sign");
    const bcryptHashMock = jest.spyOn(bcrypt, "hash");
    const bcryptCompareMock = jest.spyOn(bcrypt, "compare");

    beforeAll(() => {
        authenticationDatabaseLogicMockMethods = {
            createUser: jest.fn(),
            getUserByName: jest.fn(),
        };

        authenticationDatabaseLogicMock = getAuthenticationDatabaseLogicMock(authenticationDatabaseLogicMockMethods);

        authenticationBusinessLogic = new AuthenticationBusinessLogic(
            new authenticationDatabaseLogicMock(),
        );

        bcryptHashMock.mockImplementation(() => ENCRYPTEDPASSWORD);
        jwtSignMock.mockImplementation(() => Promise.resolve(TOKEN));
    });

    it("AuthenticationBusinessLogic - registerUser - Success case", async () => {
        authenticationDatabaseLogicMockMethods.getUserByName.mockImplementationOnce(() => Promise.resolve(null));
        authenticationDatabaseLogicMockMethods.createUser.mockImplementationOnce(() => Promise.resolve({ id: 1, name: USERNAME }));

        const userToken = await authenticationBusinessLogic.registerUser(USERNAME, USERPASSWORD, USERPASSWORD);

        expect(bcrypt.hash).toHaveBeenCalled();
        expect(authenticationDatabaseLogicMockMethods.createUser).toHaveBeenCalled();
        expect(jsonwebtoken.sign).toHaveBeenCalled();
        expect(userToken).toEqual(TOKEN);
    });

    it("AuthenticationBusinessLogic - registerUser - User already exists", async () => {
        authenticationDatabaseLogicMockMethods.getUserByName.mockImplementationOnce(() => Promise.resolve({ id: 1, name: USERNAME }));

        try {
            await authenticationBusinessLogic.registerUser(USERNAME, USERPASSWORD, USERPASSWORD);

            expect(true).toBeFalsy();   // We should not reach this
        } catch (error) {
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(authenticationDatabaseLogicMockMethods.createUser).not.toHaveBeenCalled();
            expect(jsonwebtoken.sign).not.toHaveBeenCalled();
            expect(error).toStrictEqual(
                new UserAlreadyExistsError(USERNAME),
            );
        }
    });

    it("AuthenticationBusinessLogic - registerUser - Incorrect password confirmation", async () => {
        authenticationDatabaseLogicMockMethods.getUserByName.mockImplementationOnce(() => Promise.resolve(null));

        try {
            await authenticationBusinessLogic.registerUser(USERNAME, USERPASSWORD, "Something");

            expect(true).toBeFalsy();   // We should not reach this
        } catch (error) {
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(authenticationDatabaseLogicMockMethods.createUser).not.toHaveBeenCalled();
            expect(jsonwebtoken.sign).not.toHaveBeenCalled();
            expect(error).toStrictEqual(
                new InvalidPasswordConfirmationError(),
            );
        }
    });

    it("AuthenticationBusinessLogic - loginUser - Success case", async () => {
        authenticationDatabaseLogicMockMethods.getUserByName.mockImplementationOnce(() => Promise.resolve({ id: 1, name: USERNAME }));
        bcryptCompareMock.mockImplementationOnce(() => Promise.resolve(true));

        const userToken = await authenticationBusinessLogic.loginUser(USERNAME, USERPASSWORD);

        expect(bcrypt.compare).toHaveBeenCalled();
        expect(jsonwebtoken.sign).toHaveBeenCalled();
        expect(userToken).toEqual(TOKEN);
    });

    it("AuthenticationBusinessLogic - loginUser - User not found", async () => {
        authenticationDatabaseLogicMockMethods.getUserByName.mockImplementationOnce(() => Promise.resolve(null));

        try {
            await authenticationBusinessLogic.loginUser(USERNAME, USERPASSWORD);

            expect(true).toBeFalsy();   // We should not reach this
        } catch (error) {
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(jsonwebtoken.sign).not.toHaveBeenCalled();
            expect(error).toStrictEqual(
                new UserNotFoundError(USERNAME),
            );
        }
    });

    it("AuthenticationBusinessLogic - loginUser - Invalid password", async () => {
        authenticationDatabaseLogicMockMethods.getUserByName.mockImplementationOnce(() => Promise.resolve({ id: 1, name: USERNAME }));
        bcryptCompareMock.mockImplementationOnce(() => Promise.resolve(false));

        try {
            await authenticationBusinessLogic.loginUser(USERNAME, USERPASSWORD);

            expect(true).toBeFalsy();   // We should not reach this
        } catch (error) {
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(jsonwebtoken.sign).not.toHaveBeenCalled();
            expect(error).toStrictEqual(
                new InvalidPasswordError(),
            );
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
