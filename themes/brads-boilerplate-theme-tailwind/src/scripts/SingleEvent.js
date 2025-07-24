import React from 'react';

export const SingleEventPage = ({
  title,
  date,
  author,
  authorAvatar,
  excerpt,
  content,
  tags = [],
  imageUrl,
  speakerBlock,
}) => {
  return (
    <div className="flex items-start self-stretch">
      <div className="flex px-25 py-12 gap-4 flex-wrap items-center content-center">
        <div className="flex-[2_0_0] gap-4 flex items-start">
          <div className="flex flex-col justify-center items-start gap-4">
            <h1 className="text-3xl font-bold mb-6">{title}</h1>
            <div className="mb-6">
              {imageUrl && (
                <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                  <img src={imageUrl} alt={title} className="w-full max-h-130" />
                </div>
              )}
            </div>

            {excerpt && <p className="text-gray-700 mb-4 text-lg">{excerpt}</p>}

            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center mb-6 gap-4">
              {authorAvatar && (
                <img
                  src={authorAvatar}
                  alt={author}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{author}</div>
                <div className="text-sm text-gray-500">{date}</div>
              </div>
            </div>

            <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: content }} />

            <div className="bg-blue-900 text-white text-center p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-2">This is an inline banner</h2>
              <p className="text-sm">
                Get occasional updates on new events, groups, podcasts and more — no spam, just good
                stuff.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-[1_0_0] flex-col items-start justify-start self-stretch">
          <div className="py-[18px] px-4">Related Content</div>
        </div>
      </div>
    </div>
  );
};
