import { Card } from "./Card"
import { ArrowUpRightIcon } from "@phosphor-icons/react"
import ExploreThemeOne from "../../assets/explore-theme-1.svg"
import ExploreThemeTwo from "../../assets/explore-theme-2.svg"

export const ExploreByTheme = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {[0, 1, 2, 3, 4].map((i) => (
        <Card
          key={i}
          href={i === 0 ? "/community-connect" : `/explore/${i + 1}`}
          styles="min-h-[16rem] h-full max-w-full border-1 border-background-light pt-4"
        >
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex flex-col items-end gap-3">
              <div className="bg-schemesPrimaryFixed mx-4 rounded-xl p-1.5">
                <ArrowUpRightIcon size={20} weight="bold" />
              </div>
              <div className="w-full text-right Blueprint-headline-small-emphasized text-schemesOnSurface leading-snug break-words overflow-hidden px-4 mb-2">
                {i === 0 && (
                  <>
                    Community Connection
                  </>
                )}
                {i === 1 && (
                  <>
                    Events and
                    <br />
                    Experiences
                  </>
                )}
                {i === 2 && (
                  <>
                    Learning and Growth
                  </>
                )}
                {i === 3 && (
                  <>
                    Support and Services
                  </>
                )}
                {i === 4 && (
                  <>
                    Culture and
                    <br />
                    Identity
                  </>
                )}
              </div>
            </div>

            {/* Stick to bottom */}
            <img
              src={i === 1 ? ExploreThemeTwo : ExploreThemeOne}
              alt="Theme Icon"
              className="object-contain mt-auto mr-auto"
            />
          </div>
        </Card>
      ))}
    </div>
  )
}
