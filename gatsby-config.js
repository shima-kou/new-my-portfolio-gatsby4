const path = require('path');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: 'Google Analytics Reporting API テスト',
    author: {
      name: 'Shimako',
    },
    description: 'Google Analytics Reporting API テスト',
    siteUrl: 'https://nervous-goldwasser-f655b8.netlify.app/',
  },
  plugins: [
    {
      resolve: 'gatsby-source-microcms',
      options: {
        apiKey: process.env.API_KEY,
        serviceId: process.env.SERVICE_ID,
        apis: [
          {
            endpoint: 'information',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: ['G-TB4B2MFE7S'],
        gtagConfig: {
          optimize_id: 'GTM-KNRSDZ4',
        },
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@': 'src',
        },
        extensions: ['js'],
      },
    },
  ],
};
