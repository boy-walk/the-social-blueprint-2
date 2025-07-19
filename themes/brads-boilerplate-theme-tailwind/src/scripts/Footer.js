// components/Footer.js
import React from 'react';
import clsx from 'clsx';
import { IconButton } from './Icon';

/* ——--- static assets —---——————————— */
/* Swap these imports to wherever you keep your images / SVGs */
import Logo from '../../assets/logo.svg';
import IndigenousFlagIcon from '../../assets/icons/indigenous-flag.svg';
import TorresStraitFlagIcon from '../../assets/icons/torres-strait-flag.svg';
import { FacebookLogoIcon, InstagramLogoIcon, LinkedinLogoIcon, SpotifyLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react';

/* ——————————————————————————————————————— */
/*  Footer component                                                            */
/* ——————————————————————————————————————— */
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
                {/* ── Top section (logo, social, nav) ─────────────────────────── */}
                <div className="grid gap-4 lg:gap-12 md:grid-cols-[minmax(0,3fr)_repeat(3,minmax(0,1fr))]">
                    {/* Logo + socials + disclaimer */}
                    <div className="flex flex-col items-start gap-6 ">
                        <img src={Logo} alt="The Social Blueprint" className="h-20 w-auto" />

                        {/* Social icons */}
                        <div className="flex gap-4">
                            <IconButton
                                icon={<FacebookLogoIcon size={22} weight="bold" />}
                                style="tonal" size="sm"
                                aria-label="Follow us on Facebook"
                                onClick={() => window.open('https://www.facebook.com', '_blank')}
                            />
                            <IconButton
                                icon={<YoutubeLogoIcon size={22} weight="bold" />}
                                style="tonal" size="sm"
                                aria-label="Follow us on YouTube"
                                onClick={() => window.open('https://www.youtube.com', '_blank')}
                            />
                            <IconButton
                                icon={<InstagramLogoIcon size={22} weight="bold" />}
                                style="tonal" size="sm"
                                aria-label="Follow us on Instagram"
                                onClick={() => window.open('https://www.instagram.com', '_blank')}
                            />
                            <IconButton
                                icon={<LinkedinLogoIcon size={22} weight="bold" />}
                                style="tonal" size="sm"
                                aria-label="Follow us on LinkedIn"
                                onClick={() => window.open('https://www.linkedin.com', '_blank')}
                            />
                            <IconButton
                                icon={<SpotifyLogoIcon size={22} weight="bold" />}
                                style="tonal" size="sm"
                                aria-label="Follow us on Spotify"
                                onClick={() => window.open('https://www.spotify.com', '_blank')}
                            />
                        </div>

                        <p className="Blueprint-label-large text-schemesInverseOnSurface italic">
                            Listings on The Social Blueprint are community-submitted. We do not
                            endorse the views or work of those listed, and take no
                            responsibility for any interactions between users and listed
                            individuals or organisations.
                        </p>
                    </div>

                    {/* Nav column helper */}
                    {[
                        {
                            heading: 'Explore',
                            links: ['What’s on', 'Directory', 'Stories', 'Get involved'],
                        },
                        {
                            heading: 'About',
                            links: ['About us', 'Our Mission', 'Contact us', 'FAQs'],
                        },
                        {
                            heading: 'Community',
                            links: ['Post a notice', 'Join a group', 'Message board'],
                        },
                    ].map(({ heading, links }) => (
                        <nav key={heading} className="flex flex-col gap-0 lg:gap-4">
                            <h3 className="Blueprint-label-large text-schemesInverseOnSurface">{heading}</h3>
                            <ul className="hidden lg:flex flex-col gap-2">
                                {links.map((txt) => (
                                    <li key={txt}>
                                        <a
                                            href="#"
                                            className="Blueprint-body-medium hover:underline focus-visible:underline"
                                        >
                                            {txt}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                {/* ── Legal row & acknowledgment – flex/stack responsive ───────── */}
                <div className="flex flex-col gap-8 md:gap-12">

                    {/* ABN + policies */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <p className="Blueprint-body-small">
                            The Social Blueprint Inc. ABN 71 688 744 769. All Rights Reserved.
                        </p>

                        <ul className="flex gap-6">
                            <li>
                                <a href="#" className="Blueprint-body-small hover:underline focus-visible:underline">
                                    Privacy policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="Blueprint-body-small hover:underline focus-visible:underline">
                                    Terms of use
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* First Nations acknowledgement */}
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
                            We’d like to acknowledge the Traditional Custodians of the land we
                            live and work on. We’re grateful for their care of Country and pay
                            our respects to Elders past and present. We recognise and honour
                            their ongoing connection to land, water, and community.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
