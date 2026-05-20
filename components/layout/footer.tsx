import Link from "next/link";
import { Tv } from "lucide-react";

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const footerLinks = {
  Sports: [
    { href: "/cricket", label: "Live Cricket" },
    { href: "/football", label: "Football Scores" },
    { href: "/live-tv", label: "Live TV" },
  ],
  Entertainment: [
    { href: "/movies", label: "Movies Guide" },
    { href: "/tv-shows", label: "TV Shows" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
    { href: "/dmca", label: "DMCA" },
    { href: "/contact", label: "Contact Us" },
    { href: "/about", label: "About" },
  ],
};

const socialLinks = [
  { href: "https://x.com", label: "X (Twitter)", Icon: XIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://youtube.com", label: "YouTube", Icon: YoutubeIcon },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0e0e1a",
        borderTop: "1px solid #1e1e2e",
        marginTop: "4rem",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group" aria-label="LiveStreamTV.pk">
              <Tv className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" aria-hidden="true" />
              <div>
                <span className="text-lg font-black gradient-text">LiveStream</span>
                <span
                  className="text-xs font-bold ml-1"
                  style={{ color: "rgba(167,139,250,0.6)" }}
                >
                  TV.PK
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#9ca3af" }}>
              Your ultimate destination for live sports scores, streaming guides, and entertainment
              news. Never miss a match or a great show again.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-link w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3
                className="text-xs font-bold mb-4 uppercase tracking-widest"
                style={{ color: "#fff" }}
              >
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "#9ca3af" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(156,163,175,0.6)" }}>
            © 2026 LiveStreamTV.pk. We do not host any content.
          </p>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "#10b981",
                boxShadow: "0 0 6px rgba(16,185,129,0.6)",
              }}
              aria-hidden="true"
            />
            <span className="text-xs" style={{ color: "rgba(156,163,175,0.6)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
