export const SponsorshipBanner = ({ imgSrc, enabled }) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <img src={imgSrc} alt="Sponsorship Banner" className="max-w-2xl w-auto h-auto object-none" />
    </div>
  )
};
