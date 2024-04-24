import { Form } from "@/components/ui/form";
import Input from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/api/mutations/auth/use-auth-mutations";
import { localStorageFn } from "@/utils/localstorage";
import { Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-5 sm:w-[350px]">
      <div className="flex flex-col space-y-2 py-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-2xl">
          Welcome Back
        </h1>
        <p className="text-muted-mz-foreground sm:text-sm">
          Enter your credentials to access your account
        </p>
      </div>

      <LoginForm />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
      </div>

      <div className="flex justify-center gap-1 text-center text-sm">
        <p className="text-muted-mz-foreground">Don&apos;t have an account?</p>
        <Link className="font-medium" to={"/register"}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}

function LoginForm() {
  const { mutate, isPending } = useLoginMutation();
  const navigate = useNavigate();

  const LoginSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    mutate(data, {
      onSuccess: (res) => {
        localStorageFn.setItem("token", res.token);
        navigate("/dashboard");
      },
      onError: (error) => {
        toast.error(`${error.message}`);
      },
    });
  };

  return (
    <Form schema={LoginSchema} onSubmit={onSubmit}>
      {({ register, formState: { errors } }) => (
        <div className="flex flex-col gap-5">
          <Input
            isDisabled={isPending}
            label="Username"
            size="md"
            radius="sm"
            placeholder="Enter your username"
            isInvalid={!!errors.username}
            errorMessage={errors?.username?.message}
            {...register("username")}
          />
          <Input
            isDisabled={isPending}
            size="md"
            radius="sm"
            type="password"
            label="Password"
            placeholder="Enter your password"
            isInvalid={!!errors.password}
            errorMessage={errors?.password?.message}
            {...register("password")}
          />
          <Button
            isLoading={isPending}
            type="submit"
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary-mz px-4 py-2 text-sm  text-primary-mz-foreground shadow transition-colors hover:bg-primary-mz/90 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          >
            Sign In
          </Button>
        </div>
      )}
    </Form>
  );
}
