import * as React from 'react';
import { Link, graphql } from 'gatsby';

import { PostRankingWidget } from '../components/post-ranking-widget';
import { dayjs } from '../lib/dayjs';

const HomePage = ({ data, location }) => {
  return (
    <>
      <h1>Rendering Modes Starter</h1>

      <ul>
        {data.allMicrocmsInformation.edges.map(({ node }) => (
          <li key={node.informationId}>
            <Link to={`/information/${node.informationId.replace(/(_)/g, '-')}`}>
              <h2>{node.title}</h2>
              <p>{dayjs(node.date).format('YYYY/MM/DD')}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <PostRankingWidget data={data} />
      </div>
    </>
  );
};

export default HomePage;

export const query = graphql`
  query {
    allPopularPage(sort: { fields: [count], order: DESC }) {
      nodes {
        id
        path
        title
        count
      }
    }

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
