import React from 'react';
import clsx from 'clsx';

import Logo from '../../assets/logo.svg';
import IndigenousFlagIcon from '../../assets/icons/indigenous-flag.svg';
import TorresStraitFlagIcon from '../../assets/icons/torres-strait-flag.svg';
import { Socials } from './Socials';

export function Footer({ className = '' }) {
  return (
    <footer
      className={clsx(
        'bg-schemesInverseSurface text-schemesInverseOnSurface',
        'px-6 py-12 md:py-16',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid gap-4 lg:gap-12 md:grid-cols-[minmax(0,3fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col items-start gap-6 max-w-lg">
            <img src={Logo} alt="The Social Blueprint" className="h-20 w-auto" />

            <Socials />

            <p className="Blueprint-label-large text-schemesInverseOnSurface italic">
              Listings on The Social Blueprint are community-submitted. We do not
              endorse the views or work of those listed, and take no
              responsibility for any interactions between users and listed
              individuals or organisations.
            </p>
          </div>
          {[
            {
              heading: 'Explore',
              links: [{ title: 'What’s on', href: '/events' },
              { title: 'Blueprint Stories', href: '/stories-and-interview' },
              { title: 'By Topic', href: '/topics' },
              { title: 'By Audience', href: '/audience_tag' },
              ],
            },
            {
              heading: 'Engage',
              links: [{ title: 'Message Board', href: '/message-boards' },
              { title: 'Cost of Living', href: '/cost-of-living' },
              { title: 'Directory', href: '/directory' },
              { title: 'Post a notice', href: '/post-a-notice' }],
            },
            {
              heading: 'About',
              links: [{ title: 'Our mission', href: '/about-us' },
              { title: 'Contact us', href: '/contact-us' },
              { title: 'FAQs', href: '/faqs' },
              { title: 'Terms of Use', href: '/terms-of-use' }],
            },
          ].map(({ heading, links }) => (
            <nav key={heading} className="flex flex-col gap-0 lg:gap-4">
              <h3 className="Blueprint-label-large text-schemesInverseOnSurface">{heading}</h3>
              <ul className="hidden lg:flex flex-col gap-2">
                {links.map((txt) => (
                  <li key={txt.title}>
                    <a
                      href={txt.href}
                      className="Blueprint-body-medium hover:underline focus-visible:underline"
                    >
                      {txt.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col items-start lg:flex-row lg:items-center gap-4">
            <div className="flex gap-2">
              <img
                src={IndigenousFlagIcon}
                alt="Australian Aboriginal Flag"
                className="w-14 h-auto shrink-0"
              />
              <img
                src={TorresStraitFlagIcon}
                alt="Torres Strait Islander Flag"
                className="w-14 h-auto shrink-0"
              />
            </div>
            <p className="Blueprint-body-small">
              We'd like to acknowledge the Traditional Custodians of the land we
              live and work on. We're grateful for their care of Country and pay
              our respects to Elders past and present. We recognise and honour
              their ongoing connection to land, water, and community.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6">
          <p className="Blueprint-body-small">
            The Social Blueprint Inc. ABN 71 688 744 769. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
