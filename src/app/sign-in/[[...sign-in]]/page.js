"use client";

import { SignIn, useUser, useAuth } from "@clerk/nextjs";

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
      <SignIn signUpUrl={"/"} path="/sign-in" routing="path" />
    </div>
  );
};

export default LoginPage;
