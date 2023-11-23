import { Inter, Space_Grotesk as SpaceGrotest } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = SpaceGrotest({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const fontCls = `${inter.variable} ${spaceGrotesk.variable}`;

export { inter, spaceGrotesk };

export default fontCls;
