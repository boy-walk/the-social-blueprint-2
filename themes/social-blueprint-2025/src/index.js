// src/index.js
import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';

const $ = (id) => document.getElementById(id);
const parse = (s, fallback = '{}') => {
  try { return JSON.parse(s ?? fallback); } catch {
    return JSON.parse(fallback);
  }
};

// Mount helper: loads the component only if the element exists.
function mount(id, loader, propsFromEl = () => ({})) {
  const el = $(id);
  if (!el) return;
  loader().then((Comp) => {
    ReactDOM.createRoot(el).render(React.createElement(Comp, propsFromEl(el)));
  }).catch((e) => { if (process.env.NODE_ENV !== 'production') console.error(e); });
}

/* ---------- One call per mount point ---------- */

// Front page
mount(
  'front-page',
  () => import(/* webpackChunkName: "front-page" */ './scripts/FrontPage').then(m => m.default),
  (el) => parse(el.dataset.props || '{}')
);

// Header
mount(
  'header',
  () => import(/* webpackChunkName: "header" */ './scripts/Header').then(m => m.default),
  (el) => ({ isUserLoggedIn: el.getAttribute('isUserLoggedIn') === 'true' })
);

// Section one
mount(
  'section-one',
  () => import(/* webpackChunkName: "section-one" */ './scripts/SectionOne').then(m => m.SectionOne),
  (el) => ({
    events: parse(el.dataset.events || '[]'),
    podcasts: parse(el.dataset.podcasts || '[]'),
    messageBoardPosts: parse(el.dataset.messageBoardPosts || '[]'),
    dynamicProps: parse(el.dataset.dynamicProps || '{}'),
    historicalPhotos: parse(el.dataset.historicalPhotos || '[]'),
    sponsorshipBanner: parse(el.dataset.sponsorshipBanner || '{}'),
    articles: parse(el.dataset.articles || '[]'),
  })
);

// Sponsorship
mount(
  'sponsorship-banner',
  () => import(/* webpackChunkName: "sponsorship" */ './scripts/Sponsorship').then(m => m.SponsorshipBanner),
  (el) => parse(el.dataset.banner || '{}')
);

// Register Individual
mount(
  'register-individual',
  () => import(/* webpackChunkName: "register-individual" */ './scripts/RegisterIndividual').then(m => m.default || m.RegisterIndividual)
);

// Footer
mount(
  'footer',
  () => import(/* webpackChunkName: "footer" */ './scripts/Footer').then(m => m.Footer)
);

// Login
mount(
  'login-form',
  () => import(/* webpackChunkName: "login" */ './scripts/LoginForm').then(m => m.LoginForm)
);

// T&C
mount(
  'terms-and-conditions',
  () => import(/* webpackChunkName: "terms" */ './scripts/TermsAndConditions').then(m => m.TermsAndConditions)
);

// Contact
mount(
  'contact-us',
  () => import(/* webpackChunkName: "contact" */ './scripts/ContactUs').then(m => m.ContactForm)
);

// 404
mount(
  '404',
  () => import(/* webpackChunkName: "page-404" */ './scripts/Page404').then(m => m.Page404)
);

// Register Organisation
mount(
  'register-organisation',
  () => import(/* webpackChunkName: "register-organisation" */ './scripts/RegisterOrganisation').then(m => m.default || m.RegisterOrganisation)
);

// Podcast page
mount(
  'podcast-root',
  () => import(/* webpackChunkName: "podcast-page" */ './scripts/PodcastPage').then(m => m.default),
  (el) => ({
    title: el.dataset.title, date: el.dataset.date, subtitle: el.dataset.subtitle,
    videoUrl: el.dataset.videoUrl, content: parse(el.dataset.content || '[]'),
    tags: parse(el.dataset.tags || '[]'), moreInterviews: parse(el.dataset.moreInterviews || '[]'),
    author: parse(el.dataset.authorObj || '{}'), taxonomies: parse(el.dataset.taxonomies || '{}'),
    relatedContent: parse(el.dataset.relatedContent || '[]'), breadcrumbs: parse(el.dataset.breadcrumbs || '[]'),
    interviewees: parse(el.dataset.interviewees || '[]'),
  })
);

// Search
mount(
  'search-root',
  () => import(/* webpackChunkName: "search" */ './scripts/SearchPage').then(m => m.SearchPage),
  (el) => ({ query: el.getAttribute('data-query') || '', results: parse(el.getAttribute('data-results') || '[]') })
);

// Community hub
mount(
  'community-hub-root',
  () => import(/* webpackChunkName: "community-hub" */ './scripts/CommunityHubPage').then(m => m.CommunityHubPage),
  () => (window.__COMMUNITY_HUB_PROPS__ || {})
);

