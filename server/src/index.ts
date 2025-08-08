// server/index.ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';

import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { getContext } from './utils/context'; // parses JWT and returns currentUser

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/focus-space';
const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  const app = express();
  app.use(express.json());
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Set up WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => getContext(ctx.connectionParams),
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => getContext(req.headers),
    })
  );

  mongoose
    .connect(MONGO_URI, { dbName: 'focus-space' })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`📡 Subscriptions ready at ws://localhost:${PORT}/graphql`);
      });
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

startServer();
