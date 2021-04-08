import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import {readFileSync} from "fs";

import {createServer as createHttpsServer, Server as HttpsServer} from "https";
import {createServer as createHttpServer, Server as HttpServer} from "http";

import config from "../config.json";

import mainRouter from "../routers/MainRouter";

export default class ExpressServer {
    private _app: Application = express();

    private httpsServer: HttpsServer;
    private httpServer: HttpServer;

    constructor() {
        this._app.use(morgan("[:date[clf]] :method :url :status :response-time ms - :res[content-length]"));
        /*this._app.use(helmet({
            contentSecurityPolicy: false
        }));*/
        this._app.use(cors());
        this._app.set("view engine", "ejs");
        this._app.set("views", config.DEPLOY_PATH);
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(cookieSession({
            keys: [config.SECRET],
            name: "PollSession",
            //for being sure, the expiry time has been set to 3 months
            maxAge: 7776000000
        }));
    }

    async start() {
        this._app.use(`/`, mainRouter);

	this.httpServer = createHttpServer(this._app);
        this.httpServer.listen(config.PORT, () => console.log(`HTTP Server listening on ${config.PORT}`));

	if (config.USE_SSL) {
	   this._app.use((req, res, next) => {
                if (!req.secure)
                    res.redirect(`https://${config.DOMAIN}${req.url}`);
                else
                    next();
            });

	   this.httpsServer = createHttpsServer({
                key: readFileSync(config.PRIV_KEY),
                cert: readFileSync(config.CERT),
                ca: readFileSync(config.CHAIN)
            }, this._app);

	    this.httpsServer.listen(443, () => console.log(`HTTPS Server listening on 443`));
	}
    }
}
