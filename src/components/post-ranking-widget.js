import React from 'react';
import { Link } from 'gatsby';

export const PostRankingWidget = ({ data }) => {
  const posts = data.allPopularPage.nodes;

  if (posts.length < 1) {
    return ``;
  }

  return (
    <section>
      <ol>
        {posts.map((post) => (
          <li key={post.id}>
            <a as={Link} to={post.path}>
              <strong>{post.title}</strong> / <small>{post.count}</small>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
};