// Account dashboard
mount(
  'account-dashboard-root',
  () => import(/* webpackChunkName: "account-dashboard" */ './scripts/AccountDashboard').then(m => m.AccountDashboard),
  (el) => ({ user: parse(el.dataset.user || '{}'), events: parse(el.dataset.events || '[]') })
);

// Newsletter banner
mount(
  'newsletter-banner',
  () => import(/* webpackChunkName: "newsletter-banner" */ './scripts/NewsletterBanner').then(m => m.NewsletterBanner)
);

// Account profile edit
mount(
  'account-settings-root',
  () => import(/* webpackChunkName: "account-profile" */ './scripts/AccountProfilePage').then(m => m.AccountEditProfilePage),
  (el) => ({
    links: parse(el.dataset.links || '{}'),
    user: parse(el.dataset.user || '{}'),
    profile: parse(el.dataset.profile || '{}'),
  })
);

// Account change password
mount(
  'account-change-password-root',
  () => import(/* webpackChunkName: "account-profile" */ './scripts/AccountProfilePage').then(m => m.AccountChangePasswordPage),
  (el) => ({
    links: parse(el.dataset.links || '{}'),
    user: parse(el.dataset.user || '{}'),
    profile: parse(el.dataset.profile || '{}'),
  })
);

// About / Our Mission
mount(
  'OurMissionPage',
  () => import(/* webpackChunkName: "about-us" */ './scripts/AboutUs').then(m => m.AboutUs),
  (el) => parse(el.getAttribute('data-props') || '{}')
);

// Article
mount(
  'article-root',
  () => import(/* webpackChunkName: "article-page" */ './scripts/ArticlePage').then(m => m.ArticlePage),
  (el) => ({
    title: el.dataset.title, date: el.dataset.date, subtitle: el.dataset.subtitle, imageUrl: el.dataset.imageUrl,
    content: parse(el.dataset.content || '[]'), moreArticles: parse(el.dataset.moreArticles || '[]'),
    relatedContent: parse(el.dataset.relatedContent || '[]'), tags: parse(el.dataset.tags || '[]'),
    author: parse(el.dataset.authorObj || '{}'), moreByAuthor: parse(el.dataset.moreByAuthor || '[]'),
    breadcrumbs: parse(el.dataset.breadcrumbs || '[]'),
  })
);

// Event page
mount(
  'tsb-event-root',
  () => import(/* webpackChunkName: "event-page" */ './scripts/EventPage').then(m => m.EventPage || m.default),
  (el) => parse(el.dataset.props || '{}')
);

// Events hub
mount(
  'events-hub-root',
  () => import(/* webpackChunkName: "events-hub" */ './scripts/EventsHubPage').then(m => m.EventsHubPage),
  (el) => parse(el.dataset.props || '{}')
);

// Stories & Interviews hub
mount(
  'stories-and-interviews-root',
  () => import(/* webpackChunkName: "stories-interviews" */ './scripts/StoriesAndInterviews').then(m => m.StoriesAndInterviews),
  (el) => parse(el.dataset.props || '{}')
);

// FullCalendar page
mount(
  'events-fullcalendar',
  () => import(/* webpackChunkName: "events-calendar" */ './scripts/EventsCalendar').then(m => m.EventsCalendar),
  (el) => ({
    types: parse(el.dataset.types || '[]'),
    topics: parse(el.dataset.topics || '[]'),
    audiences: parse(el.dataset.audiences || '[]'),
    locations: parse(el.dataset.locations || '[]'),
  })
);

// Hubs
mount(
  'learning-and-growth-hub-root',
  () => import(/* webpackChunkName: "learning-hub" */ './scripts/LearningAndGrowthHub').then(m => m.LearningAndGrowthHub),
  (el) => parse(el.dataset.props || '{}')
);
mount(
  'culture-and-identity-hub-root',
  () => import(/* webpackChunkName: "culture-hub" */ './scripts/CultureAndIdentityHub').then(m => m.CultureAndIdentityHub),
  (el) => parse(el.dataset.props || '{}')
);
mount(
  'support-and-services-hub-root',
  () => import(/* webpackChunkName: "support-hub" */ './scripts/SupportAndServicesHub').then(m => m.SupportAndServicesHub),
  (el) => parse(el.dataset.props || '{}')
);
mount(
  'directory-hub-root',
  () => import(/* webpackChunkName: "directory-hub" */ './scripts/DirectoryHub').then(m => m.DirectoryHub),
  (el) => parse(el.dataset.props || '{}')
);

// Cost of Living hub
mount(
  'cost-of-living-root',
  () => import(/* webpackChunkName: "col-hub" */ './scripts/CostOfLiving').then(m => m.CostOfLiving),
  (el) => parse(el.getAttribute('data-props') || '{}')
);

