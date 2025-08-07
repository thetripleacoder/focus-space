import { ApolloProvider } from '@apollo/client';
import { client } from './graphql/client';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">FocusDock</h1>
        <p>React + GraphQL + Electron starter</p>
      </div>
    </ApolloProvider>
  );
}

export default App;
