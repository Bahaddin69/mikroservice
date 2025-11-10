import expressApp from './express-app';
import dotenv from 'dotenv';
import { InitializeBroker } from './services/broker.service';

dotenv.config();

const PORT = process.env.APP_PORT || 9006;

export const StartServer = async () => {

    expressApp.listen(PORT, () => {
        console.log(`App is listening to ${PORT}`);
    })

    process.on("unaughtException", (err) => {
        console.error(err);
        process.exit(1);
    });

    await InitializeBroker();
}

StartServer().then(() => {
    console.info("Server started");
});
