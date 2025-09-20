import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Settings</h1>
          <p className="text-center text-muted-foreground mt-2">
            Manage your account preferences and privacy settings
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600">Advanced settings and preferences are under development.</p>
        </div>
      </div>
    </main>
  );
}