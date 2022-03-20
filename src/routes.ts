import * as core from 'express-serve-static-core';
import { isEmpty } from 'lodash';
import bodyParser from 'body-parser';

import { AppContainerInstance } from './ioc/ioc.init';
import { DIKeys } from './ioc/ioc.enums';

import { ResourceBusinessLogic } from './business-logic/resource.business-logic';
import { AuthenticationBusinessLogic } from './business-logic/authentication.business-logic';

import {
    InvalidPasswordError,
    InvalidPasswordConfirmationError,
    TokenVerificationError,
    UserNotFoundError,
    UserAlreadyExistsError,
} from './errors/authentication.errors';

const _ = {
    isEmpty,
};

const routes = (app: core.Express) => {
    const jsonParser = bodyParser.json();

    app.post("/login", jsonParser, async (req, res) => {
        try {
            const userName = req.body.name;
            const userPassword = req.body.password;

            const authenticationBL: AuthenticationBusinessLogic = AppContainerInstance.getContainerItem(
                DIKeys.AuthenticationBusinessLogic,
            );

            const userToken = await authenticationBL.loginUser(userName, userPassword);

            res.status(200).send(userToken);
        } catch (error) {
            if (error instanceof InvalidPasswordError) {
                res.status(400).send(error.message);
            } else if (error instanceof UserNotFoundError) {
                res.status(404).send(error.message);
            } else {
                res.status(500).send("There was an internal error while login the user");
            }
        }
    });

    app.post("/user", jsonParser, async (req, res) => {
        try {
            const userName = req.body.name;
            const userPassword = req.body.password;
            const userPasswordConfirmation = req.body.passwordConfirmation;

            const authenticationBL: AuthenticationBusinessLogic = AppContainerInstance.getContainerItem(
                DIKeys.AuthenticationBusinessLogic,
            );

            const newUserToken = await authenticationBL.registerUser(userName, userPassword, userPasswordConfirmation);

            res.status(201).send(newUserToken);
        } catch (error) {
            if (error instanceof InvalidPasswordConfirmationError) {
                res.status(400).send(error.message);
            } else if (error instanceof UserAlreadyExistsError) {
                res.status(409).send(error.message);
            } else {
                res.status(500).send("There was an internal error while registering the user");
            }
        }
    });

    app.get(/(character|location|episode)(\/(.*))?/, async (req, res) => {
        try {
            const authenticationBL: AuthenticationBusinessLogic = AppContainerInstance.getContainerItem(
                DIKeys.AuthenticationBusinessLogic,
            );

            const userID: any = authenticationBL.verifyToken(req.headers.authorization);

            const resourceType = req.params[0];
            const queryParams = req.query;
            const endpointParameter = req.params[2];

            const resourceManager: ResourceBusinessLogic = AppContainerInstance.getContainerItem(resourceType);

            let endpointResult: any = {
                statusCode: 400,
                result: {
                    data: null,
                    message: "Invalid request",
                },
            };

            if (!_.isEmpty(queryParams)) {
                endpointResult = await resourceManager.filterResources(userID, queryParams);
            } else {
                if (endpointParameter) {
                    const splittedEndpointParameters = endpointParameter.split(",");

                    if (splittedEndpointParameters.length === 1) {
                        endpointResult = await resourceManager.getResource(userID, splittedEndpointParameters[0]);
                    } else {
                        endpointResult = await resourceManager.getMultipleResources(userID, splittedEndpointParameters);
                    }
                } else {
                    endpointResult = await resourceManager.getAllResources(userID);
                }
            }

            res.status(endpointResult.statusCode).send(endpointResult.result)
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                res.status(401).send(error.message);
            } else if (error.response) {
                res.status(error.response.status).send(
                    { data: null, message: error.response.data.error },
                );
            } else {
                res.status(500).send(
                    { data: null, message: "There was an internal error while requesting the resource" },
                );
            }
        }
    });

    app.post(/favourite\/(character|location|episode)\/(.*)/, async (req, res) => {
        try {
            const authenticationBL: AuthenticationBusinessLogic = AppContainerInstance.getContainerItem(
                DIKeys.AuthenticationBusinessLogic,
            );

            const userID: any = authenticationBL.verifyToken(req.headers.authorization);

            const resourceType = req.params[0];
            const resourceID = +req.params[1];

            const resourceManager: ResourceBusinessLogic = AppContainerInstance.getContainerItem(resourceType);

            await resourceManager.markOrRemoveFavouriteResource(resourceID, userID);

            res.status(204).send();
        } catch (error) {
            if (error instanceof TokenVerificationError) {
                res.status(401).send();
            } else {
                res.status(500).send("There was an internal error while marking or removing the favourite resource");
            }
        }
    });
}

export default routes;
