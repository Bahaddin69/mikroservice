import * as cfg from './config'
import { ExpressApp } from "./express-app";
import { logger } from './utils';

export const StartServer = async () => {
    const expressApp = await ExpressApp();
    expressApp.listen(cfg.APP_PORT, () => {
        logger.info(`App is listening to ${cfg.APP_PORT}`);
    });

    process.on("uncaughtException", (err) => {
        logger.error(err);
        process.exit(1);
    });
}

StartServer().then(() => {
    logger.info("Server started");
});
