import React from "react";
import { GearIcon, MailboxIcon, UserCircleIcon } from "@phosphor-icons/react";
import { Card } from "./Card";
import { EventsSlider } from "./EventsSlider";
import { NewsletterBanner } from "./NewsletterBanner";
import { useTranslation } from "react-i18next";

export function AccountDashboard({ user, events }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <div className="px-6 lg:px-16 py-8 bg-schemesPrimaryFixed ">
        <h1 className="Blueprint-display-small-emphasized">
          {t('welcome', { name: user?.first_name || "[FirstName]" })}
        </h1>
        <p className="mt-3 Blueprint-title-large text-schemesOnPrimaryFixedVariant">
          {t('manageCommunity')}
        </p>
        <div className="flex flex-col gap-8 mt-8">
          <div className="Blueprint-headline-medium">
            {t('quickLinks')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex flex-col gap-8 h-full justify-between items-start p-4 w-full">
                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                  <MailboxIcon size={22} />
                </div>
                <div className="Blueprint-title-medium">
                  {t('manageEvents')}
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-8 h-full justify-between items-start p-4 w-full">
                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                  <UserCircleIcon size={22} />
                </div>
                <div className="Blueprint-title-medium">
                  {t('activeListings')}
                </div>
              </div>
            </Card>
            <Card href="/account-settings">
              <div className="flex flex-col gap-8 h-full justify-between items-start p-4 w-full">
                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                  <GearIcon size={22} />
                </div>
                <div className="Blueprint-title-medium">
                  {t('accountSettings')}
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
      <div className="px-6 lg:px-16 py-8">
        <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-6">
          Your upcoming events
        </h2>
        <EventsSlider events={events} />
      </div>


      <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8">
        <NewsletterBanner />
      </div>

    </div>
  );
}