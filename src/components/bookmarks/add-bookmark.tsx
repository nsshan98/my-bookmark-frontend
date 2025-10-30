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
import {
  useCreateBookmark,
  useUrlInfo,
} from "@/hooks/reactQuery/bookmarkQuery";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/avatar";
import {
  useCreateCategory,
  useDeleteCategory,
  useEditCategory,
  useShowCategory,
} from "@/hooks/reactQuery/categoryQuery";
import { MultiCategorySelector } from "../category/multi-selector-category";

export default function AddBookmark() {
  const router = useRouter();
  const { urlInfoMutation } = useUrlInfo();
  const { bookmarkCreateMutation } = useCreateBookmark();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const bookmarkForm = useForm<BookmarksSchemaType>({
    defaultValues: {
      url: "",
      title: "",
      logo: "",
      image: "",
      category_ids: [],
    },
    resolver: zodResolver(bookmarksSchema),
  });

  const { showCategoryQuery } = useShowCategory();
  const { categoryCreateMutation } = useCreateCategory();
  const { categoryEditMutation } = useEditCategory();
  const { categoryDeleteMutation } = useDeleteCategory();

  const onSubmit = async (data: BookmarksSchemaType) => {
    console.log(data);
    await bookmarkCreateMutation.mutateAsync(data, {
      onSuccess: () => {
        toast("Bookmark added successfully");
        bookmarkForm.reset();
        handleClose();
        router.push("/bookmarks");
      },
      onError: (error: Error) => {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            One click to keep what&apos;s important — every idea deserves a home
            in your personal library of the web.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...bookmarkForm}>
            <form
              className="space-y-4"
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
                        disabled={loading}
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
                            bookmarkForm.setValue("logo", "");
                            bookmarkForm.setValue("image", "");
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
                                  bookmarkForm.setValue(
                                    "logo",
                                    data.data?.data?.logo
                                  );
                                  bookmarkForm.setValue(
                                    "image",
                                    data.data?.data?.image || ""
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
              {urlInfoMutation.data?.data?.success === true &&
                bookmarkForm.watch("url") && (
                  <div className="relative">
                    <div>
                      <FormField
                        control={bookmarkForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                className="pl-12"
                                placeholder="Bookmark Title"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="absolute left-2 top-6">
                      <FormField
                        control={bookmarkForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Avatar>
                                <AvatarImage
                                  src={field.value}
                                  alt="Logo"
                                  className="w-8 h-8"
                                />
                                <AvatarFallback>BK</AvatarFallback>
                              </Avatar>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-4">
                      <FormField
                        control={bookmarkForm.control}
                        name="category_ids"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categories</FormLabel>
                            <FormControl>
                              <MultiCategorySelector
                                categories={showCategoryQuery.data?.data || []}
                                isLoading={showCategoryQuery.isLoading}
                                selectedIds={field.value}
                                onSelectionChange={(selected) => {
                                  field.onChange(selected);
                                }}
                                onCreateCategory={async (title) => {
                                  const result =
                                    await categoryCreateMutation.mutateAsync({
                                      category_name: title,
                                    });
                                  toast.success(
                                    "Category created successfully"
                                  );
                                  return result.data;
                                }}
                                onEditCategory={async (category) => {
                                  await categoryEditMutation.mutateAsync({
                                    categoryId: category.id,
                                    category_name: category.category_name,
                                  });
                                  toast.success("Category edited successfully");
                                  console.log("Edit category:", category);
                                }}
                                onDeleteCategory={async (categoryId) => {
                                  await categoryDeleteMutation.mutateAsync(
                                    categoryId
                                  );
                                  toast.success(
                                    "Category deleted successfully"
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

              <DialogFooter>
                {bookmarkForm.formState.isSubmitting ? (
                  <Button
                    variant={"default"}
                    disabled={bookmarkForm.formState.isSubmitting}
                  >
                    <Spinner /> Saving
                  </Button>
                ) : (
                  <Button type="submit" variant={"default"} disabled={loading}>
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
