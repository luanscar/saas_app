import { auth } from "@/auth";

import MainSidebar from "@/components/sidebar/main-sidebar";

export default async function AgencyLayoutId({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	if (!session) return;
	return (
		<main className="flex h-screen">
			<MainSidebar user={session.user} />
			{children}
		</main>
	);
}
