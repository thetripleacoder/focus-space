import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { getContext } from './utils/context';

dotenv.config();
const pubsub = new PubSub();

const start = async () => {
  const app = express();

  app.use(express.json());
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  useServer(
    { schema, context: async (ctx, msg, args) => ({ pubsub }) },
    wsServer
  );

  const server = new ApolloServer({ schema });
  await server.start();

  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => getContext(req.headers.authorization),
    })
  );

  mongoose
    .connect(process.env.MONGODB_URI || '', { dbName: 'focus-space' })
    .then(() => {
      console.log('Connected to MongoDB');
      httpServer.listen({ port: 4000 }, () => {
        console.log('Server ready at http://localhost:4000/graphql');
      });
    })
    .catch((err) => console.error('MongoDB connection error:', err));
};

start();
