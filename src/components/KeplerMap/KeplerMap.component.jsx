import React, { useEffect } from 'react';

import KeplerGl from 'kepler.gl';
import { addDataToMap } from 'kepler.gl/actions';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { ThemeProvider } from 'styled-components';

import config from '../../config/config';
import style from './KeplerMap.style';

const structureDataset = (label, id, fields, rows) => ({
  info: {
    label,
    id,
  },
  data: {
    fields,
    rows,
  },
});

function timeConverter(timestamp) {
  const t = new Date(parseInt(timestamp, 10));

  const year = t.getFullYear();
  const date = t.getDate();
  let month = t.getMonth() + 1;
  month = month < 10 ? '0' + month : month;

  const hour = t.getHours() < 10 ? '0' + t.getHours() : t.getHours();
  const min = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes();
  const sec = t.getSeconds() < 10 ? '0' + t.getSeconds() : t.getSeconds();

  return `${year}-${month}-${date} ${hour}:${min}:${sec}`;
}

function KeplerMap({ data, store }) {
  const { sightings, restaurants } = data;

  useEffect(() => {
    // Adding the Restaurant data
    const restaurantsRows = restaurants.map(({ name, latitude, longitude }) => [
      name,
      latitude,
      longitude,
    ]);
    const restaurantDataset = structureDataset(
      'Restaurants in New York City',
      'restaurant_data',
      [
        {
          name: 'name',
          format: '',
          type: 'string',
        },
        {
          name: 'latitude',
          format: '',
          type: 'real',
        },
        {
          name: 'longitude',
          format: '',
          type: 'real',
        },
      ],
      restaurantsRows,
    );

    // Adding the Sightings data
    const sightingsRows = sightings.map(({ coordinates, createdDate }) => [
      timeConverter(createdDate),
      coordinates.lat,
      coordinates.long,
    ]);

    const sightingsDataset = structureDataset(
      'Rat Sightings in New York City',
      'sightings_data',
      [
        {
          name: 'createdDate',
          format: 'YYYY-M-D H:m:s',
          type: 'timestamp',
        },
        {
          name: 'latitude',
          format: '',
          type: 'real',
        },
        {
          name: 'longitude',
          format: '',
          type: 'real',
        },
      ],
      sightingsRows,
    );

    store.dispatch(
      addDataToMap({
        datasets: [restaurantDataset, sightingsDataset],
        option: {
          centerMap: true,
          readOnly: false,
        },
        config: {
          visState: {
            filters: [
              {
                id: 'sightingGL',
                dataId: 'sightings_data',
                name: 'createdDate',
                type: 'timeRange',
                enlarged: true,
              },
            ],
          },
        },
      }),
    );
  }, []);

  return (
    <ThemeProvider theme={style.currentTheme}>
      <AutoSizer>
        {({ height, width }) => (
          <KeplerGl
            id="sightingGL"
            store={store}
            mapboxApiAccessToken={config.MAPBOX_KEY}
            height={height}
            width={width}
          />
        )}
      </AutoSizer>
    </ThemeProvider>
  );
}

KeplerMap.propTypes = {
  data: PropTypes.InstanceOf(Object).isRequired,
  store: PropTypes.InstanceOf(Object).isRequired,
};

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  dispatchToProps,
)(KeplerMap);
