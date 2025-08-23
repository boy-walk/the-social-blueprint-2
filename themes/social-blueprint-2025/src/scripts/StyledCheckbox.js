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
        className="cursor-pointer px-3 py-1 rounded-full border text-sm
                  transition-colors duration-200
                  peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600
                  peer-not-checked:bg-gray-100 peer-not-checked:text-gray-700 peer-not-checked:border-gray-300"
      >
        {label}
      </label>
    </div>
  )
}