"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/store/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({
        email: usernameOrEmail,
        username: usernameOrEmail,
        password,
      });
      console.log(data, "ye data hai");
      login(data.token);
      toast.success("Registered successfully");
      router.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username or email to login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email-create-account">Email</FieldLabel>
                <Input
                  id="email-create-account"
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="johncena or johncena@example.com"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password-create-account">
                  Password
                </FieldLabel>
                <Input
                  id="password-create-account"
                  placeholder="*******"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              <Field>
                <Button className="w-full">Login</Button>
              </Field>
              <Field className="text-sm text-muted-foreground">
                <FieldLabel>
                  Don't have an account?
                  <Link
                    href="/register"
                    className="ml-1 text-primary hover:underline"
                  >
                    Sign Up
                  </Link>
                </FieldLabel>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
