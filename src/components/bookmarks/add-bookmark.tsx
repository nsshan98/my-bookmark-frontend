"use client";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Plus } from "lucide-react";
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
import { useUrlInfo } from "@/hooks/reactQuery/bookmarkQuery";
import { useState } from "react";
import { toast } from "sonner";

export default function AddBookmark() {
  const { urlInfoMutation } = useUrlInfo();

  const [loading, setLoading] = useState(false);
  const bookmarkForm = useForm<BookmarksSchemaType>({
    values: {
      url: "",
      title: "",
    },
    resolver: zodResolver(bookmarksSchema),
  });

  const onSubmit = async (data: BookmarksSchemaType) => {
    console.log(data);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button startIcon={<Plus />} variant="default">
            Add Bookmark
          </Button>
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Keep This for Later</DialogTitle>
            <DialogDescription>
              One click to keep what&apos;s important — every idea deserves a
              home in your personal library of the web.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...bookmarkForm}>
              <form
                onSubmit={bookmarkForm.handleSubmit(onSubmit)}
                className="space-y-8"
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
                {urlInfoMutation.data?.data?.success && (
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
                )}

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
                    <Button type="submit" variant={"default"}>
                      Save
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
