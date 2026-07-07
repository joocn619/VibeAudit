import React from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: any = null;
  let repoCount = 0;

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = profileData;

    const { count } = await supabase
      .from("repos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    repoCount = count || 0;
  }

  const displayRepoCount = repoCount

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative">
      {/* Ambient Radial Gradient Mesh background */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Sidebar */}
      <DashboardSidebar
        userEmail={user?.email || ""}
        plan={profile?.plan ?? "free"}
        onboardingCompleted={profile?.onboarding_completed ?? false}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader repoCount={displayRepoCount} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
