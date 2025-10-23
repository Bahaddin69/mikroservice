import { createServer } from "node:http";
import { APP_PORT } from "./config";
import { InitializeBroker } from "./services/broker.service";

const createServers = async () => {
    const server = createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello World!\n");
    });

    await InitializeBroker();

    server.listen(Number(APP_PORT), "localhost", () => {
        console.log(`Mail Service listening at http://localhost:${APP_PORT}`);
    });

}

createServers().then(() => {
    console.log("Server started");
});
