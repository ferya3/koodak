import { DrawingStudio } from "@/features/studio/DrawingStudio";

export const metadata = { title: "استودیو نقاشی" };

export default function StudioPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">استودیو نقاشی 🎨</h1>
      <DrawingStudio />
    </div>
  );
}
