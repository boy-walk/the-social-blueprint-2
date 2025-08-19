import './i18n';
import FrontPage from './scripts/FrontPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './scripts/Header';
import { SectionOne } from './scripts/SectionOne';
import { SponsorshipBanner } from './scripts/Sponsorship';
import { SingleEventPage } from './scripts/SingleEvent';
import { RegisterIndividual } from './scripts/RegisterIndividual';
import { Footer } from './scripts/Footer';
import { LoginForm } from './scripts/LoginForm'
import { TermsAndConditions } from './scripts/TermsAndConditions';
import { ContactForm } from './scripts/ContactUs';
import { Page404 } from './scripts/Page404';
import { RegisterOrganisation } from './scripts/RegisterOrganisation';
import PodcastPage from './scripts/PodcastPage';
import { SearchPage } from './scripts/SearchPage';
import { CommunityHubPage } from './scripts/CommunityHubPage';
import { AccountDashboard } from './scripts/AccountDashboard';
import { NewsletterBanner } from './scripts/NewsletterBanner';
import { AccountEditProfilePage } from './scripts/AccountProfilePage';
import { AccountChangePasswordPage } from './scripts/AccountProfilePage';
import { AboutUs } from './scripts/AboutUs';
import { ArticlePage } from './scripts/ArticlePage';
import { EventPage } from './scripts/EventPage';
import { EventsHubPage } from './scripts/EventsHubPage';


if (document.querySelector('#front-page')) {
  const root = ReactDOM.createRoot(document.querySelector('#front-page'));
  root.render(<FrontPage />);
}

const header = document.getElementById('header');
if (header) {
  const isUserLoggedIn = header.getAttribute('isUserLoggedIn') === 'true';
  ReactDOM.createRoot(header).render(<Header isUserLoggedIn={isUserLoggedIn} />);
}

const el1 = document.getElementById('section-one');
if (el1) {
  const events = JSON.parse(el1.dataset.events);
  const podcasts = JSON.parse(el1.dataset.podcasts || '[]');
  const messageBoardPosts = JSON.parse(el1.dataset.messageBoardPosts || '[]');
  const dynamicProps = JSON.parse(el1.dataset.dynamicProps || '{}');
  const historicalPhotos = JSON.parse(el1.dataset.historicalPhotos || '[]');
  const sponsorshipBanner = JSON.parse(el1.dataset.sponsorshipBanner || '{}');
  ReactDOM.createRoot(el1).render(
    <SectionOne
      events={events}
      podcasts={podcasts}
      messageBoardPosts={messageBoardPosts}
      dynamicProps={dynamicProps}
      historicalPhotos={historicalPhotos}
      sponsorshipBanner={sponsorshipBanner}
    />
  );
}

const el2 = document.getElementById('sponsorship-banner');
if (el2) {
  const data = JSON.parse(el2.dataset.banner);
  ReactDOM.createRoot(el2).render(<SponsorshipBanner {...data} />);
}

const el3 = document.getElementById('single-event-page');
if (el3) {
  const data = JSON.parse(el3.dataset.event);
  ReactDOM.createRoot(el3).render(<SingleEventPage {...data} />);
}

const el4 = document.getElementById('register-individual');
if (el4) {
  ReactDOM.createRoot(el4).render(<RegisterIndividual />);
}

const el5 = document.getElementById('footer');
if (el5) {
  ReactDOM.createRoot(el5).render(<Footer />);
}

const el6 = document.getElementById('login-form');
if (el6) {
  ReactDOM.createRoot(el6).render(<LoginForm />)
}

const el7 = document.getElementById('terms-and-conditions');
if (el7) {
  ReactDOM.createRoot(el7).render(<TermsAndConditions />)
}

const el8 = document.getElementById('contact-us');
if (el8) {
  ReactDOM.createRoot(el8).render(<ContactForm />)
}

const el9 = document.getElementById('404');
if (el9) {
  ReactDOM.createRoot(el9).render(<Page404 />);
}

