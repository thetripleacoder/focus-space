import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    username: String!
  }

  type Post {
    id: ID!
    text: String
    mediaUrl: String
    mediaType: String
    createdAt: String
  }

  type Query {
    me: User
    posts: [Post]
  }

  type Mutation {
    register(username: String!, password: String!): User
    login(username: String!, password: String!): String
    createPost(text: String, mediaUrl: String, mediaType: String): Post
  }

  type Subscription {
    time: String!
    postAdded: Post!
  }
`;
