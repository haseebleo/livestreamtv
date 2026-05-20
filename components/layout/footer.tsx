import Link from "next/link";
import { Tv } from "lucide-react";

const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
    { href: "/search", label: "Search" },
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
        background: "#0a0a0a",
        borderTop: "1px solid #1e1e1e",
        marginTop: "4rem",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 32,
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 2", minWidth: 0 }}>
            <Link
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 14 }}
              aria-label="LiveStreamTV.pk"
            >
              <Tv style={{ width: 22, height: 22, color: "#e50914" }} aria-hidden="true" />
              <div>
                <span style={{ fontSize: 17, fontWeight: 900, color: "#ffffff" }}>LiveStream</span>
                <span style={{ fontSize: 17, fontWeight: 900, color: "#e50914" }}>TV</span>
                <span style={{ fontSize: 17, fontWeight: 900, color: "#ffffff" }}>.pk</span>
              </div>
            </Link>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6b7280", maxWidth: 300, marginBottom: 18 }}>
              Your ultimate destination for live sports scores, streaming guides, and entertainment news.
              Never miss a match or a great show again.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-link"
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
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#ffffff",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 14,
                }}
              >
                {title}
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider" style={{ margin: "2rem 0" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: 12, color: "rgba(107,114,128,0.8)" }}>
            © 2026 LiveStreamTV.pk. We do not host any content.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00b341",
                boxShadow: "0 0 6px rgba(0,179,65,0.6)",
                display: "inline-block",
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: 12, color: "rgba(107,114,128,0.8)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
