import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = SpaceGrotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

const fontCls = `${inter.variable} ${spaceGrotesk.variable}`;

export { inter, spaceGrotesk };

export default fontCls;
