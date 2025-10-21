import React from "react";
import DeleteModal from "../molecules/delete-modal";
import { useDeleteBookmark } from "@/hooks/reactQuery/bookmarkQuery";
import { toast } from "sonner";

interface DeleteBookmarkProps {
  open: boolean;
  onClose: () => void;
  bookmarkId: string;
}

const DeleteBookmark = ({ open, onClose, bookmarkId }: DeleteBookmarkProps) => {
  const { bookmarkDeleteMutation } = useDeleteBookmark();

  const handleDeleteBookmark = () => {
    bookmarkDeleteMutation.mutate(bookmarkId, {
      onSuccess: () => {
        toast("Bookmark deleted successfully");
      },
    });
  };
  return (
    <div>
      <DeleteModal
        open={open}
        onClose={onClose}
        onConfirm={handleDeleteBookmark}
      />
    </div>
  );
};

export default DeleteBookmark;
