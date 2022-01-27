import * as React from 'react';
import { Link, graphql } from 'gatsby';
import { Layout } from '../../components/layout';
import { PostRankingWidget } from '../../components/post-ranking-widget';
import { dayjs } from '../../lib/dayjs';

const InformationPage = ({ data }) => {
  return (
    <>
      <Layout title="TOP">
        <h1>ニュース一覧</h1>

        <ul>
          {data.allMicrocmsInformation.edges.map(({ node }) => (
            <li key={node.informationId}>
              <Link to={`/information/${node.informationId.replace(/(_)/g, '-')}/`}>
                <span>{node.title}</span>
                <time>({dayjs(node.date).format('YYYY/MM/DD')})</time>
              </Link>
            </li>
          ))}
        </ul>

        <div>
          <PostRankingWidget data={data} />
        </div>
      </Layout>
    </>
  );
};

export default InformationPage;

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
