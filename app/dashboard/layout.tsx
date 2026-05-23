import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayoutShell } from "./layout-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayoutShell
      user={{
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
      }}
    >
      {children}
    </DashboardLayoutShell>
  );
}
