import React, { useMemo, useState } from "react"
import { CaretLeftIcon, CaretRightIcon, PlanetIcon, PlayIcon, StarOfDavidIcon, TagChevronIcon } from "@phosphor-icons/react"
import { Card } from "./Card"
import { TestimonialSlider } from "./TestimonialSlider"
import { ICONS } from "./IconPicker"
import Megaphone from "../../assets/megaphone.svg"

export function AboutUs(props) {
  const { timeline = [], testimonials = [], featuredVideo = {} } = props
  const [ti, setTi] = useState(0)
  const t = testimonials
  const next = () => setTi((i) => (i + 1) % Math.max(t.length || 1, 1))
  const prev = () => setTi((i) => (i - 1 + Math.max(t.length || 1, 1)) % Math.max(t.length || 1, 1))
  console.log(featuredVideo)

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
    <section className="w-full space-y-16">
      <div className="w-full bg-palettesPrimary95">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 md:py-14 text-center flex gap-6 flex-col justify-center items-center">
          <div className="bg-schemesPrimaryFixedDim rounded-xl py-2.5 px-3">
            <div className="Blueprint-display-small-emphasized italic text-schemesOnSurface">Our Mission</div>
          </div>
          <div className="flex flex-col items-center max-w-4xl">
            <p className="Blueprint-title-large text-schemesOnSurfaceVariant">
              We bring clarity, connection, and opportunity to the Melbourne Jewish community.
            </p>
            <p className="Blueprint-title-large text-schemesOnSurfaceVariant">
              We're an independent, apolitical platform hosting events, support, organisations, and stories
              so everyone can engage in community life in a way that matters to them
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <Card>
            <div className="flex flex-col gap-4 items-start justify-between p-6">
              <div className="p-1.5 rounded-lg bg-schemesPrimaryFixed">
                <StarOfDavidIcon size={18} className="text-schemesOnSurface" weight="bold" />
              </div>
              <p className="Blueprint-title-medium text-schemesOnPrimaryFixed">
                Showcasing and supporting our vibrant Melbourne Jewish community
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-4 items-start justify-between p-6">
              <div className="p-1.5 rounded-lg bg-schemesPrimaryFixed">
                <StarOfDavidIcon size={18} className="text-schemesOnSurface" weight="bold" />
              </div>
              <p className="Blueprint-title-medium text-schemesOnPrimaryFixed">
                Collaborating with <b>250+</b> organisations and community leaders
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-4 items-start justify-between p-6">
              <div className="p-1.5 rounded-lg bg-schemesPrimaryFixed">
                <StarOfDavidIcon size={18} className="text-schemesOnSurface" weight="bold" />
              </div>
              <p className="Blueprint-title-medium text-schemesOnPrimaryFixed">
                Hosting the <b>largest</b> Jewish events calendar in Melbourne
              </p>
            </div>
          </Card>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto p-8 lg:p-16">
        <TimelineSection timeline={timeline} intro="Our journey so far" />
      </div>
      <div className="max-w-[1600px] mx-auto p-8 lg:p-16 rounded-xl bg-schemesSecondaryFixed">
        <div className="Blueprint-headline-large text-schemesOnSecondaryContainer mb-12 text-center">Testimonials</div>
        <TestimonialSlider testimonials={t} displaySlider={t.length > 2} />
      </div>
      <div className="max-w-[1600px] p-8 lg:p16 mx-auto">
        <div className="Blueprint-headline-large text-center text-schemesOnSurface mb-6">{featuredVideo.title}</div>
        <div className="Blueprint-body-large text-center text-schemesOnSurfaceVariant mb-20 mx-auto max-w-xl">
          {featuredVideo.description}
        </div>
        <div className="rounded-xl overflow-hidden bg-palettesNeutral10/20 max-w-[1400px] mx-auto">
          <div className="aspect-video w-full">{videoNode || <div className="w-full h-full flex items-center justify-center"><PlayIcon size={36} /></div>}</div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto p-8 lg:p-16">
        <ProudlySponsored />
      </div>
    </section>
  )
}

export const TimelineSection = ({ timeline = [], intro = "" }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-16 self-stretch">
      <div className="flex flex-col gap-4">
        <h2 className="Blueprint-headline-large text-schemesOnSurface">
          {intro}
        </h2>
        <p className="Blueprint-body-large text-schemesOnSurfaceVariant max-w-sm">
          A look at the key moments, launches, and collaborations that have shaped The Social Blueprint.
        </p>
      </div>
      <ol class="relative border-s-2 border-schemesOutlineVariant">
        {timeline.map((time, index) => {
          console.log(time.icon)
          const icon = ICONS[time.icon] || PlanetIcon
          return (
            <li class="mb-10 ms-6" key={index}>
              <span class="absolute flex items-center justify-center bg-schemesPrimaryFixed p-1.5 rounded-lg -start-4.5">
                {React.createElement(icon, { size: 20, fill: "bold", className: "text-schemesOnPrimaryFixed" })}
              </span>
              <time class="block mb-2 Blueprint-body-large-emphasized uppercase text-schemesOnSurface">{time.date}</time>
              <p class="mb-1 Blueprint-body-large-emphasized text-schemesOnSurface">{time.title}</p>
              <p class="mb-4 Blueprint-body-large text-schemesOnSurface">{time.description}</p>
            </li>
          )
        })}
      </ol>
    </div>
  );
};

const ProudlySponsored = () => {
  return (
    <div className="flex flex-col md:flex-row items-end justify-between bg-schemesPrimaryFixedDim rounded-3xl px-6 pt-8 md:pt-12 md:px-16 gap-8 shadow-3x3">
      <div className="flex-1 pb-8 md:pb-12">
        <h2 className="Blueprint-headline-medium-emphasized mb-4">
          The Social Blueprint is proudly sponsored by the Lowe Family<br />
          and the Jack and Robert Smorgon Families Foundation.
        </h2>
        <div
          className="Blueprint-label-large inline-flex items-center"
        >
          This site is dedicated to the memory of Saul Gold and Jeffrey Lowe.
        </div>
      </div>
      <div className="mb-[-2]">
        <img
          src={Megaphone}
          alt="Megaphone Icon"
          className=""
        />
      </div>
    </div>
  );
};