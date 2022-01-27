import React from 'react';
import { Link, graphql } from 'gatsby';
import { dayjs } from '../../lib/dayjs';
import { Layout } from '../../components/layout';

const InformationPage = ({ data, location }) => {
  const rankPage = data.allPageRank.nodes;

  const rankPV = rankPage.filter((node) => node.path === location.pathname);

  console.log(rankPV);

  return (
    <Layout title={data.microcmsInformation.title}>
      <div>
        <h1>{data.microcmsInformation.title}</h1>
        <p>
          <strong>[PV: {rankPV[0].count}]</strong>
          <br />
          <time>{dayjs(data.microcmsInformation.date).format('YYYY/MM/DD')}</time>
        </p>
        <div
          dangerouslySetInnerHTML={{
            __html: data.microcmsInformation.body,
          }}
        />
      </div>
    </Layout>
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

    allPageRank(sort: { fields: [count], order: DESC }) {
      nodes {
        id
        path
        title
        count
      }
    }
  }
`;

export default InformationPage;
