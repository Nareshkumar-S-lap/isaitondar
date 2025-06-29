/* eslint-disable @typescript-eslint/no-require-imports */
import * as dotenv from 'dotenv';
dotenv.config();
import Hapi from '@hapi/hapi';
import config from 'config';
import logger from './src/common/logger';
import plugins from './src/plugins/Plugins';
import routes from './src/routes/Routes';
import { STRATEGY } from './src/common/constants/apiConstants';
import tokenValidator from './src/common/authValidation';
import connectMongoDB from './src/common/mongoDb';
import mongoose from 'mongoose';

const createServer = async () => {
    const server = new Hapi.Server({
        port: process.env.PORT,
        host: config.get('app.host'),
        routes: {
            cors: {
                origin: config.get('app.domains.allowed'),
            },
            validate: {
                failAction: async (_request, _h, err) => {
                    logger.debug(err);
                    throw err;
                },
            },
        },
    });

    await server.register(plugins);

    server.auth.strategy(STRATEGY.MULTIPLE, 'bearer-access-token', tokenValidator);

    server.route(routes);

    return server;
};

const startServer = async () => {
    try {
        await connectMongoDB();

        const server = await createServer();
        await server.start();
        logger.info(`Server running at: ${server.info.uri}`);

        process.on('unhandledRejection', (err) => {
            logger.error('Unhandled Rejection:', err);
            process.exit(1);
        });

        process.on('SIGINT', async () => {
            logger.info('Shutting down gracefully...');
            await server.stop();
            await mongoose.disconnect();
            process.exit(0);
        });

        return server;
    } catch (err) {
        logger.error('Startup error:', err);
        process.exit(1);
    }
};

startServer();

export default createServer;
