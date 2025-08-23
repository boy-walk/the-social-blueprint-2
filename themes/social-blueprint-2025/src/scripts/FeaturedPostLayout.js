import React from 'react';
import { ContentCard } from './ContentCard';
import { DetailedCard } from './DetailedCard';
import { getBadge } from './getBadge';

export default function FeaturedPostLayout({ posts }) {
  if (!posts) return null;

  const postLength = posts.length < 3 ? posts.length : 3;

  const hero = posts[0];
  const stack = posts.slice(1, postLength);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full items-stretch">
      <div className="flex-1 md:flex-2 lg:flex-2 w-full">
        {hero && (<ContentCard
          date={hero.date}
          image={hero.thumbnail}
          type={hero.post_type}
          badge={getBadge(hero.post_type)}
          href={hero.permalink}
          fullHeight
          fullWidth
          title={hero.title}
        />)}
      </div>
      <div className={`flex-4 md:flex-2 lg:flex-3 flex flex-col gap-3`}>
        {stack.map((post, i) => (
          <div key={i} className="w-full h-full">
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
