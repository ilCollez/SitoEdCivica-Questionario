import {Sequelize} from "sequelize";

import config from "../config.json";
import Risposte from "../lib/Risposte";

export default class Database {
    private connection = new Sequelize({
        host: config.DB.IP,
        port: config.DB.PORT,
        username: config.DB.USER,
        password: config.DB.PWD,
        database: config.DB.DATABASE,
        dialect: "mysql",
    });

    start() {
        this.connection.authenticate()
            .catch(console.error);

        Risposte.initModel(this.connection);

        console.log("Connessione al Database effettuata");
    }
}