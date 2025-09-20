import React, { useState } from "react";
import { Card } from "./Card";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import ContactUs from "../../assets/contact-us.svg";

export const Faq = ({ props }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (index) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedItems(newExpandedItems);
  };

  return (
    <div className="bg-schemesSurface">
      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[800px] mx-auto lg:pt-16 md:pt-8 pt-4 pb-4">
          <div className="flex justify-center gap-2">
            <div>
              <h1 className="Blueprint-display-small-emphasized md:Blueprint-display-medium-emphasized lg:Blueprint-display-large-emphasized text-schemesOnPrimaryFixed py-3">
                FAQs
              </h1>
              <p className="Blueprint-body-medium md:Blueprint-body-large text-schemesOnSurfaceVariant mt-2 max-w-sm">
                A handy guide to using the platform and making the most of what's here.
              </p>
            </div>
            <img src={ContactUs} alt="Contact us" className="-translate-y-4 hidden md:block" />
          </div>
        </div>
      </div>
      <div className="max-w-[500px] lg:max-w-[800px] mx-auto lg:p-16 md:p-8 p-4">
        <div className="flex flex-col gap-4">
          {props.faqs && props.faqs.map((faq, index) => {
            const isExpanded = expandedItems.has(index);
            return (
              <Card
                key={index}
                styles="shadow-3x2 w-full group transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-full">
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <div className="lg:Blueprint-title-large-emphasized md:Blueprint-title-medium-emphasized Blueprint-title-small-emphasized text-schemesOnSurfaceVariant pr-4 transition-colors duration-200">
                      {faq.title}
                    </div>
                    <div className="bg-schemesPrimaryFixed p-1 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 text-schemesOnSurface transition-all duration-300 ease-in-out">
                        {isExpanded ? (
                          <MinusIcon className="w-full h-full transform transition-transform duration-300 ease-in-out hover:scale-110" />
                        ) : (
                          <PlusIcon className="w-full h-full transform transition-transform duration-300 ease-in-out hover:scale-110" />
                        )}
                      </div>
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="border-t border-gray-200 pt-4">
                        <div className="lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small text-schemesOnSurfaceVariant leading-relaxed">
                          {faq.body}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};