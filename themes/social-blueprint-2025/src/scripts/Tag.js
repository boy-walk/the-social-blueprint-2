import React from 'react';

export const Tag = ({ tagName }) => {
  return (
    <div className="bg-schemesSurfaceContainer rounded-md flex items-center justify-center">
      <div className="flex px-3 py-1.5 Blueprint-label-small text-schemesOnSurface">
        {tagName}
      </div>
    </div>
  )
}