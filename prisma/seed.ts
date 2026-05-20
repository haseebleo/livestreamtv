import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Admin@2026!", 12);

  await prisma.user.upsert({
    where: { email: "admin@livestreamtv.pk" },
    update: {},
    create: { email: "admin@livestreamtv.pk", password: hash, name: "Admin", role: "admin" },
  });

  const defaultSettings = [
    { key: "site_name", value: "LiveStreamTV.pk" },
    { key: "site_tagline", value: "Pakistan's #1 Sports & Streaming Hub" },
    { key: "contact_email", value: "admin@livestreamtv.pk" },
    { key: "tmdb_api_key", value: "" },
    { key: "cricapi_key", value: "" },
    { key: "adsense_id", value: "" },
    { key: "ga_id", value: "" },
    { key: "footer_text", value: "© 2026 LiveStreamTV.pk. We do not host any streams." },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  const menuItems = [
    { label: "Home", href: "/", order: 1, menuName: "main" },
    { label: "Cricket", href: "/cricket", order: 2, menuName: "main" },
    { label: "Football", href: "/football", order: 3, menuName: "main" },
    { label: "Movies", href: "/movies", order: 4, menuName: "main" },
    { label: "TV Shows", href: "/tv-shows", order: 5, menuName: "main" },
    { label: "Live TV", href: "/live-tv", order: 6, menuName: "main" },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item }).catch(() => {});
  }

  const channels = [
    { name: "Geo News", country: "🇵🇰", category: "News", order: 1 },
    { name: "ARY News", country: "🇵🇰", category: "News", order: 2 },
    { name: "PTV Sports", country: "🇵🇰", category: "Sports", order: 3 },
    { name: "A Sports", country: "🇵🇰", category: "Sports", order: 4 },
    { name: "Hum TV", country: "🇵🇰", category: "Entertainment", order: 5 },
    { name: "BBC World", country: "🇬🇧", category: "News", order: 6 },
    { name: "CNN", country: "🇺🇸", category: "News", order: 7 },
    { name: "Sky Sports", country: "🇬🇧", category: "Sports", order: 8 },
    { name: "ESPN", country: "🇺🇸", category: "Sports", order: 9 },
    { name: "Al Jazeera", country: "🇶🇦", category: "News", order: 10 },
    { name: "Star Sports 1", country: "🇮🇳", category: "Sports", order: 11 },
    { name: "Discovery", country: "🌍", category: "Documentary", order: 12 },
  ];

  for (const ch of channels) {
    await prisma.channel.create({ data: ch }).catch(() => {});
  }

  const pages = [
    { title: "Privacy Policy", slug: "privacy", content: "# Privacy Policy\n\nThis Privacy Policy describes how LiveStreamTV.pk collects and uses your information.", status: "published" },
    { title: "Terms of Use", slug: "terms", content: "# Terms of Use\n\nBy using LiveStreamTV.pk you agree to these terms.", status: "published" },
    { title: "About Us", slug: "about", content: "# About Us\n\nLiveStreamTV.pk is Pakistan's #1 sports and entertainment hub.", status: "published" },
    { title: "Contact", slug: "contact", content: "# Contact Us\n\nEmail: admin@livestreamtv.pk", status: "published" },
    { title: "DMCA", slug: "dmca", content: "# DMCA\n\nWe take copyright seriously. Contact us to report infringing content.", status: "published" },
  ];

  for (const p of pages) {
    await prisma.page.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  console.log("✅ Database seeded");
}

main().catch(console.error).finally(() => prisma.$disconnect());
