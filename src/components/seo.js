// src/components/seo.js
import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

import OGP from '../../static/og-image.png';

export const SEO = (props) => {
  const { title, description, image, meta = [], ...restProps } = props;

  const {
    site: { siteMetadata },
  } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `);

  return (
    <Helmet
      htmlAttributes={{ lang: 'ja' }}
      title={title || siteMetadata.title}
      titleTemplate={title ? `%s - ${siteMetadata.title}` : '%s'}
      meta={[
        {
          name: 'description',
          content: description || siteMetadata.description,
        },
        {
          property: 'og:title',
          content: title || siteMetadata.title,
        },
        {
          property: 'og:description',
          content: description || siteMetadata.description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:site_name',
          content: siteMetadata.title,
        },
        {
          property: 'og:locale',
          content: 'ja_JP',
        },
        {
          property: 'og:image',
          content: image || siteMetadata.siteUrl + OGP,
        },
        {
          property: 'og:url',
          content: siteMetadata.siteUrl,
        },
        {
          property: 'twitter:card',
          content: 'summary_large_image',
        },
        ...meta,
      ]}
      {...restProps}
    />
  );
};
