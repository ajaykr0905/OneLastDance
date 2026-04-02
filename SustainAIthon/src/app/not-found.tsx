import Link from "next/link";
import { TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
        <TreePine className="h-10 w-10 text-green-500" />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">This page could not be found.</p>
      </div>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
