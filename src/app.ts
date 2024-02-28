import express from 'express';
import config from 'config';
import connect from './utils/connect';
import { logger } from './utils/logger';
import routes from './routes/route';
import authRoute from './routes/authRoute';
import bodyParser from 'body-parser';

const port = config.get<number>("port")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use('/auth', authRoute.initRoutes());

app.get('/ping', (req, res, next) => {
    res.status(200).json({ message: 'pong' });
  });

app.listen(port, async ()=>{
    logger.info(`app is running on ${port}`);

    await connect();
})