const el10 = document.getElementById('register-organisation');
if (el10) {
  ReactDOM.createRoot(el10).render(<RegisterOrganisation />);
}

const el11 = document.getElementById('podcast-root');
if (el11) {
  const props = {
    title: el11.dataset.title,
    date: el11.dataset.date,
    subtitle: el11.dataset.subtitle,
    videoUrl: el11.dataset.videoUrl,
    sections: JSON.parse(el11.dataset.sections),
    tags: JSON.parse(el11.dataset.tags),
    moreInterviews: JSON.parse(el11.dataset.moreInterviews) || [],
    author: JSON.parse(el11.dataset.authorObj),
    taxonomies: JSON.parse(el11.dataset.taxonomies || '{}'),
    relatedContent: JSON.parse(el11.dataset.relatedContent || '[]')
  };
  ReactDOM.createRoot(el11).render(<PodcastPage {...props} />);
}

const el12 = document.getElementById('search-root');
if (el12) {
  const query = el12.getAttribute("data-query") || '';
  const results = JSON.parse(el12.getAttribute("data-results"))
  ReactDOM.createRoot(el12).render(<SearchPage query={query} results={results} />);
}

const el13 = document.getElementById('community-hub-root');
if (el13) {
  const props = window.__COMMUNITY_HUB_PROPS__ || {};
  ReactDOM.createRoot(el13).render(<CommunityHubPage {...props} />);
}

const el14 = document.getElementById('account-dashboard-root');
if (el14) {
  const userData = JSON.parse(el14.dataset.user);
  const eventsData = JSON.parse(el14.dataset.events || '[]');
  ReactDOM.createRoot(el14).render(<AccountDashboard user={userData} events={eventsData} />);
}

const el15 = document.getElementById('newsletter-banner');
if (el15) {
  ReactDOM.createRoot(el15).render(<NewsletterBanner />);
}

const el16 = document.getElementById('account-settings-root');
if (el16) {
  const props = {
    links: JSON.parse(el16.dataset.links || '{}'),
    user: JSON.parse(el16.dataset.user || '{}'),
    profile: JSON.parse(el16.dataset.profile || '{}'),
  }
  ReactDOM.createRoot(el16).render(<AccountEditProfilePage {...props} />);
}

const el17 = document.getElementById('account-change-password-root');
if (el17) {
  const props = {
    links: JSON.parse(el17.dataset.links || '{}'),
    user: JSON.parse(el17.dataset.user || '{}'),
    profile: JSON.parse(el17.dataset.profile || '{}'),
  }
  ReactDOM.createRoot(el17).render(<AccountChangePasswordPage {...props} />);
}

const el18 = document.getElementById("OurMissionPage")
if (el18) {
  const props = JSON.parse(el18.getAttribute("data-props") || "{}")
  ReactDOM.createRoot(el18).render(<AboutUs {...props} />)
}

const el19 = document.getElementById('article-root');
if (el19) {
  const props = {
    title: el19.dataset.title,
    date: el19.dataset.date,
    subtitle: el19.dataset.subtitle,
    imageUrl: el19.dataset.imageUrl,
    content: JSON.parse(el19.dataset.content || '[]'),
    moreArticles: JSON.parse(el19.dataset.moreArticles || '[]'),
    relatedContent: JSON.parse(el19.dataset.relatedContent || '[]'),
    tags: JSON.parse(el19.dataset.tags || '[]'),
    author: JSON.parse(el19.dataset.authorObj || '{}'),
    moreByAuthor: JSON.parse(el19.dataset.moreByAuthor || '[]'),
  };
  ReactDOM.createRoot(el19).render(<ArticlePage {...props} />);
}

const el20 = document.getElementById("tsb-event-root");
if (el20) {
  const props = JSON.parse(el20.dataset.props || '{}');
  ReactDOM.createRoot(el20).render(<EventPage {...props} />);
}

const el21 = document.getElementById('events-hub-root');
if (el21) {
  const props = JSON.parse(el21.dataset.props || '{}');
  ReactDOM.createRoot(el21).render(<EventsHubPage {...props} />);
}