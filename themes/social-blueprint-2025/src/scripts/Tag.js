export const Tag = ({ tagName, href }) => {
  return (
    href ? <a href={href} className="bg-schemesSurfaceContainer rounded-md flex items-center justify-center no-underline hover:underline">
      <div className="flex px-3 py-1.5 Blueprint-label-small text-schemesOnSurface">
        {tagName}
      </div>
    </a> :
      <div className="bg-schemesSurfaceContainer rounded-md flex items-center justify-center">
        <div className="flex px-3 py-1.5 Blueprint-label-small text-schemesOnSurface">
          {tagName}
        </div>
      </div>
  )
}