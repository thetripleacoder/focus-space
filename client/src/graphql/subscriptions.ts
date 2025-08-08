import { gql } from '@apollo/client';

export const POST_ADDED = gql`
  subscription OnPostAdded {
    postAdded {
      id
      text
      mediaUrl
      mediaType
      createdAt
    }
  }
`;
