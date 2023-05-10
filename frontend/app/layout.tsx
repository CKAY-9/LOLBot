import "./globals.scss"

export const metadata = {
	title: "LoLBot",
	description: "View League of Legends data in Discord",
	
}

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
    	<html lang="en">
      		<body>{children}</body>
    	</html>
  )
}
