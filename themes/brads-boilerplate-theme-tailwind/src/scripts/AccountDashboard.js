import React from "react";
import { GearIcon, MailboxIcon, UserCircleIcon } from "@phosphor-icons/react";
import { Card } from "./Card";

export function AccountDashboard({ user }) {
    return (
        <div className="bg-schemesPrimaryFixed min-h-screen">
            <div className="px-6 lg:px-16 py-8">
                <h1 className="Blueprint-display-small-emphasized">Welcome {user?.first_name || "[FirstName]"}</h1>
                <p className="mt-3 Blueprint-title-large text-schemesOnPrimaryFixedVariant">Here's where you manage your corner of our community.</p>
                <div className="flex flex-col gap-8 mt-8">
                    <div className="Blueprint-headline-medium">
                        Quick links
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <div className="flex flex-col gap-8 h-full justify-between items-start p-4 w-full">
                                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                                    <MailboxIcon size={22} />
                                </div>
                                <div className="Blueprint-title-medium">
                                    Manage upcoming events
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col gap-8 h-full justify-between items-start p-4 w-full">
                                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                                    <UserCircleIcon size={22} />
                                </div>
                                <div className="Blueprint-title-medium">
                                    Active listings
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col gap-8 h-full justify-between items-start p-4 w-full">
                                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                                    <GearIcon size={22} />
                                </div>
                                <div className="Blueprint-title-medium">
                                    Account settings
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
            <div className="bg-[#FCFAF7] px-6 py-10">
                <h2 className="text-xl font-bold mb-4">Your Upcoming Events</h2>
                <p className="text-gray-600">No upcoming events.</p>
            </div>
        </div>
    );
}