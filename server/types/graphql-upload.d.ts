declare module 'graphql-upload' {
  import { RequestHandler } from 'express';
  export default function graphqlUploadExpress(options?: {
    maxFieldSize?: number;
    maxFileSize?: number;
    maxFiles?: number;
  }): RequestHandler;
}
