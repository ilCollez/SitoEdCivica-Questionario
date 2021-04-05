import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import config from "../config.json";

import mainRouter from "../routers/MainRouter";

export default class ExpressServer {
    private _app: Application = express();

    constructor() {
        this._app.use(morgan("[:date[clf]] :method :url :status :response-time ms - :res[content-length]"));
        this._app.use(helmet({
            contentSecurityPolicy: false
        }));
        this._app.use(cors());
        this._app.set("view engine", "ejs");
        this._app.set("views", config.DEPLOY_PATH);
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(cookieSession({
            keys: [config.SECRET],
            name: "LoginStudente",
            //for being sure, the expiry time has been set to 3 months
            maxAge: 7776000000
        }));
    }

    async start() {
        this._app.use(`/`, mainRouter);

        this._app.listen(config.PORT, () => console.log(`Server Listening on port ${config.PORT}`));
    }
}