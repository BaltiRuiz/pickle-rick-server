import pg from "pg";

const dbConfig = {
    user: "postgres",
    host: "localhost",
    password: "postgres",
    port: 5432,
}

const pool = new pg.Pool(dbConfig);
const client = new pg.Client(
    {
        ...dbConfig,
        database: "pickle_rick_db",
    },
);

pool.query("CREATE DATABASE pickle_rick_db", (err: any) => {
    if (err) {
        console.log(`There was an error while creating the database: ${err}`);

        process.exit(-1);
    } else {
        console.log("Database successfully created");

        client.connect();

        client.query(
            "CREATE TABLE public.user(id INTEGER NOT NULL, name CHARACTER VARYING(50) NOT NULL, password TEXT NOT NULL, PRIMARY KEY(id), CONSTRAINT user_name_key UNIQUE(name))",
            (err: any) => {
                if (err) {
                    console.log(`There was an error while creating user table: ${err}`);

                    process.exit(-1);
                } else {
                    console.log("User table successfully created");
                }
            }
        );

        client.query(
            "CREATE SEQUENCE public.user_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1",
            (err: any) => {
                if (err) {
                    console.log(`There was an error while creating user sequence: ${err}`);

                    process.exit(-1);
                } else {
                    console.log("User sequence successfully created");
                }
            }
        );

        client.query(
            "ALTER SEQUENCE public.user_id_seq OWNED BY public.user.id",
            (err: any) => {
                if (err) {
                    console.log(`There was an error while assigning user sequence: ${err}`);

                    process.exit(-1);
                } else {
                    console.log("User sequence successfully assigned");
                }
            }
        );

        client.query(
            "ALTER TABLE ONLY public.user ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass)",
            (err: any) => {
                if (err) {
                    console.log(`There was an error while setting default user sequence value: ${err}`);

                    process.exit(-1);
                } else {
                    console.log("User sequence default value successfully set");
                }
            }
        );

        client.query(
            "CREATE TABLE public.favourite(id INTEGER NOT NULL, resource_type CHARACTER VARYING(15) NOT NULL, resource_id INTEGER NOT NULL, user_id INTEGER NOT NULL, PRIMARY KEY(id))",
            (err: any) => {
                if (err) {
                    console.log(`There was an error while creating favourite table: ${err}`);

                    process.exit(-1);
                } else {
                    console.log("Favourite table successfully created");
                }
            }
        );

        client.query(
            "CREATE SEQUENCE public.favourite_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1",
            (err: any) => {
                if (err) {
                    console.log(`There was an error while creating favourite sequence: ${err}`);

                    process.exit(-1);
                } else {
                    console.log("Favourite sequence successfully created");
                }
            }
        );

        client.query(
            "ALTER SEQUENCE public.favourite_id_seq OWNED BY public.favourite.id",
            (err: any) => {
                if (err) {
                    console.log(`There was an error while assigning favourite sequence: ${err}`);

                    process.exit(-1);
                } else {
                    console.log("Favourite sequence successfully assigned");
                }
            }
        );

        client.query(
            "ALTER TABLE ONLY public.favourite ALTER COLUMN id SET DEFAULT nextval('public.favourite_id_seq'::regclass)",
            (err: any) => {
                if (err) {
                    console.log(`There was an error while setting default favourite sequence value: ${err}`);

                    process.exit(-1);
                } else {
                    console.log("Favourite sequence default value successfully set");

                    process.exit(0);
                }
            }
        );
    }
});