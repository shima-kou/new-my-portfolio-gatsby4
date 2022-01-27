import * as React from 'react';
import { Link, graphql } from 'gatsby';
import { Layout } from '../components/layout';
import { PostRankingWidget } from '../components/post-ranking-widget';
import { dayjs } from '../lib/dayjs';

const HomePage = ({ data }) => {
  return (
    <>
      <Layout title="TOP">
        <section>
          <h2>記事一覧</h2>
          <ul>
            {data.allMicrocmsInformation.edges.map(({ node }) => (
              <li key={node.informationId}>
                <Link to={`/information/${node.informationId.replace(/(_)/g, '-')}/`}>
                  <span>{node.title}</span>
                  <small>{dayjs(node.date).format('YYYY/MM/DD')}</small>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div>
          <PostRankingWidget data={data} />
        </div>
      </Layout>
    </>
  );
};

export default HomePage;

export const query = graphql`
  query {
    allPageRank(sort: { fields: [count], order: DESC }) {
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
