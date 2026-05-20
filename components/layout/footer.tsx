import Link from "next/link";
import { Tv } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l-4 3 4 3V10z" />
    <rect x="3" y="5" width="18" height="14" rx="2" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const footerLinks = {
  Sports: [
    { href: "/cricket", label: "Live Cricket" },
    { href: "/football", label: "Football Scores" },
    { href: "/live-tv", label: "Sports TV" },
  ],
  Entertainment: [
    { href: "/movies", label: "Movies Guide" },
    { href: "/tv-shows", label: "TV Shows" },
    { href: "/live-tv", label: "Live TV" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
    { href: "/dmca", label: "DMCA" },
    { href: "/contact", label: "Contact Us" },
  ],
};

const socialIcons = [XIcon, InstagramIcon, YoutubeIcon, FacebookIcon];

export default function Footer() {
  return (
    <footer className="border-t border-purple-900/20 bg-bg-secondary mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Tv className="w-6 h-6 text-purple-400" />
              <div>
                <span className="text-lg font-black gradient-text">LiveStream</span>
                <span className="text-xs font-bold text-purple-400/70 ml-1">TV.PK</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your ultimate destination for live sports scores, streaming guides, and entertainment news.
              Never miss a match or a great show.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-600/30 border border-white/5 hover:border-purple-500/30 flex items-center justify-center transition-all"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-purple-300 transition-colors">
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
          <p className="text-xs text-gray-500">
            © 2026 LiveStreamTV.pk — All rights reserved. We do not host any streams or content.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
