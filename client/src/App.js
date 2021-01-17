import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Chat from "./components/Chat";
import { Container } from "@material-ui/core";
import { WebSocketLink } from '@apollo/client/link/ws';
const wsLink = new WebSocketLink({
  uri: `ws://localhost:5000/`,
  options: {
    reconnect: true
  }
});
const client = new ApolloClient({
  link: wsLink,
  uri: "http://localhost:5000/",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Container>
        <h1>Chat</h1>
        <Chat />
      </Container>
    </ApolloProvider>
  );
}

export default App;
