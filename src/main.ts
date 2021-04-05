import ExpressServer from "./lib/ExpressServer";
import Database from "./lib/Database";

(async () => {
    const server = new ExpressServer();
    const database = new Database();

    database.start();
    await server.start();
})();