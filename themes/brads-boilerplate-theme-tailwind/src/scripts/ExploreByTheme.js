import { Card } from "./Card"
import { ArrowUpRightIcon } from "@phosphor-icons/react"
import ExploreThemeOne from "../../assets/explore-theme-1.svg"
import ExploreThemeTwo from "../../assets/explore-theme-2.svg"
import ExploreThemeThree from "../../assets/explore-theme-3.svg"
import ExploreThemeFour from "../../assets/explore-theme-4.svg"
import ExploreThemeFive from "../../assets/explore-theme-5.svg"

export const ExploreByTheme = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full justify-items-center sm:justify-items-stretch">
      {[0, 1, 2, 3, 4].map((i) => (
        <Card
          key={i}
          href={i === 0 ? "/community-connect" : `/explore/${i + 1}`}
          styles="group min-h-[16rem] h-full max-w-[260px] w-full border-1 border-background-light pt-4"
        >
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex flex-col items-end gap-3">
              <div className="bg-schemesPrimaryFixed mx-4 rounded-xl p-1.5">
                <ArrowUpRightIcon size={20} weight="bold" />
              </div>
              <div className="w-full text-right Blueprint-headline-small text-schemesOnSurface leading-snug break-words overflow-hidden px-4 mb-2  transition-transform duration-600 ease-in-out group-hover:-translate-y-2">
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
              className="object-contain mt-auto max-h-[8rem] w-full px-4"
            />
          </div>
        </Card>
      ))}
    </div>
  )
}
