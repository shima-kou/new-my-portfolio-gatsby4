import * as React from 'react';
import { dayjs } from '../lib/dayjs';
import { Link, graphql } from 'gatsby';

const HomePage = ({ data, location }) => {
  return (
    <>
      <h1>Rendering Modes Starter</h1>

      <ul>
        {data.allMicrocmsInformation.edges.map(({ node }) => (
          <li key={node.informationId}>
            <Link to={`/information/${node.informationId}`}>
              <h2>{node.title}</h2>
              <p>{dayjs(node.date).format('YYYY/MM/DD')}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default HomePage;

export const query = graphql`
  query {
    allMicrocmsInformation {
      edges {
        node {
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
    }
  }
`;
