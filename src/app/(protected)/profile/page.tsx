"use client";

import { Card, Avatar, AvatarFallback, Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Settings, Award, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="pb-[120px]">
      <header className="pt-8 pb-6 flex justify-between items-center">
        <h1 className="text-heading">Profile</h1>
        <button className="bg-none border-none cursor-pointer text-midnight p-2 rounded-button transition-all hover:bg-mist">
          <Settings size={24} />
        </button>
      </header>

      <div className="flex flex-col gap-4">
        <Card variant="default" className="min-h-[120px]">
          <div className="flex items-center gap-4">
            <Avatar size="xl"><AvatarFallback>U</AvatarFallback></Avatar>
            <div>
              <h2 className="text-heading mb-1">User Name</h2>
              <p className="text-body">Wellness Enthusiast</p>
            </div>
          </div>
        </Card>

        <Card variant="lavender-mist" className="min-h-[120px]">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center flex flex-col items-center gap-2">
              <Award className="text-lavender" size={32} />
              <p className="text-heading m-0">12</p>
              <p className="text-caption">Achievements</p>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <TrendingUp className="text-lavender" size={32} />
              <p className="text-heading m-0">85</p>
              <p className="text-caption">Wellness Score</p>
            </div>
          </div>
        </Card>

        <Card variant="default" className="min-h-[200px]">
          <div className="py-4 border-b border-mist cursor-pointer transition-colors hover:text-lavender">
            <span className="text-body">Personal Info</span>
          </div>
          <div className="py-4 border-b border-mist cursor-pointer transition-colors hover:text-lavender">
            <span className="text-body">Goals</span>
          </div>
          <div className="py-4 border-b border-mist cursor-pointer transition-colors hover:text-lavender">
            <span className="text-body">Notifications</span>
          </div>
          <div className="py-4 cursor-pointer transition-colors hover:text-lavender">
            <span className="text-body">Privacy</span>
          </div>
        </Card>

        <Button variant="secondary" className="w-full mt-2" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
