import React from "react";
import { Card } from "./Card";
import { Button } from "./Button";

export function DetailedCard({
    image,
    category,
    title,
    description,
    author,
    date,
    href,
    buttonText = "Read more",
}) {
    return (
        <Card>
            <div className="flex w-full h-full">
                <div className="flex-shrink-0 overflow-hidden p-2 h-[12rem] w-[10rem]">
                    {image && (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    )}
                </div>
                <div className="flex flex-col justify-between p-4 w-full gap-2">
                    <div className="flex flex-col py-2 gap-2">
                        {title && (
                            <h3 className="Blueprint-body-large-emphasized mb-2">
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p className="Blueprint-body-medium text-schemesOnSurfaceVariant mb-2">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            {author && (
                                <p className="Blueprint-title-medium text-schemesLightOnSurface">
                                    {author}
                                </p>
                            )}
                            {date && (
                                <p className="Blueprint-label-medium text-schemesOnSurfaceVariant">
                                    {date}
                                </p>
                            )}
                        </div>
                        <a
                            href={href || "#"}
                            className="text-white bg-primary px-3 py-1 text-sm rounded-full Blueprint-label-medium"
                        >
                            <Button
                                label={buttonText}
                                size="base"
                                variant="filled"
                                className="w-full"/>
                        </a>

                    </div>
                </div>

            </div>
        </Card>
    );
}
