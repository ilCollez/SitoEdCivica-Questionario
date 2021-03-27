import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

import config from "../../config.json";

import mainRouter from "../routers/MainRouter";

export default class ExpressServer {
    private _app: Application = express();

    constructor() {
        this._app.use(morgan("combined"));
        this._app.use(helmet());
        this._app.use(cors());
        this._app.use(bodyParser.urlencoded({ extended: true }));
    }

    async start() {
        this._app.use("/", mainRouter);

        this._app.listen(config.PORT, () => console.log(`Server Listening on port ${config.PORT}`));
    }
}