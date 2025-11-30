import { useMemo, useState } from "react";
import { StyledCheckbox } from "./StyledCheckbox";
import { CaretRight } from "@phosphor-icons/react";

export function FilterGroup({ title, options, selected, onChangeHandler }) {
  const [visibleCount, setVisibleCount] = useState(5);

  const isNested = useMemo(
    () => Array.isArray(options) && options.some(o => Array.isArray(o.children) && o.children.length > 0),
    [options]
  );

  const parents = useMemo(() => (isNested ? options : options), [isNested, options]);

  const hasMore = isNested ? parents.length > 5 : options.length > 5;
  const showingAll = visibleCount >= (isNested ? parents.length : options.length);

  const handleToggleShowMore = () => {
    if (showingAll) setVisibleCount(5);
    else setVisibleCount(prev => prev + 5);
  };

  const isChecked = (id) => selected.includes(String(id));

  const collectDescendantIds = (node, bag = []) => {
    (node.children || []).forEach((c) => {
      bag.push(String(c.id));
      collectDescendantIds(c, bag);
    });
    return bag;
  };

  const anyChildSelected = (node) => {
    const kids = collectDescendantIds(node, []);
    return kids.some((id) => isChecked(id));
  };

  const fireChange = (id, checked) => {
    onChangeHandler({ target: { value: String(id), checked: !!checked } });
  };

  const onParentChange = (node, checked) => {
    if (checked) {
      fireChange(node.id, true);
      return;
    }
    fireChange(node.id, false);
    const kids = collectDescendantIds(node, []);
    kids.forEach((id) => {
      if (isChecked(id)) fireChange(id, false);
    });
  };

  const onChildChange = (parentNode, childNode, checked) => {
    fireChange(childNode.id, checked);
    if (checked && isChecked(parentNode.id)) {
      fireChange(parentNode.id, false);
    }
  };

  // one row of a child with connector lines
  const ChildRow = ({ parentNode, childNode, isLast, depth = 0 }) => {
    const show = isChecked(parentNode.id) || anyChildSelected(parentNode);
    if (!show) return null;

    const hasKids = Array.isArray(childNode.children) && childNode.children.length > 0;
    const checked = isChecked(childNode.id);
    const expanded = checked || (hasKids && anyChildSelected(childNode));

    return (
      <div key={`c-${childNode.id}`} className="w-full">
        <div
          className="flex items-center gap-1"
          style={{ marginLeft: depth * 16 }}
        >
          {hasKids && (
            <CaretRight
              size={16}
              weight="bold"
              className={`text-schemesOnSurfaceVariant transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
            />
          )}
          <div className="flex-1 min-w-0">
            <StyledCheckbox
              id={childNode.id}
              label={childNode.name}
              checked={checked}
              onChangeHandler={(e) => onChildChange(parentNode, childNode, e.target.checked)}
            />
          </div>
        </div>
        {hasKids && expanded && (
          <div className="mt-4 mb-2 space-y-4">
            {childNode.children.map((g, idx) => (
              <ChildRow
                key={`c-${childNode.id}-${g.id}`}
                parentNode={parentNode}
                childNode={g}
                isLast={idx === childNode.children.length - 1}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderParent = (node) => {
    const checked = isChecked(node.id);
    const expanded = checked || anyChildSelected(node);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;

    return (
      <div key={`p-${node.id}`} className="w-full">
        <div className="flex items-center gap-1 my-1">
          {hasChildren && (
            <CaretRight
              size={16}
              weight="bold"
              className={`text-schemesOnSurfaceVariant transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
            />
          )}
          <div className="flex-1 min-w-0">
            <StyledCheckbox
              id={node.id}
              label={node.name}
              checked={checked}
              onChangeHandler={(e) => onParentChange(node, e.target.checked)}
            />
          </div>
        </div>

        {hasChildren && expanded && (
          <div className="relative mt-4 mb-2">
            <div className="pl-6 space-y-4">
              {node.children.map((child, idx) => (
                <ChildRow
                  key={`c-${child.id}`}
                  parentNode={node}
                  childNode={child}
                  isLast={idx === node.children.length - 1}
                  depth={0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // FLAT
  if (!isNested) {
    return (
      <div className="mb-4">
        {title && <h3 className="Blueprint-title-small mb-3">{title}</h3>}
        <div className="flex flex-wrap gap-4">
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
            onClick={handleToggleShowMore}
            className="mt-4 text-schemesPrimary Blueprint-label-large hover:underline"
          >
            {showingAll ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    );
  }

  // NESTED
  return (
    <div className="mb-4">
      {title && <h3 className="Blueprint-title-small mb-3">{title}</h3>}

      <div className="flex flex-col gap-2">
        {(parents || []).slice(0, visibleCount).map(renderParent)}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={handleToggleShowMore}
          className="mt-4 text-schemesPrimary Blueprint-label-large hover:underline"
        >
          {showingAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}