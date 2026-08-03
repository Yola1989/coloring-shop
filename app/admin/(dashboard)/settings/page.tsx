import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <SettingsForm
        initial={{
          whatsappNumber: settings.whatsappNumber,
          homepageVideoUrl: settings.homepageVideoUrl,
          upsellEnabled: settings.upsellEnabled,
          upsellPrice: settings.upsellPrice ? String(settings.upsellPrice) : "",
          upsellTitle: settings.upsellTitle,
          upsellSubtitle: settings.upsellSubtitle,
        }}
      />
    </div>
  );
}
