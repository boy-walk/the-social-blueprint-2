import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import clsx from 'clsx';
import { CaretDown, CaretRight, MagnifyingGlass, Check } from '@phosphor-icons/react';
import { Button } from './Button';

/**
 * Flattens nested options into a flat array with depth info
 */
function flattenOptions(options, depth = 0, parentExpanded = true) {
  let result = [];
  for (const option of options) {
    result.push({
      ...option,
      depth,
      hasChildren: Array.isArray(option.children) && option.children.length > 0,
    });
    if (option.children && option.children.length > 0) {
      result = result.concat(flattenOptions(option.children, depth + 1, parentExpanded));
    }
  }
  return result;
}

/**
 * Recursively filter options based on search query
 * Returns options that match OR have children that match
 */
function filterOptionsRecursive(options, searchLower) {
  if (!searchLower) return options;

  return options.reduce((acc, option) => {
    const labelMatches = option.label.toLowerCase().includes(searchLower);

    // Check if any children match
    let filteredChildren = [];
    if (option.children && option.children.length > 0) {
      filteredChildren = filterOptionsRecursive(option.children, searchLower);
    }

    // Include if label matches OR has matching children
    if (labelMatches || filteredChildren.length > 0) {
      acc.push({
        ...option,
        children: filteredChildren.length > 0 ? filteredChildren : option.children,
        // Mark as matching if the label itself matches (for highlighting)
        _matches: labelMatches,
      });
    }

    return acc;
  }, []);
}

/**
 * Get all descendant values of an option
 */
function getDescendantValues(option) {
  let values = [];
  if (option.children) {
    for (const child of option.children) {
      values.push(child.value);
      values = values.concat(getDescendantValues(child));
    }
  }
  return values;
}

/**
 * Find an option by value in nested structure
 */
function findOptionByValue(options, value) {
  for (const option of options) {
    if (option.value === value) return option;
    if (option.children) {
      const found = findOptionByValue(option.children, value);
      if (found) return found;
    }
  }
  return null;
}

