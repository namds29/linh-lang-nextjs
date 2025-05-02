"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { useState } from "react";
import authService from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [payload, setPayload] = useState({ username: "", password: "" });
  const onSubmit = async () => {
    console.log(payload);

    const res = await authService.login(payload);
    if (res.status === 200) {
      const token = await res.json();
      console.log(token);
      localStorage.setItem("accessToken", token.accessToken);
      localStorage.setItem("refreshToken", token.refreshToken);
      const decoded: any = jwtDecode(token.accessToken);
      if (decoded) {
        console.log(decoded);
        
        localStorage.setItem("role", decoded.roles);
        localStorage.setItem("sub", decoded.sub);
      }
      redirect("/products");
    }
  };
  return (
    <div
      className={cn(
        "container-fluid h-[100vh] bg-muted dark:bg-background flex flex-1 flex-col items-center justify-center gap-16 p-6 md:p-10"
      )}
    >
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-sm mt-2 text-balance">
                    Login to your Linh Lang Comp account
                  </p>
                </div>
                <div className="grid gap-3">
                  <label htmlFor="username">Username</label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    onChange={(e) =>
                      setPayload({ ...payload, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <label htmlFor="password">Password</label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline text-blue-600"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) =>
                      setPayload({ ...payload, password: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full" onClick={onSubmit}>
                  Login
                </Button>
                
              </div>
            </div>
            <div className="bg-primary/50 relative hidden md:block">
              <img
                src={"login-bg.jpg"}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
