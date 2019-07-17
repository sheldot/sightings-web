import { gql } from 'apollo-boost';

export const GET_DATASET = gql`
  query {
    sightings {
      _id
      createdDate
      addressType
      coordinates {
        lat
        long
      }
    }
    restaurants {
      categoryName
      name
      latitude
      longitude
      polygon {
        lat
        long
      }
    }
  }
`;
