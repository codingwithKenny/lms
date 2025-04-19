"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react"; // or any icon library


const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { sessionId, signOut } = useAuth(); // Get sessionId & signOut function
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const userData = {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        role: user.publicMetadata.role || "user",
        sessionId: sessionId,
      };

      // Store user data in sessionStorage
      sessionStorage.setItem("userData", JSON.stringify(userData));

      // Redirect based on role
      router.push(`/${userData.role}`);
    }
  }, [isLoaded, isSignedIn, user, sessionId, router]);

  // Handle logout
  const handleLogout = () => {
    signOut();
    sessionStorage.removeItem("userData"); // Clear session storage
    router.push("/sign-in");
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Initializing Authentication...</p>
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-purple-50">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} />
            E - Portal
          </h1>
          <h2 className="text-gray-400">Sign in to your account</h2>
          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2 relative">
            <Clerk.Label className="text-xs text-gray-500">Password</Clerk.Label>
            <div className="relative">
              <Clerk.Input
                type={showPassword ? "text" : "password"}
                required
                className="p-2 pr-10 w-full rounded-md ring-1 ring-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <SignIn.Action
            submit
            className="bg-purple-500 text-white my-1 rounded-md text-sm p-[10px]"
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
