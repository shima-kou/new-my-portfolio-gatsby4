import React from 'react';
import { Link } from 'gatsby';

export const PostRankingWidget = ({ data }) => {
  const informationPosts = data.allMicrocmsInformation.edges;

  const rankingPosts = data.allPageRank.nodes;

  const filteredRank = rankingPosts.filter((post) => {
    for (let information of informationPosts) {
      if (`/information/${information.node.informationId.replace(/(_)/g, '-')}/` === post.path) {
        post.title = information.node.title;

        return true;
      }
    }

    return false;
  });

  if (rankingPosts < 1) {
    return false;
  }

  return (
    <section>
      <h2>記事ランキング</h2>
      <ol>
        {filteredRank.slice(0, 3).map((post) => (
          <li key={post.id}>
            <Link to={post.path}>
              <strong>{post.title}</strong> <small>(PV: {post.count})</small>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};
