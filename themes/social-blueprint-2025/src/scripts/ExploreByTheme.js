import { Card } from "./Card"
import { ArrowUpRightIcon } from "@phosphor-icons/react"
import ExploreThemeOne from "../../assets/explore-theme-1.svg"
import ExploreThemeTwo from "../../assets/explore-theme-2.svg"
import ExploreThemeThree from "../../assets/explore-theme-3.svg"
import ExploreThemeFour from "../../assets/explore-theme-4.svg"
import ExploreThemeFive from "../../assets/explore-theme-5.svg"

export const ExploreByTheme = () => {
  const keys = [
    {
      key: "community-connection",
      title: "Community Connection",
      icon: ExploreThemeOne,
    },
    {
      key: "events-and-experiences",
      title: "Events and Experiences",
      icon: ExploreThemeTwo,
    },
    {
      key: "learning-and-growth",
      title: "Learning and Growth",
      icon: ExploreThemeThree,
    },
    {
      key: "support-and-services",
      title: "Support and Services",
      icon: ExploreThemeFour,
    },
    {
      key: "culture-and-identity",
      title: "Culture and Identity",
      icon: ExploreThemeFive,
    },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 w-full justify-items-stretch">
      {keys.map((item, index) => (
        <Card
          key={index}
          href={`/${item.key}`}
          styles="group min-h-[9rem] md:min-h-[16rem] h-full max-w-full md:max-w-[320px] w-full border-1 border-background-light pt-4 rounded-xl shadow-3x3"
        >
          <div className="flex flex-row-reverse md:flex-col justify-between h-full w-full">
            <div className="flex flex-col items-end h-full lg:h-auto gap-5">
              <div className="bg-schemesPrimaryFixed mx-4 mb-auto md:mb-0 rounded-xl p-1.5">
                <ArrowUpRightIcon size={26} weight="bold" />
              </div>
              <div className="w-full text-right Blueprint-body-large-emphasized text-schemesOnSurface leading-snug break-words overflow-hidden px-4 transition-transform duration-600 ease-in-out group-hover:-translate-y-2 mb-12 md:mb-2">
                {item.title}
              </div>
            </div>
            <div className="flex md:justify-center justify-start">
              <img
                src={item.icon}
                alt={`${item.title} Icon`}
                className="object-contain mt-auto max-h-[8rem] w-full px-0 lg:px-4"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
