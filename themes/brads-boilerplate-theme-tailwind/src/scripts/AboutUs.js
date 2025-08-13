import React, { useMemo, useState } from "react"
import { CaretLeftIcon, CaretRightIcon, PlanetIcon, PlayIcon, StarOfDavidIcon, TagChevronIcon } from "@phosphor-icons/react"
import { Card } from "./Card"
import { TestimonialSlider } from "./TestimonialSlider"
import { ICONS } from "./IconPicker"
import Megaphone from "../../assets/megaphone.svg"
import { useBreakpoints } from "./useBreakpoints"

export function AboutUs(props) {
  const { timeline = [], testimonials = [], featuredVideo = {} } = props
  const t = testimonials
  const breakpoints = useBreakpoints()

  const videoNode = useMemo(() => {
    if (!featuredVideo?.url) return null
    const u = featuredVideo.url.toLowerCase()
    if (u.includes("youtube.com") || u.includes("youtu.be") || u.includes("vimeo.com")) {
      return (
        <iframe
          src={featuredVideo.url.replace("watch?v=", "embed/")}
          title="Feature video"
          className="w-full h-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )
    }
  }, [featuredVideo])

  return (
    <section className="w-full space-y-8 lg:space-y-16">
      <div className="w-full bg-palettesPrimary95">
        <div className="max-w-[1600px] mx-auto p-6 md:p-16 flex gap-6 flex-col justify-start items-start md:justify-center md:items-center">
          <div className="bg-schemesPrimaryFixedDim rounded-xl py-1 px-3">
            <span className={`Blueprint-headline-small-emphasized md:Blueprint-headline-medium-emphasized lg:Blueprint-headline-large-emphasized text-schemesOnSurface`}>
              Our Mission
            </span>
          </div>
          <div className="flex flex-col md:items-center text-left md:text-center max-w-4xl">
            <p className={`Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant`}>
              We bring clarity, connection, and opportunity to the Melbourne Jewish community. We're an independent, apolitical platform hosting events, support, organisations, and stories so everyone can engage in community life in a way that matters to them
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row gap-4 Blueprint-body-small-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized text-schemesOnPrimaryFixed">
          <Card>
            <div className="flex flex-col gap-6 items-start justify-between p-4">
              <div className="p-1.5 rounded-lg bg-schemesPrimaryFixed">
                <StarOfDavidIcon size={18} className="text-schemesOnSurface" weight="bold" />
              </div>
              <p>
                Showcasing and supporting our vibrant Melbourne Jewish community
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-6 items-start justify-between p-4">
              <div className="p-1.5 rounded-lg bg-schemesPrimaryFixed">
                <StarOfDavidIcon size={18} className="text-schemesOnSurface" weight="bold" />
              </div>
              <p>
                Collaborating with 250+ organisations and community leaders
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-6 items-start justify-between p-4">
              <div className="p-1.5 rounded-lg bg-schemesPrimaryFixed">
                <StarOfDavidIcon size={18} className="text-schemesOnSurface" weight="bold" />
              </div>
              <p>
                Hosting the largest Jewish events calendar in Melbourne
              </p>
            </div>
          </Card>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto p-6 md:p-16">
        <TimelineSection timeline={timeline} intro="Our journey so far" />
      </div>
      <div className="p-0 md:p-8 lg:p-16">
        <div className="p-4 md:p-6 lg:p-16 rounded-none md:rounded-xl bg-schemesSecondaryFixed shadow-3x2">
          <div className="max-w-[1600px] Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized p-3 lg:Blueprint-title-large-emphasized text-schemesOnSecondaryContainer mb-6 md:mb-8 lg:mb-12 text-center">Testimonials</div>
          <TestimonialSlider testimonials={t} displaySlider={t.length > 2} />
        </div>
      </div>
      <div className="max-w-[1600px] p-6 md:p-16 mx-auto">
        <div className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-center text-schemesOnSurface mb-4 md:mb-6">{featuredVideo.title}</div>
        <div className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-center text-schemesOnSurfaceVariant mb-8 lg:mb-20 mx-auto lg:max-w-2xl">
          {featuredVideo.description}
        </div>
        <div className="rounded-xl overflow-hidden bg-palettesNeutral10/20 max-w-[1600px] mx-auto">
          <div className="aspect-video w-full">{videoNode || <div className="w-full h-full flex items-center justify-center"><PlayIcon size={36} /></div>}</div>
        </div>
      </div>
      <div className="p-0 md:p-16">
        <ProudlySponsored />
      </div>
    </section >
  )
}

const TimelineSection = ({ timeline = [], intro = "" }) => {
  const { lg } = useBreakpoints();
  return (
    <div className="flex flex-col md:flex-col lg:flex-row gap-8 lg:gap-16 self-stretch">
      <div className="flex flex-col gap-6">
        <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface">{intro}</h2>
        <p className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant lg:max-w-sm">
          A look at the key moments, launches, and collaborations that have shaped The Social Blueprint.
        </p>
      </div>

      <ol className="flex flex-col">
        {timeline.map((time, index) => {
          const Icon = ICONS[time.icon] || PlanetIcon;
          const isLast = index === timeline.length - 1;

          return (
            <li key={index} className="flex gap-4 first:pt-0 last:pb-0">
              <div className="flex flex-col items-center w-10 shrink-0">
                <div className="bg-schemesPrimaryFixed p-1.5 rounded-xl">
                  <Icon size={20} fill="bold" className="text-schemesOnPrimaryFixed" />
                </div>
                {!isLast && <span className="flex-1 w-0.5 my-2 bg-schemesOutlineVariant" />}
              </div>
              <div className="min-w-0">
                <time className="block mb-2 Blueprint-body-small-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized uppercase text-schemesOnSurface">
                  {time.date}
                </time>
                <p className="mb-2 Blueprint-body-small-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized text-schemesOnSurface">
                  {time.title}
                </p>
                <p className={`mb-6 Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurface`}>
                  {time.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};


const ProudlySponsored = () => {
  return (
    <div className="flex flex-col md:flex-row items-end justify-between bg-schemesPrimaryFixed rounded-none md:rounded-3xl px-6 pt-8 md:pt-12 md:px-16 gap-8 shadow-3x3">
      <div className="flex-1 pb-8 md:pb-12">
        <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized mb-4 max-w-2xl">
          The Social Blueprint is proudly sponsored by the Lowe Family and the Jack and Robert Smorgon Families Foundation.
        </h2>
        <div
          className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large inline-flex items-center"
        >
          This site is dedicated to the memory of Saul Gold and Jeffrey Lowe.
        </div>
      </div>
      <div className="mb-[-2] hidden md:block md:mr-[-100] lg:mr-0">
        <img
          src={Megaphone}
          alt="Megaphone Icon"
          className=""
        />
      </div>
    </div>
  );
};