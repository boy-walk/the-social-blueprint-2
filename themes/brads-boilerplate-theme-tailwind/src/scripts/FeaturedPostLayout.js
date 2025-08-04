import React from 'react';
import { ContentCard } from './ContentCard';
import { DetailedCard } from './DetailedCard';

export default function FeaturedPostLayout({ posts }) {
  if (!posts || posts.length < 3) return null;

  const hero = posts[0];
  const stack = posts.slice(1, 3);

  console.log(hero.date)

  const getBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'podcast':
        return 'Podcast';
      case 'blog':
        return 'Blog';
      case 'event':
        return 'Event';
      case 'article':
        return 'Article';
      default:
        return "Post";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full items-stretch">
      <div className="flex-1 w-full">
        <ContentCard
          date={hero.date}
          image={hero.thumbnail}
          type={hero.post_type}
          badge={getBadge(hero.post_type)}
          href={hero.permalink}
          fullHeight
          fullWidth
          title={hero.title}
        />
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {stack.map((post, i) => (
          <div key={i} className="flex-1">
            <DetailedCard
              key={i}
              image={post.thumbnail}
              category={post.post_type}
              title={post.title}
              description={post.excerpt}
              author={post.author}
              date={post.date}
              href={post.permalink}
              buttonText="Read more"
            />
          </div>
        ))}
      </div>
    </div>

  );
}
