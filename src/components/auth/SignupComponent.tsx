"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../atoms/form";
import { useForm } from "react-hook-form";
import { signupSchema, SignupSchemaType } from "@/zod/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "../atoms/spinner";
import { useCreateUser } from "@/hooks/reactQuery/authQuery";
import { isAxiosError } from "axios";

const SignupComponent = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { createUserMutation } = useCreateUser();
  const signupForm = useForm<SignupSchemaType>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchemaType) => {
    await createUserMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success("User created successfully!");
        router.push("/dashboard");
        // You can redirect the user or show a success message here
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ||
              "Error creating user. Please try again."
          );
        }
      },
    });
    console.log("Form submitted with data:", data);
  };

  return (
    <div className="max-w-lg h-dvh mx-auto my-auto flex flex-col gap-10 justify-center">
      <p className="text-center text-5xl">Create an account</p>
      <div>
        <Form {...signupForm}>
          <form
            onSubmit={signupForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={signupForm.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type={showPassword ? "text" : "password"}
                      endIcon={
                        showPassword ? (
                          <GoEyeClosed
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ) : (
                          <GoEye
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {signupForm.formState.isSubmitting ? (
              <Button
                type="submit"
                variant={"default"}
                disabled={signupForm.formState.isSubmitting}
              >
                Creating Account <Spinner />
              </Button>
            ) : (
              <Button type="submit" variant={"default"}>
                Signup
              </Button>
            )}
          </form>
        </Form>
        <p className="mt-4">
          Already have an account?{" "}
          <Button
            type="button"
            disabled={signupForm.formState.isSubmitting}
            variant="link"
            onClick={() => router.push("/auth/login")}
            className="text-emerald-400 hover:text-emerald-300 p-0 text-md cursor-pointer"
          >
            Login
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
