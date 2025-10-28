"use client";
import { BookmarksWithCategory } from "@/zod/bookmarks-schema";
import React from "react";

const BookmarksWithCategoryComponent = ({
  bookmarksCategory,
}: {
  bookmarksCategory: BookmarksWithCategory;
}) => {
  const { name, bookmarks } = bookmarksCategory;
  return (
    <div>
      <p className="font-bold">{name}</p>
      <div>
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id}>
            <p>{bookmark.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksWithCategoryComponent;
