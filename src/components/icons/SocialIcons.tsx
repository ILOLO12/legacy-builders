// Hand-drawn brand marks (not from lucide, which only ships single-color
// outline icons) so share buttons can show each network's real logo/colors.
import type { SVGProps } from "react";

export const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M15.6 12.6h-2.1V19h-2.6v-6.4H9.4v-2.2h1.5V9.1c0-1.5.9-2.9 3.1-2.9.9 0 1.5.1 1.5.1l-.1 2.1h-1.1c-1.1 0-1.3.5-1.3 1.2v1.8h2.4l-.3 2.2Z"
      fill="#fff"
    />
  </svg>
);

export const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="12" fill="#000" />
    <path
      d="M6.2 6.5 10.9 12.7 6.1 17.9h1.4l4.2-4.5 3.4 4.5h3.7l-4.9-6.5L18 6.5h-1.4l-3.9 4.1-3.1-4.1H6.2Zm2 1h1.6l7.9 10.4h-1.6L8.2 7.5Z"
      fill="#fff"
    />
  </svg>
);

export const LinkedInIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="12" fill="#0A66C2" />
    <path
      d="M8.9 9.6H6.7V17h2.2V9.6ZM7.8 8.6c.75 0 1.2-.5 1.2-1.1 0-.65-.45-1.1-1.2-1.1s-1.2.45-1.2 1.1c0 .6.45 1.1 1.2 1.1ZM17.4 17v-4.2c0-2.2-1.2-3.3-2.8-3.3-1.3 0-1.9.7-2.2 1.2v-1H10.2c0 .6 0 8.3 0 8.3h2.2v-4.1c0-.2 0-.5.1-.65.2-.5.6-1 1.3-1 .9 0 1.3.7 1.3 1.75V17h2.3Z"
      fill="#fff"
    />
  </svg>
);

export const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      d="M16.6 7.4a5.9 5.9 0 0 0-9.4 7.1L6.4 18l3.6-.9a5.9 5.9 0 0 0 8.4-5.3c0-1.6-.6-3.1-1.8-4.4Zm-4.6 9.1a4.9 4.9 0 0 1-2.5-.7l-.2-.1-1.9.5.5-1.8-.1-.2a4.9 4.9 0 1 1 4.2 2.3Zm2.7-3.7c-.15-.1-.9-.45-1-.5-.15-.05-.25-.1-.35.1-.1.15-.4.5-.5.6-.1.1-.2.1-.35.05a4 4 0 0 1-1.2-.75 4.5 4.5 0 0 1-.8-1c-.1-.15 0-.25.05-.35.05-.05.1-.15.15-.2.05-.1.1-.15.15-.25.05-.1 0-.2 0-.25 0-.1-.35-.85-.5-1.15-.1-.3-.25-.25-.35-.25h-.3c-.1 0-.25.05-.4.2-.15.15-.5.5-.5 1.2s.55 1.4.6 1.5c.1.15 1.05 1.6 2.55 2.25.35.15.65.25.85.3.35.1.7.1.95.05.3-.05.9-.35 1-.75.1-.35.1-.65.1-.75-.05-.05-.15-.1-.3-.15Z"
      fill="#fff"
    />
  </svg>
);
