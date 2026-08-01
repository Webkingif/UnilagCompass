import type { Metadata } from 'next';
import './globals.css'; // Global styles
import { InputProvider } from '@/context/InputContext';
import { MapProvider } from "@/context/MapContext"

export const metadata: Metadata = {
	title: 'unilagcompass | UNILAG Campus Navigation',
	description: 'Navigation and campus route guide for the University of Lagos (UNILAG)',
	keywords: [
		"UNILAG",
		"University of Lagos",
		"Campus map",
		"Unilag map",
		"UnilagCompass",
		"Shortest route",
		"Student navigation",
		"Akokites"


	],
	authors: [{ name: "Idowu Oluwafemi (Webkingif)" }],
	creator: "Idowu Oluwafemi",
	openGraph: {
		type: "website",
		locale: "en_NG",
		url: "https://unilagcompass.netlify.app",
		title: "UnilagCompass | Smart Campus Navigation",
		description: "Find the shortest and most optimal routes between two locations inside the university of Lagos (UNILAG) campus.",
		siteName: "UnilagCompass",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "UnilagCompass campus Map Routing"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "UnilagCompass | Smart Campus Navigation",
		description: "Find the shortest route across the Unilag campus easily.",
		images: ["/og-image.png"],
	},
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png"
	}

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<body className="h-full antialiased bg-slate-50 text-slate-900" suppressHydrationWarning>
				<MapProvider>
					<InputProvider>
						{children}
					</InputProvider>
				</MapProvider>
			</body>
		</html>
	);
}
