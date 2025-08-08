import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($text: String, $mediaUrl: String, $mediaType: String) {
    createPost(text: $text, mediaUrl: $mediaUrl, mediaType: $mediaType) {
      id
      text
      mediaUrl
      mediaType
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      id
      username
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;
