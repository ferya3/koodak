import { CustomPlay } from "@/features/custom-games/CustomPlay";

export const metadata = { title: "بازی ساخت خانواده" };

export default async function KidsCustomGame({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomPlay id={id} />;
}
