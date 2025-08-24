export function StyledCheckbox({ id, label, onChangeHandler, checked }) {
  return (
    <div key={id}>
      <input
        type="checkbox"
        id={`filter-${id}`}
        value={id}
        checked={checked} // ✅ controlled by parent
        className="peer hidden"
        onChange={onChangeHandler}
      />
      <label
        htmlFor={`filter-${id}`}
        className="cursor-pointer px-3 py-2 rounded-md Blueprint-label-small
                  transition-colors duration-200
                  peer-checked:bg-gray-500 peer-checked:text-white peer-checked:border-grey-700
                  peer-not-checked:bg-[var(--schemesSurfaceContainer)] peer-not-checked:text-gray-700 peer-not-checked:border-gray-300"
      >
        {label}
      </label>
    </div>
  )
}