"use client";
import { Bookmark, Tag, Search, Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import AddBookmark from "./add-bookmark";
import {
  useShowBookmarks,
  useShowBookmarksWithCategory,
} from "@/hooks/reactQuery/bookmarkQuery";
// import BookmarkCard from "./bookmark-card";
import { BookmarksWithCategory } from "@/zod/bookmarks-schema";
import { Skeleton } from "../atoms/skeleton";
import BookmarksWithCategoryComponent from "./bookmarks-with-category";

export default function BookmarksComponent() {
  const { showBookmarksQuery } = useShowBookmarks();
  const { showBookmarksWithCategoryQuery } = useShowBookmarksWithCategory();
  console.log(showBookmarksWithCategoryQuery.data);
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bookmark Manager</h1>
              <p className="text-sm">Organize and manage your favorite links</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AddBookmark />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm mt-1">Total Bookmarks</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm mt-1">Unique Tags</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm mt-1">Filtered Results</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search bookmarks..."
                className="pl-10 border-gray-200"
              />
            </div>
            <Button className="px-8">Search</Button>
          </div>

          <div className="flex gap-3">
            <Select defaultValue="all-tags">
              <SelectTrigger className="w-[180px] border-gray-200">
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-tags">All tags</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="date">
              <SelectTrigger className="w-[180px] border-gray-200">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="default" size="icon" className="border-gray-200">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {showBookmarksQuery.data?.data?.length === 0 && (
          <Card className="p-16 border border-gray-200">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <Bookmark className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
              <p className="mb-6 max-w-md">
                Start building your collection by adding your first bookmark
              </p>
              <Button onClick={() => <AddBookmark />}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Bookmark
              </Button>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {showBookmarksQuery.isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <div className="h-48 flex items-center justify-center">
                  <Skeleton className="w-120 h-48" />
                </div>
                <CardContent>
                  <div className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <Skeleton className="w-1/2 h-3" />
                  </div>
                  <div className="text-xs text-gray-500 mb-3 truncate">
                    <Skeleton className="w-1/2 h-3" />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      <Skeleton className="w-1/2 h-3" />
                    </span>

                    <div className="flex gap-1">
                      <Skeleton className="w-30 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div>
          {/* {showBookmarksQuery.data?.data?.map((bookmarks: Bookmarks) => (
            <BookmarkCard key={bookmarks.id} bookmarks={bookmarks} />
          ))} */}

          {showBookmarksWithCategoryQuery.data?.data?.map(
            (bookmarks: BookmarksWithCategory) => (
              <BookmarksWithCategoryComponent
                key={bookmarks.id}
                bookmarksCategory={bookmarks}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}
