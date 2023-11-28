import * as React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  pCls?: string;
}

const Logo = ({ pCls }: LogoProps) => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/assets/images/site-logo.svg"
        alt="NextOverflow"
        width={23}
        height={23}
      />

      <p
        className={
          pCls ||
          "h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden"
        }
      >
        Next<span className="text-primary-500">Overflow</span>
      </p>
    </Link>
  );
};

export default Logo;