// Generic archive (+ taxonomy-scoped)
mount(
  'generic-archive-root',
  () => import(/* webpackChunkName: "generic-archive" */ './scripts/GenericArchivePage').then(m => m.GenericArchivePage),
  (el) => parse(el.getAttribute('data-props') || '{}')
);
mount(
  'taxonomy-root',
  () => import(/* webpackChunkName: "generic-archive" */ './scripts/GenericArchivePage').then(m => m.GenericArchivePage),
  (el) => parse(el.getAttribute('data-props') || '{}')
);

// Message board archive + single
mount(
  'messageboard-archive-root',
  () => import(/* webpackChunkName: "mb-archive" */ './scripts/MessageBoardArchivePage').then(m => m.default),
  (el) => parse(el.getAttribute('data-props') || '{}')
);
mount(
  'gd-discount-root',
  () => import(/* webpackChunkName: "mb-page" */ './scripts/MessageBoard').then(m => m.default),
  (el) => {
    const ds = el.dataset;
    return {
      title: ds.title, date: ds.date, author: parse(ds.authorObj || '{}'),
      categories: parse(ds.categories || '[]'), featuredImage: ds.featuredImage || '',
      contentHtml: ds.contentHtml || '', relatedContent: parse(ds.relatedContent || '[]'),
      recentPosts: parse(ds.recentPosts || '[]'), trendingTopics: parse(ds.trendingTopics || '[]'),
      breadcrumbs: parse(ds.breadcrumbs || '[]'),
      tags: parse(ds.tags || '[]'),
      phone: ds.phone || null,
    };
  }
);

// Cost of living page
mount(
  'gd-col-root',
  () => import(/* webpackChunkName: "col-page" */ './scripts/CostOfLivingPage').then(m => m.default),
  (el) => ({
    title: el.dataset.title, date: el.dataset.date, featuredImage: el.dataset.featuredImage || null,
    author: parse(el.dataset.authorObj || '{}'), categories: parse(el.dataset.categories || '[]'),
    contentHtml: el.dataset.contentHtml || '', relatedContent: parse(el.dataset.relatedContent || '[]'),
    recentPosts: parse(el.dataset.recentPosts || '[]'), pdfFile: el.dataset.pdfFile || null,
  })
);

// Add listing
mount(
  'add-listing-root',
  () => import(/* webpackChunkName: "add-listing" */ './scripts/AddListing').then(m => m.AddListing || m.default),
  (el) => parse(el.getAttribute('data-props') || '{}')
);

// Aid listing + hub
mount(
  'aid-listing-root',
  () => import(/* webpackChunkName: "aid-listing" */ './scripts/AidListingPage').then(m => m.default),
  (el) => ({ props: parse(el.getAttribute('data-props') || '{}') })
);
mount(
  'aid-listing-hub-root',
  () => import(/* webpackChunkName: "aid-listing-hub" */ './scripts/AidListingHub').then(m => m.AidListingHub),
  (el) => parse(el.getAttribute('data-props') || '{}')
);

// Topic directory
mount(
  'topic-directory-root',
  () => import(/* webpackChunkName: "topic-directory" */ './scripts/TopicDirectory').then(m => m.default),
  (el) => parse(el.getAttribute('data-props') || '{}')
);

// Health listing hub
mount(
  'health-listing-hub-root',
  () => import(/* webpackChunkName: "health-hub" */ './scripts/HealthListingHub').then(m => m.HealthListingHub),
  (el) => parse(el.getAttribute('data-props') || '{}')
);

// Account listings
mount(
  'account-listings-root',
  () => import(/* webpackChunkName: "account-listings" */ './scripts/AccountListings').then(m => m.AccountListings)
);

// Submit Article
mount(
  'submit-article-root',
  () => import(/* webpackChunkName: "submit-article" */ './scripts/SubmitArticlePage').then(m => m.default),
  (el) => parse(el.dataset.props || '{}')
);

// FAQs
mount(
  'faqs-root',
  () => import(/* webpackChunkName: "faqs" */ './scripts/FAQ').then(m => m.Faq),
  (el) => ({ props: parse(el.getAttribute('data-props') || '{}') })
);

// Forgot Password
mount(
  'forgot-password-root',
  () => import(/* webpackChunkName: "forgot-password" */ './scripts/ForgotPassword').then(m => m.default),
  (el) => parse(el.dataset.props || '{}')
);

mount(
  'reset-password-root',
  () => import(/* webpackChunkName: "reset-password" */ './scripts/ResetPassword').then(m => m.default),
  (el) => parse(el.dataset.props || '{}')
);