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
// import { Command, CommandEmpty, CommandInput } from "../atoms/command";

export default function AddBookmark() {
  const router = useRouter();
  const { urlInfoMutation } = useUrlInfo();
  const { bookmarkCreateMutation } = useCreateBookmark();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const [query, setQuery] = useState("");

  const handleClose = () => setOpen(false);
  const bookmarkForm = useForm<BookmarksSchemaType>({
    defaultValues: {
      url: "",
      title: "",
      logo: "",
      image: "",
      category_ids: [] as string[],
    },
    resolver: zodResolver(bookmarksSchema),
  });

  // const handleCreateCategory = () => {
  //   console.log("created");
  // };

  const onSubmit = async (data: BookmarksSchemaType) => {
    console.log(data);
    await bookmarkCreateMutation.mutateAsync(data, {
      onSuccess: () => {
        toast("Bookmark added successfully");
        bookmarkForm.resetField("url");
        bookmarkForm.resetField("title");
        bookmarkForm.resetField("logo");
        bookmarkForm.resetField("image");
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
                    <div className="absolute left-2 top-6 ">
                      <FormField
                        control={bookmarkForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Logo</FormLabel> */}
                            <FormControl>
                              <Avatar>
                                <AvatarImage
                                  src={field.value}
                                  alt="Logo"
                                  className="w-8 h-8 "
                                />
                                <AvatarFallback>BK</AvatarFallback>
                              </Avatar>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

              {/* <div>
                <FormField
                  control={bookmarkForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Command>
                          <CommandInput
                            placeholder="Select a category"
                            value={query}
                            onValueChange={setQuery}
                          />
                          <CommandEmpty>
                            <div
                              onClick={handleCreateCategory}
                              className="cursor-pointer"
                            >
                              {loading
                                ? "Creating....."
                                : `Create a category ${query}`}
                            </div>
                          </CommandEmpty>
                        </Command>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

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
