import React, { useState } from 'react';

// import { addDataToMap, wrapTo } from 'kepler.gl/actions';
import { Query } from 'react-apollo';
import { hot } from 'react-hot-loader/root';

import { GET_DATASET } from './api/query.api';
import KeplerMap from './components/KeplerMap/KeplerMap.component';

import style from './app.style.css';

// Hacky work around since kepler doesnt work on react-redux >5.0.7 https://github.com/keplergl/kepler.gl/issues/351
import store from './config/store';

function App() {
  const [title, setTitle] = useState('Welcome');

  // Handler of GraphQL response
  const renderMap = ({ loading, error, data }) => {
    if (loading || error) {
      setTitle(loading ? 'Loading...' : 'Error!');
      return <h1 className={style.titleText}>{title}</h1>;
    }

    setTitle('');

    return <KeplerMap data={data} store={store} />;
  };

  return (
    <div
      className={style.container}
      style={{ alignItems: !!title.length ? 'center' : '' }}
    >
      <Query query={GET_DATASET}>{renderMap}</Query>
    </div>
  );
}

export default hot(App);
