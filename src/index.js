import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { split, HttpLink, ApolloLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

// subscriptions need to use a websocket, unlike queries
// apparently in a majority of cases, a client should not use
// subscriptions to stay up to date. Instead, you should
// poll intermittently (https://www.apollographql.com/docs/react/data/queries/#polling)
// with queries, or re-execute queries on demand.
// I wanted to try subscriptions however.

// websocket for subscriptions
const wsLink = new WebSocketLink({
    uri: "ws://localhost:3001/graphql",
    options: {
        reconnect: true,
    },
});

// link for queries
const httpLink = new HttpLink({
    uri: "http://localhost:3001",
});

// choose the correct link based on the operation
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const link = ApolloLink.from([splitLink]);
const client = new ApolloClient({ link, cache: new InMemoryCache() });

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
