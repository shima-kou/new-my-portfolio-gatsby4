import React from 'react';
import { SEO } from './seo';

export const Layout = ({ children, title }) => {
  return (
    <div className="global-wrapper">
      <SEO title={title} />
      <main>{children}</main>
    </div>
  );
};
