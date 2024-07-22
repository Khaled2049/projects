"use client";
import React from "react";
import { Button } from "../../components/ui/button";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push("/sign-in");
  };

  return (
    <div>
      <Header>
        <div className="flex w-fit items-center justify-center gap-2">
          <p className="document-title">Share</p>
        </div>
        <div>
          <Button onClick={handleSignInClick}>Sign In</Button>
        </div>
      </Header>
    </div>
  );
};

export default Home;
