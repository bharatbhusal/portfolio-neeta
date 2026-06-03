type AdminProjectsLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function AdminProjectsLayout({
	children,
}: AdminProjectsLayoutProps) {
	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
			{children}
		</main>
	);
}
