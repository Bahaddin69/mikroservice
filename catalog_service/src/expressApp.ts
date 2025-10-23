import express from 'express';
import catalogRouter from './api/catalog.routes';
import { httpLogger, HandleErrorWithLogger } from './utils';
import { ElasticSearchService } from './services/elasticsearch.service';
import { AppEventListener } from './utils/AppEventListener';

const app = express();
app.use(express.json());
app.use(httpLogger);

const elasticSearchService = new ElasticSearchService();
AppEventListener.instance.listen(elasticSearchService);

app.use("/", catalogRouter);

app.use(HandleErrorWithLogger);

export default app;
