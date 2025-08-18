import { useState } from "react";
import { StyledCheckbox } from "./StyledCheckbox";

export function EventsCalendarFilterGroup({ title, options, selected, onChangeHandler }) {
    const [visibleCount, setVisibleCount] = useState(5);

    const hasMore = options.length > 5;
    const showingAll = visibleCount >= options.length;

    const handleToggle = () => {
        if (showingAll) {
            setVisibleCount(5); // collapse back
        } else {
            setVisibleCount((prev) => prev + 5);
        }
    };

    return (
        <div className="mb-4">
            <h3 className="mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {options.slice(0, visibleCount).map((option) => (
                    <StyledCheckbox
                        key={option.id}
                        id={option.id}
                        label={option.name}
                        checked={selected.includes(String(option.id))}
                        onChangeHandler={onChangeHandler}
                    />
                ))}
            </div>

            {hasMore && (
                <button
                    type="button"
                    onClick={handleToggle}
                    className="mt-2 text-blue-600 font-semibold hover:underline"
                >
                    {showingAll ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    );
}
