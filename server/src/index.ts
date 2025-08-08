import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { getContext } from './utils/context';

dotenv.config();
const upload = multer({ dest: 'uploads/' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/focus-space';
const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  const app = express();
  // ✅ Apply CORS globally
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(express.json());
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => getContext(ctx.connectionParams),
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: false,
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

  // Apply middleware in correct order
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => getContext(req.headers), // Apollo middleware last
    })
  );

  // REST endpoint for file upload
  app.post(
    '/upload',
    upload.single('file'),
    async (req: Request, res: Response) => {
      console.log('Uploaded file:', req.file);

      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload file to Cloudinary (auto-detect resource type)
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'focus-space',
          resource_type: 'auto',
        });

        // Delete temp file after upload
        fs.unlinkSync(req.file.path);

        // Respond with the Cloudinary URL for the uploaded media
        res.json({
          mediaUrl: result.secure_url,
          mediaType: result.resource_type,
        });
      } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message || 'Upload failed' });
      }
    }
  );

  // Connect to MongoDB and start server
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
