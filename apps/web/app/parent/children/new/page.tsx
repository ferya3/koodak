import { NewChildForm } from "@/features/parent/NewChildForm";

export const metadata = { title: "افزودن فرزند" };

export default function NewChildPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <NewChildForm />
    </div>
  );
}
