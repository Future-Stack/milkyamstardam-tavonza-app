import { getCurrentUser } from "../../lib/dal";
import { ProfileForms } from "./ProfileForms";

export default async function ProfilePage() {
  // The admin layout already resolved this; React.cache makes it a free lookup.
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          Profile &amp; Security
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Manage your personal account details and security preferences.
        </p>
      </div>

      <ProfileForms
        user={{
          name: user.name,
          email: user.email,
          contactNo: user.contactNo ?? "",
          avatar: user.avatar ?? null,
        }}
      />
    </div>
  );
}
