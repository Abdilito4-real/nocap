import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5V11h9V6.5A4.5 4.5 0 0 0 12 2z" />
      <path d="M2.5 11h19c0 2.5-4.25 5-9.5 5S2.5 13.5 2.5 11z" />
    </svg>
  ),
  google: (props: SVGProps<SVGSVGElement>) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.6-4.83 1.6-4.54 0-8.28-3.74-8.28-8.28s3.74-8.28 8.28-8.28c2.48 0 4.38.94 5.75 2.24l2.72-2.72C19.4 1.45 16.48 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.1 0 12-4.93 12-12.08 0-.8-.08-1.56-.2-2.32H12.48z"
      />
    </svg>
  ),
};
