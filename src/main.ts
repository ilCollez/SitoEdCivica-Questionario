import ExpressServer from "./lib/ExpressServer";

(async () => {
    const server = new ExpressServer();

    await server.start();
})();