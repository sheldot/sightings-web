import React from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from './App.container';
import store from './config/store';

const client = new ApolloClient({ uri: 'http://localhost:3030/gql' });

const ApolloApp = AppContainer => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <AppContainer />
    </ApolloProvider>
  </Provider>
);

render(ApolloApp(App), document.getElementById('app'));
