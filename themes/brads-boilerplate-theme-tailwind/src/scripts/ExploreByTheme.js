import { Card } from "./Card"
import { ArrowIcon } from "./SectionOne"
import ExploreThemeOne from "../../assets/explore-theme-1.svg"
import ExploreThemeTwo from "../../assets/explore-theme-2.svg"

export const ExploreByTheme = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            {[0, 1, 2, 3, 4].map((i) => (
                <Card
                    key={i}
                    href={i === 0 ? '/community-connect' : `/explore/${i + 1}`}
                    styles="h-64 max-w-full border-1 border-background-light px-4 pt-4"
                >
                    <div className="flex flex-col items-end justify-end gap-2 h-full">
                        <ArrowIcon />
                        <div className="w-full text-xl text-right">
                            {i === 0 && (
                                <>
                                    Community
                                    <br />
                                    Connection
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
                                    Learning and
                                    <br />
                                    Growth
                                </>
                            )}
                            {i === 3 && (
                                <>
                                    Support and
                                    <br />
                                    Services
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
                        <img
                            src={i === 1 ? ExploreThemeTwo : ExploreThemeOne}
                            alt="Theme Icon"
                            className="object-cover w-full"
                        />
                    </div>
                </Card>
            ))}
        </div>
    )
}