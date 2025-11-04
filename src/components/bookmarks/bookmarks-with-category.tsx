"use client";
import { BookmarksWithCategory } from "@/zod/bookmarks-schema";
import React from "react";
import { Card } from "../atoms/card";
import { Computer, ArrowRight } from "lucide-react";
import BookmarkCard from "./bookmark-card";

const BookmarksWithCategoryComponent = ({
  bookmarksCategory,
}: {
  bookmarksCategory: BookmarksWithCategory;
}) => {
  const { name, bookmarks } = bookmarksCategory;
  return (
    <div>
      <div>
        <Card className="w-full max-w-2xl border border-border">
          <div className="flex items-center justify-between px-4">
            {/* Left Section */}
            <div className="flex items-start gap-4 flex-1">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Computer className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-semibold text-blue-600 mb-1">
                  {name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {bookmarksCategory?.bookmarks?.length} bookmarks
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 ml-4">
              <span className="text-lg font-medium text-foreground">
                {bookmarksCategory?.bookmarks?.length}
              </span>
              <ArrowRight className="w-5 h-5 text-foreground" />
            </div>
          </div>
        </Card>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarksWithCategoryComponent;