export function DropdownSelect({
  label = 'Select',
  options = [],
  value = [],
  onChange,
  multiple = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  placeholder = 'Select an option',
  disabled = false,
  error = '',
  supportingText = '',
  collapsible = false, // Whether parent items can be collapsed
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const id = useId();

  // Normalize value to array for consistent handling
  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

  // Check if options are nested
  const isNested = useMemo(() => {
    return options.some(opt => opt.children && opt.children.length > 0);
  }, [options]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return options;
    return filterOptionsRecursive(options, searchLower);
  }, [options, search]);

  // Flatten for rendering
  const flatOptions = useMemo(() => {
    return flattenOptions(filteredOptions);
  }, [filteredOptions]);

  // Auto-expand all when searching
  useEffect(() => {
    if (search && isNested) {
      const allParentValues = new Set();
      const collectParents = (opts) => {
        for (const opt of opts) {
          if (opt.children && opt.children.length > 0) {
            allParentValues.add(opt.value);
            collectParents(opt.children);
          }
        }
      };
      collectParents(filteredOptions);
      setExpandedNodes(allParentValues);
    }
  }, [search, filteredOptions, isNested]);

  // Initialize expanded state to show all by default
  useEffect(() => {
    if (isNested && !collapsible) {
      const allParentValues = new Set();
      const collectParents = (opts) => {
        for (const opt of opts) {
          if (opt.children && opt.children.length > 0) {
            allParentValues.add(opt.value);
            collectParents(opt.children);
          }
        }
      };
      collectParents(options);
      setExpandedNodes(allParentValues);
    }
  }, [options, isNested, collapsible]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleExpanded = (optionValue, e) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(optionValue)) {
        next.delete(optionValue);
      } else {
        next.add(optionValue);
      }
      return next;
    });
  };

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValue);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearch('');
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;

    // Find labels from nested structure
    const findLabels = (opts, values) => {
      let labels = [];
      for (const opt of opts) {
        if (values.includes(opt.value)) {
          labels.push(opt.label);
        }
        if (opt.children) {
          labels = labels.concat(findLabels(opt.children, values));
        }
      }
      return labels;
    };

    const selectedLabels = findLabels(options, selectedValues);

    if (selectedLabels.length === 1) return selectedLabels[0];
    return `${selectedLabels.length} selected`;
  };

  const hasError = typeof error === 'string' && error.length > 0;
  const helperText = hasError ? error : supportingText;

  // Check if an option or any of its ancestors is hidden due to collapsed parent
  const isOptionVisible = (option, index) => {
    if (!collapsible || option.depth === 0) return true;

    // Find parent option
    for (let i = index - 1; i >= 0; i--) {
      const prevOption = flatOptions[i];
      if (prevOption.depth < option.depth) {
        // This is a potential parent
        if (prevOption.hasChildren && !expandedNodes.has(prevOption.value)) {
          return false;
        }
        if (prevOption.depth === 0) break;
      }
    }
    return true;
  };

  // Render a single option
  const renderOption = (option, index) => {
    // Skip if parent is collapsed
    if (collapsible && !isOptionVisible(option, index)) {
      return null;
    }

    const isSelected = selectedValues.includes(option.value);
    const isExpanded = expandedNodes.has(option.value);
    const indent = option.depth * 24;

    return (
      <li key={option.value}>
        <button
          type="button"
          onClick={() => handleSelect(option.value)}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'Blueprint-body-medium text-left',
            'transition-colors duration-150',
            isSelected
              ? 'bg-schemesPrimaryContainer text-schemesOnPrimaryContainer'
              : 'text-schemesOnSurface hover:bg-schemesSurfaceContainerHigh'
          )}
          style={{ paddingLeft: `${12 + indent}px` }}
          role="option"
          aria-selected={isSelected}
        >
          {/* Expand/collapse button for parents */}
          {collapsible && option.hasChildren ? (
            <button
              type="button"
              onClick={(e) => toggleExpanded(option.value, e)}
              className="p-0.5 -ml-1 rounded hover:bg-schemesOutlineVariant/30"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <CaretDown size={16} className="text-schemesOnSurfaceVariant" />
              ) : (
                <CaretRight size={16} className="text-schemesOnSurfaceVariant" />
              )}
            </button>
          ) : (
            option.depth > 0 && collapsible && (
              <span className="w-5" /> // Spacer for alignment
            )
          )}

          {/* Checkbox/Radio indicator */}
          <span
            className={clsx(
              'flex items-center justify-center w-5 h-5 shrink-0',
              'border-2 transition-colors duration-150',
              multiple ? 'rounded' : 'rounded-full',
              isSelected
                ? 'bg-schemesPrimary border-schemesPrimary'
                : 'border-schemesOutline bg-transparent'
            )}
          >
            {isSelected && (
              multiple ? (
                <Check size={14} weight="bold" className="text-schemesOnPrimary" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-schemesOnPrimary" />
              )
            )}
          </span>

          {/* Option content */}
          <span className="flex-1 min-w-0 truncate">
            {option.label}
          </span>

          {/* Optional image */}
          {option.image && (
            <img
              src={option.image}
              alt=""
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="relative flex flex-col gap-2">
      {/* Label */}
      {label && (
        <label className="Blueprint-label-medium text-schemesOnSurface">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between gap-2',
          'px-4 py-3 rounded-xl',
          'Blueprint-body-medium text-left',
          'border bg-schemesSurfaceContainerLow',
          'transition-colors duration-150',
          hasError
            ? 'border-schemesError'
            : 'border-schemesOutline hover:border-schemesOnSurfaceVariant focus:border-schemesPrimary',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={clsx(
          'truncate',
          selectedValues.length === 0 && 'text-schemesOnSurfaceVariant'
        )}>
          {getDisplayText()}
        </span>
        <CaretDown
          size={20}
          className={clsx(
            'text-schemesOnSurfaceVariant transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-schemesSurface border border-schemesOutlineVariant rounded-xl shadow-lg overflow-hidden"
          role="listbox"
          aria-multiselectable={multiple}
        >
          {/* Search */}
          {searchable && (
            <div className="p-2 border-b border-schemesOutlineVariant">
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-schemesOnSurfaceVariant"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 Blueprint-body-medium bg-schemesSurfaceContainerHigh border border-schemesOutline rounded-lg text-schemesOnSurface placeholder:text-schemesOnSurfaceVariant focus:outline-none focus:ring-2 focus:ring-schemesPrimary focus:border-schemesPrimary"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Options */}
          <ul className="max-h-60 overflow-y-auto p-2">
            {flatOptions.length === 0 ? (
              <li className="px-4 py-3 Blueprint-body-medium text-schemesOnSurfaceVariant text-center">
                No results found
              </li>
            ) : (
              flatOptions.map((option, index) => renderOption(option, index))
            )}
          </ul>

          {/* Footer actions */}
          {multiple && selectedValues.length > 0 && (
            <div className="p-2 border-t border-schemesOutlineVariant">
              <Button
                label="Clear selection"
                variant="text"
                size="sm"
                className="w-full"
                onClick={() => {
                  onChange?.([]);
                  setIsOpen(false);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Helper/Error text */}
      {helperText && (
        <p
          className={clsx(
            'ml-4 Blueprint-body-small',
            hasError ? 'text-schemesError' : 'text-schemesOnSurfaceVariant'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}