import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarships",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Scholarships</h1>
          <p className="text-center text-muted-foreground mt-2">
            Discover and apply for scholarships that match your profile
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600">Scholarship discovery and application features are under development.</p>
        </div>
      </div>
    </main>
  );
}