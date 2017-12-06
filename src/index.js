import express from 'express';

import analysisRouter from './analysis/routes';
import graphqlRouter from './graphql/routes';
import v3Router from './v3/routes';


const app = express();

// Configure Express
app.set('json spaces', 2);
app.set('view engine', 'pug');

// Routes
app.use('/analysis', analysisRouter);
app.use('/graphql', graphqlRouter);
app.use('/v3', v3Router);

// Run the server
const PORT = 8000;
const IP = '127.0.0.1';
app.listen(PORT, IP);
