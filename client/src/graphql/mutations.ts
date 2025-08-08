import { gql } from '@apollo/client';

export const ADD_POST = gql`
  mutation AddPost($text: String, $mediaUrl: String, $mediaType: String) {
    addPost(text: $text, mediaUrl: $mediaUrl, mediaType: $mediaType) {
      id
      text
      mediaUrl
      mediaType
      createdAt
    }
  }
`;
