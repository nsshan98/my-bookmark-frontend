"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/atoms/button";
import { X, ChevronDown, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

interface Category {
  id: string;
  category_name: string;
  color: string;
  icon: string;
}

interface MultiCategorySelectorProps {
  categories: Category[];
  isLoading?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selected: string[]) => void;
  onCreateCategory?: (name: string) => Promise<Category>;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (categoryId: string) => Promise<void>;
}

export function MultiCategorySelector({
  categories = [],
  isLoading = false,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}: MultiCategorySelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    controlledSelectedIds || []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isCreating, setIsCreating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync with controlled selectedIds
  useEffect(() => {
    if (controlledSelectedIds) {
      setSelectedIds(controlledSelectedIds);
    }
  }, [controlledSelectedIds]);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchInput("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const newSelection = prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];

        onSelectionChange?.(newSelection);
        return newSelection;
      });
    },
    [onSelectionChange]
  );

  const removeCategory = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const newSelection = prev.filter((item) => item !== id);
        onSelectionChange?.(newSelection);
        return newSelection;
      });
    },
    [onSelectionChange]
  );

  const clearAll = useCallback(() => {
    setSelectedIds([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const handleCreateCategory = useCallback(async () => {
    if (!searchInput.trim() || isCreating || !onCreateCategory) return;

    setIsCreating(true);
    try {
      const newCategory = await onCreateCategory(searchInput.trim());
      setSelectedIds((prev) => {
        const newSelection = [...prev, newCategory.id];
        onSelectionChange?.(newSelection);
        return newSelection;
      });
      setSearchInput("");
      setHighlightedIndex(-1);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsCreating(false);
    }
  }, [searchInput, isCreating, onCreateCategory, onSelectionChange]);

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      if (!onDeleteCategory) return;

      try {
        await onDeleteCategory(categoryId);
        removeCategory(categoryId);
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    },
    [onDeleteCategory, removeCategory]
  );

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.category_name?.toLowerCase().includes(searchInput.toLowerCase())
  );

  const availableCategories = filteredCategories.filter(
    (cat) => !selectedIds.includes(cat.id)
  );
  const selectedCategories = categories.filter((cat) =>
    selectedIds.includes(cat.id)
  );

  const canCreateNew =
    searchInput.trim().length > 0 &&
    !categories.some(
      (cat) => cat.category_name?.toLowerCase() === searchInput.toLowerCase()
    );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        return;
      }

      const itemCount = availableCategories.length + (canCreateNew ? 1 : 0);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < availableCategories.length
          ) {
            toggleCategory(availableCategories[highlightedIndex].id);
            setSearchInput("");
            setHighlightedIndex(-1);
          } else if (
            canCreateNew &&
            highlightedIndex === availableCategories.length
          ) {
            handleCreateCategory();
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchInput("");
          setHighlightedIndex(-1);
          break;
      }
    },
    [
      isOpen,
      highlightedIndex,
      availableCategories,
      canCreateNew,
      toggleCategory,
      handleCreateCategory,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <div
              key={category.id}
              className={`${category.color} bg-emerald-400 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:shadow-md`}
            >
              <span>{category.icon}</span>
              <span>{category.category_name}</span>
              <button
                onClick={() => removeCategory(category.id)}
                className="ml-1 inline-flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1"
                aria-label={`Remove ${category.category_name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="text-muted-foreground">
            {selectedIds.length === 0
              ? "Select categories..."
              : `${selectedIds.length} selected`}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute top-full z-50 mt-2 w-full rounded-lg border border-input bg-popover shadow-lg"
            role="listbox"
          >
            {/* Search Input */}
            <div className="border-b border-input p-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search or create..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Categories List */}
            <div className="max-h-36 overflow-y-auto p-2">
              {availableCategories.length > 0
                ? availableCategories.map((category, index) => (
                    <div
                      key={category.id}
                      className={`group flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                        highlightedIndex === index
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      }`}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <button
                        onClick={() => {
                          toggleCategory(category.id);
                          setSearchInput("");
                          setHighlightedIndex(-1);
                        }}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">
                          {category.category_name}
                        </span>
                      </button>

                      {(onEditCategory || onDeleteCategory) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="ml-2 inline-flex items-center justify-center rounded p-1 opacity-0 transition-opacity hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100"
                              aria-label={`Actions for ${category.category_name}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            {onEditCategory && (
                              <DropdownMenuItem
                                onClick={() => onEditCategory(category)}
                              >
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDeleteCategory && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                className="text-destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))
                : null}

              {/* Create New Category Option */}
              {canCreateNew && onCreateCategory && (
                <button
                  onClick={handleCreateCategory}
                  disabled={isCreating}
                  onMouseEnter={() =>
                    setHighlightedIndex(availableCategories.length)
                  }
                  className={`w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    highlightedIndex === availableCategories.length
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  } ${isCreating ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">
                      Create {searchInput} {isCreating && "..."}
                    </span>
                  </div>
                </button>
              )}

              {/* Empty States */}
              {availableCategories.length === 0 && !canCreateNew && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  {searchInput
                    ? "No categories found"
                    : "All categories selected"}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-input px-2 py-2">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearAll}
                  className="flex-1"
                  disabled={selectedIds.length === 0}
                >
                  Clear All
                </Button>
                <Button
                  size="sm"
                  variant={"default"}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchInput("");
                  }}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
