import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      text
      mediaUrl
      mediaType
      createdAt
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
    }
  }
`;
