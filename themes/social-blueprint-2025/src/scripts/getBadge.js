export const getBadge = (type) => {
  switch (type?.toLowerCase()) {
    case 'tribe_events':
      return 'Event';
    case 'podcast':
      return 'Interviews';
    case 'article':
      return 'Article';
    case 'directory':
      return 'Directory';
    case 'resource':
      return 'Resource';
    case 'gd_discount':
      return 'Message Board';
    case 'gd_aid_listing':
      return 'Aid Listing';
    case 'gd_health_listing':
      return 'Health Listing';
    case 'gd_business':
      return 'Business';
    case 'gd_photo_gallery':
      return 'Photo Gallery';
    case 'gd_cost_of_living':
      return 'Cost of Living';
    default:
      return "Post";
  }
};