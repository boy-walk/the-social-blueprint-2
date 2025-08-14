export const SponsorshipBanner = ({ imgSrc, enabled, href }) => {
  if (!enabled) {
    return null;
  }

  return (
    <a href={href || "#"} target="_blank">
      <div className="flex justify-center">
        <img src={imgSrc} alt="Sponsorship Banner" className="w-full h-auto object-fit rounded-xl" />
      </div>
    </a>
  )
};
