import { Card } from "./Card"
import { ArrowUpRightIcon } from "@phosphor-icons/react"
import ExploreThemeOne from "../../assets/explore-theme-1.svg"
import ExploreThemeTwo from "../../assets/explore-theme-2.svg"
import ExploreThemeThree from "../../assets/explore-theme-3.svg"
import ExploreThemeFour from "../../assets/explore-theme-4.svg"
import ExploreThemeFive from "../../assets/explore-theme-5.svg"

export const ExploreByTheme = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 w-full justify-items-stretch">
      {[0, 1, 2, 3, 4].map((i) => (
        <Card
          key={i}
          href={i === 0 ? "/community-connect" : `/explore/${i + 1}`}
          styles="group min-h-[12rem] md:min-h-[16rem] h-full lg:max-w-[260px] w-full border-1 border-background-light pt-4 rounded-xl"
        >
          <div className="flex flex-row-reverse md:flex-col justify-between h-full w-full">
            <div className="flex flex-col items-end h-full lg:h-auto gap-5">
              <div className="bg-schemesPrimaryFixed mx-4 mb-auto md:mb-0 rounded-xl p-1.5">
                <ArrowUpRightIcon size={26} weight="bold" />
              </div>
              <div className="w-full text-right Blueprint-title-large-emphasized text-schemesOnSurface leading-snug break-words overflow-hidden px-4 transition-transform duration-600 ease-in-out group-hover:-translate-y-2 mb-12 md:mb-2">
                {i === 0 && <>Community Connection</>}
                {i === 1 && (
                  <>
                    Events and
                    <br />
                    Experiences
                  </>
                )}
                {i === 2 && <>Learning and Growth</>}
                {i === 3 && <>Support and Services</>}
                {i === 4 && (
                  <>
                    Culture and
                    <br />
                    Identity
                  </>
                )}
              </div>
            </div>
            <div className="flex md:justify-center justify-start">
              <img
                src={
                  i === 0
                    ? ExploreThemeOne
                    : i === 1
                      ? ExploreThemeTwo
                      : i === 2
                        ? ExploreThemeThree
                        : i === 3
                          ? ExploreThemeFour
                          : ExploreThemeFive
                }
                alt="Theme Icon"
                className="object-contain mt-auto max-h-[8rem] w-full px-0 lg:px-4"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
