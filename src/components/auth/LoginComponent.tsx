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
import { loginSchema, LoginSchemaType } from "@/zod/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { useState } from "react";
import { doUserSignIn } from "@/action/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "../atoms/spinner";

const LoginComponent = () => {
  const router = useRouter();
  const loginForm = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await doUserSignIn(formData);
      if (!response?.error) {
        router.push("/dashboard");
        toast("Login Successful");
      }
    } catch (error) {
      if (error) {
        toast("Login Failed. Please check your credentials and try again.");
      }
    }
  };
  return (
    <div className="max-w-md h-dvh mx-auto my-auto flex flex-col gap-10 justify-center">
      <p className="text-center text-5xl">Bookmark Store</p>
      <div>
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={loginForm.control}
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
              control={loginForm.control}
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
            {loginForm.formState.isSubmitting ? (
              <Button
                type="submit"
                variant={"default"}
                disabled={loginForm.formState.isSubmitting}
              >
                Authenticating <Spinner />
              </Button>
            ) : (
              <Button type="submit" variant={"default"}>
                Submit
              </Button>
            )}
          </form>
        </Form>
        <p className="mt-4">
          Don&apos;t have an account?{" "}
          <Button
            type="button"
            disabled={loginForm.formState.isSubmitting}
            variant="link"
            onClick={() => router.push("/auth/signup")}
            className="text-emerald-400 hover:text-emerald-300 p-0 text-md cursor-pointer"
          >
            Register
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
