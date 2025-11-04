import { useState } from "react";
import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { ExternalLink, SquarePen, Trash2 } from "lucide-react";
import { Bookmarks } from "@/zod/bookmarks-schema";
import EditBookmark from "./edit-bookmark";
import DeleteBookmark from "./delete-bookmark";
import dayjs from "dayjs";

export default function BookmarkCard({ bookmark }: { bookmark: Bookmarks }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<{
    id: string | null;
    openState: "edit" | "delete" | null;
  }>({
    id: null,
    openState: null,
  });

  const { id, url, title } = bookmark;

  const handleOpenEditDialog = () => {
    setSelectedBookmark({ id: id, openState: "edit" });
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = () => {
    setSelectedBookmark({ id: id, openState: "delete" });
    setOpenDialog(true);
  };

  return (
    <Card
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-teal-100 bg-white/80 backdrop-blur-sm"
      //   data-testid={`bookmark-card-${bookmark.id}`}
    >
      <CardContent className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {title || "Untitled"}
        </h3>

        {/* Description */}
        {bookmark?.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {bookmark?.description}
          </p>
        )}

        {/* URL */}
        <p className="text-xs text-gray-500 mb-3 truncate">{bookmark?.url}</p>

        {/* Tags */}
        {/* {bookmarks?.category && bookmarks?.category.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {bookmarks.category.map((tag, index) => (
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
        )} */}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            {dayjs(bookmark?.created_at).format("MMM DD, YYYY")}
          </span>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-teal-50 hover:text-teal-600"
              onClick={() => window.open(url, "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-teal-50 hover:text-teal-600"
              onClick={handleOpenEditDialog}
            >
              <SquarePen className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-teal-50 hover:text-teal-600"
              onClick={handleOpenDeleteDialog}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {selectedBookmark && selectedBookmark.openState === "edit" && (
        <EditBookmark
          bookmarkId={selectedBookmark.id || ""}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          data={bookmark}
        />
      )}

      {selectedBookmark && selectedBookmark.openState === "delete" && (
        <DeleteBookmark
          bookmarkId={selectedBookmark.id || ""}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Card>
  );
}
