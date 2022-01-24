import React from 'react';
import { Link, graphql } from 'gatsby';
import { dayjs } from '../../lib/dayjs';

const InformationPage = ({ data, location }) => {
  return (
    <div>
      <h1>{data.microcmsInformation.title}</h1>
      <p>{dayjs(data.microcmsInformation.date).format('YYYY/MM/DD')}</p>
    </div>
  );
};

export const query = graphql`
  query ($informationId: String) {
    microcmsInformation(informationId: { eq: $informationId }) {
      informationId
      title
      date
      body
      thumbnail {
        url
      }
      category {
        name
      }
    }
  }
`;

export default InformationPage;
