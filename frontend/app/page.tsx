import Image from "next/image";
import Link from "next/link";

const Page = async () => {
	return (
		<>
			<div className="landing">
				<h1>LoLBot</h1>
				<section className="brands">
					<div className="brand discord">
						<Image src="/icon_clyde_white_RGB.png" alt="Discord Clyde Logo" sizes="100%" width={0} height={0}></Image>
					</div>
					<div className="seperator"></div>
					<div className="brand lol">
						<Image src="/LoL_Logo_Flat_WHITE.png" alt="League of Legends Logo" sizes="100%" width={0} height={0}></Image>
					</div>
				</section>
				<span>(LoLBot is not associated with Discord or Riot Games)</span>

				<Link className="invite" target="_blank" href={process.env.DISCORD_INVITE || "/"}>Invite to Discord</Link>
			</div>
		</>
	)
}
export default Page;