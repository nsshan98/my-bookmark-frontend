import { useState } from "react";
import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { ExternalLink, Trash2, Tag } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/atoms/alert-dialog";
import { Bookmarks } from "@/zod/bookmarks-schema";
import Image from "next/image";

export default function BookmarkCard({ bookmarks }: { bookmarks: Bookmarks }) {
  const [imageError, setImageError] = useState(false);
  console.log(bookmarks);

  const { url, title } = bookmarks;

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-teal-100 bg-white/80 backdrop-blur-sm"
      //   data-testid={`bookmark-card-${bookmark.id}`}
    >
      {/* Image */}
      {bookmarks?.image && !imageError ? (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100">
          <Image
            src={bookmarks.image || ""}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            // data-testid={`bookmark-image-${bookmark.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
          <ExternalLink className="w-12 h-12 text-teal-400" />
        </div>
      )}

      <CardContent className="p-5">
        {/* Title */}
        <h3
          className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors"
          //   data-testid={`bookmark-title-${bookmark.id}`}
        >
          {title || "Untitled"}
        </h3>

        {/* Description */}
        {bookmarks?.description && (
          <p
            className="text-sm text-gray-600 mb-3 line-clamp-2"
            // data-testid={`bookmark-description-${bookmark.id}`}
          >
            {bookmarks?.description}
          </p>
        )}

        {/* URL */}
        <p
          className="text-xs text-gray-500 mb-3 truncate"
          //   data-testid={`bookmark-url-${bookmark.id}`}
        >
          {bookmarks?.url}
        </p>

        {/* Tags */}
        {bookmarks?.tags && bookmarks.tags.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mb-4"
            // data-testid={`bookmark-tags-${bookmark.id}`}
          >
            {bookmarks.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700"
                data-testid={`bookmark-tag-${tag}`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span
            className="text-xs text-gray-500"
            // data-testid={`bookmark-date-${bookmark.id}`}
          >
            {formatDate(bookmarks?.createdAt || "")}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-teal-50 hover:text-teal-600"
              onClick={() => window.open(url, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this bookmark? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-900 hover:bg-gray-800 hover:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    // onClick={() => onDelete(bookmark.id)}
                    className="bg-red-600 hover:bg-red-700"
                    // data-testid={`delete-confirm-${bookmark.id}`}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
