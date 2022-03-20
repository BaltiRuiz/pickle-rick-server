## Installation instructions
- Download and install PostgreSQL if you do not have it already.
- Run _npm i_ command in both _client_ and _server_ folders.
- Run _npm run createDatabase_ command within _server_ folder.
- Run _npm start_ command in both _client_ and _server_ folders.
- Enjoy! :)

## Libraries used in server (apart from Express and ESLint related)
- **awilix**: For Dependency Injection.
- **axios**: For the HTTP requests to the 'Rick and Morty' API.
- **bcrypt**: To encrypt the user password.
- **body-parser**: To read bodies of POST requests.
- **dotenv**: To use custom environment variables.
- **jest**: For testing.
- **jsonwebtoken**: To create and verify JWT tokens.
- **lodash**: Utilities for objects.
- **pg**: To create the database.
- **sequelize**: To use the database.