const path = require('path');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
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
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-KNRSDZ4',
      },
    },
  ],
};
