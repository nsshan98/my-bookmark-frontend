"use client";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../atoms/form";
import { Spinner } from "../atoms/spinner";
import { bookmarksSchema, BookmarksSchemaType } from "@/zod/bookmarks-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditBookmark, useUrlInfo } from "@/hooks/reactQuery/bookmarkQuery";
import { useState } from "react";
import { toast } from "sonner";

interface EditBookmarkProps {
  bookmarkId: string;
  open: boolean;
  onClose: () => void;
  data: BookmarksSchemaType;
}

export default function EditBookmark({
  bookmarkId,
  open,
  onClose,
  data,
}: EditBookmarkProps) {
  const { urlInfoMutation } = useUrlInfo();
  const { bookmarkEditMutation } = useEditBookmark(bookmarkId);

  const [loading, setLoading] = useState(false);
  const bookmarkForm = useForm<BookmarksSchemaType>({
    values: {
      url: data.url,
      title: data.title,
    },
    resolver: zodResolver(bookmarksSchema),
  });

  console.log(data);

  const onSubmit = async (data: BookmarksSchemaType) => {
    console.log(data);
    await bookmarkEditMutation.mutateAsync(data, {
      onSuccess: () => {
        toast("Bookmark added successfully");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Keep This for Later</DialogTitle>
          <DialogDescription>
            One click to keep what&apos;s important — every idea deserves a home
            in your personal library of the web.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...bookmarkForm}>
            <form
              className="space-y-8"
              onSubmit={bookmarkForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={bookmarkForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        type="url"
                        {...field}
                        onChange={(e) => {
                          const urlPattern =
                            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
                          const value = e.target.value;
                          field.onChange(e);
                          if (!urlPattern.test(value)) {
                            bookmarkForm.setValue("title", "");
                          }
                          if (urlPattern.test(value)) {
                            setLoading(true);
                            urlInfoMutation.mutate(
                              { url: value },
                              {
                                onSuccess: (data) => {
                                  bookmarkForm.setValue(
                                    "title",
                                    data.data?.data?.title
                                  );
                                  setLoading(false);
                                },
                                onError: (error) => {
                                  toast.error(error.message);
                                  setLoading(false);
                                },
                              }
                            );
                          }
                        }}
                        endIcon={loading ? <Spinner /> : null}
                      />
                    </FormControl>
                    {urlInfoMutation.data?.data?.success === false && (
                      <FormMessage>
                        {urlInfoMutation.data?.data?.error}
                      </FormMessage>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={bookmarkForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bookmark Title"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                {bookmarkForm.formState.isSubmitting ? (
                  <Button
                    type="submit"
                    variant={"default"}
                    disabled={bookmarkForm.formState.isSubmitting}
                  >
                    <Spinner /> Saving
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant={"default"}
                    // onClick={() => {
                    //   bookmarkForm.handleSubmit(onSubmit);
                    // }}
                  >
                    Save
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
