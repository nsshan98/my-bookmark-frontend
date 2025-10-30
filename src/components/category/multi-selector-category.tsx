"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/atoms/button";
import { ChevronDown, Plus } from "lucide-react";
import {
  FiX,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/atoms/dialog";

interface Category {
  id: string;
  category_name: string;
  color?: string;
  icon?: string;
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
  const [isCreating, setIsCreating] = useState(false);

  // Inline edit state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editValue, setEditValue] = useState("");

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Sync controlled selectedIds
  useEffect(() => {
    if (controlledSelectedIds) setSelectedIds(controlledSelectedIds);
  }, [controlledSelectedIds]);

  // Auto-focus inputs
  useEffect(() => {
    if (isOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (editingCategoryId && editInputRef.current) editInputRef.current.focus();
  }, [editingCategoryId]);

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

  // Selection handlers
  const toggleCategory = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const newSelection = prev.includes(id)
          ? prev.filter((i) => i !== id)
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
        const newSelection = prev.filter((i) => i !== id);
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

  // Create category
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
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsCreating(false);
    }
  }, [searchInput, isCreating, onCreateCategory, onSelectionChange]);

  // Delete category
  const handleDeleteCategory = async () => {
    if (!deletingCategory || !onDeleteCategory) return;
    try {
      await onDeleteCategory(deletingCategory.id);
      removeCategory(deletingCategory.id);
      setDeletingCategory(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // Save edit
  const handleSaveEdit = (category: Category) => {
    if (!editValue.trim()) return;
    onEditCategory?.({ ...category, category_name: editValue });
    setEditingCategoryId(null);
    setEditValue("");
  };

  // Filter categories
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

  if (isLoading)
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading categories...
      </div>
    );

  return (
    <div ref={containerRef} className="w-full">
      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategories.map((category) => {
            const isEditing = editingCategoryId === category.id;
            return (
              <div
                key={category.id}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-1.5 text-sm"
              >
                {isEditing ? (
                  <>
                    <input
                      ref={editInputRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(category);
                        if (e.key === "Escape") {
                          setEditingCategoryId(null);
                          setEditValue("");
                        }
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <button onClick={() => handleSaveEdit(category)}>
                      <FiCheckCircle
                        style={{
                          fontSize: "16px",
                          color: "#43A047",
                          cursor: "pointer",
                        }}
                      />
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategoryId(null);
                        setEditValue("");
                      }}
                    >
                      <FiXCircle
                        style={{
                          fontSize: "16px",
                          color: "#FF7043",
                          cursor: "pointer",
                        }}
                      />
                    </button>
                  </>
                ) : (
                  <>
                    {category.icon && <span>{category.icon}</span>}
                    <span>{category.category_name}</span>

                    {/* Deselect */}
                    <button
                      type="button" // <--- add this
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCategory(category.id);
                      }}
                    >
                      <FiX
                        style={{
                          fontSize: "16px",
                          color: "#FFC105",
                          cursor: "pointer",
                        }}
                      />
                    </button>

                    <button
                      type="button" // <--- add this
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategoryId(category.id);
                        setEditValue(category.category_name);
                      }}
                    >
                      <FiEdit
                        style={{
                          fontSize: "16px",
                          color: "#3F51B5",
                          cursor: "pointer",
                        }}
                      />
                    </button>

                    <button
                      type="button" // <--- add this
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingCategory(category);
                      }}
                    >
                      <FiTrash2
                        style={{
                          fontSize: "16px",
                          color: "#F44237",
                          cursor: "pointer",
                        }}
                      />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dropdown Trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
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

        {isOpen && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-input bg-popover shadow-lg">
            {/* Search */}
            <div className="border-b border-input p-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search or create..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            {/* Available Categories */}
            <div className="max-h-36 overflow-y-auto p-2">
              {availableCategories.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm hover:bg-muted`}
                >
                  <button
                    onClick={() => {
                      toggleCategory(category.id);
                      setSearchInput("");
                    }}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    {category.icon && (
                      <span className="text-lg">{category.icon}</span>
                    )}
                    <span>{category.category_name}</span>
                  </button>
                </div>
              ))}

              {canCreateNew && onCreateCategory && (
                <button
                  onClick={handleCreateCategory}
                  disabled={isCreating}
                  className="w-full rounded-md px-3 py-2.5 text-left text-sm hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Plus className="h-4 w-4" />
                    <span>
                      Create {searchInput} {isCreating && "..."}
                    </span>
                  </div>
                </button>
              )}

              {availableCategories.length === 0 && !canCreateNew && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  {searchInput
                    ? "No categories found"
                    : "All categories selected"}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-input px-2 py-2 flex gap-2">
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
                variant="default"
                className="flex-1"
                onClick={() => {
                  setIsOpen(false);
                  setSearchInput("");
                }}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm">
            Are you sure you want to delete `{deletingCategory?.category_name}`?
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeletingCategory(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
