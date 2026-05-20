import { BarChart3, TrendingUp, Users, Eye, Clock, Zap, Globe, DollarSign } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | LiveStreamTV.pk",
};

const stats = [
  { label: "Daily Visitors", value: "12,450", change: "+18%", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { label: "Page Views", value: "84,320", change: "+24%", icon: Eye, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { label: "Avg Session", value: "4m 32s", change: "+8%", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { label: "AdSense Est.", value: "$42.80", change: "+31%", icon: DollarSign, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
];

const topPages = [
  { page: "/cricket", views: "28,450", bounce: "32%", trend: "+12%" },
  { page: "/football", views: "21,300", bounce: "28%", trend: "+9%" },
  { page: "/movies", views: "18,750", bounce: "35%", trend: "+15%" },
  { page: "/live-tv", views: "10,200", bounce: "22%", trend: "+7%" },
  { page: "/tv-shows", views: "6,120", bounce: "40%", trend: "+5%" },
];

const recentActivity = [
  { event: "New visitor spike from UK", time: "2 min ago", type: "traffic" },
  { event: "Cricket page trending on Google", time: "15 min ago", type: "seo" },
  { event: "AdSense approval check pending", time: "1h ago", type: "ads" },
  { event: "Football scores API updated", time: "2h ago", type: "api" },
  { event: "TMDB movie data synced", time: "3h ago", type: "api" },
];

const activityColors: Record<string, string> = {
  traffic: "bg-blue-500",
  seo: "bg-green-500",
  ads: "bg-amber-500",
  api: "bg-purple-500",
};

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back — here&apos;s your site overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-green-400">Site Live</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`glass rounded-2xl p-5 border ${stat.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-black text-white mb-0.5">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Top Pages
            </h2>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>
          <div className="space-y-3">
            {topPages.map((page, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <span className="text-xs font-bold text-gray-500 w-4">{i + 1}</span>
                <code className="text-sm font-mono text-purple-300 flex-1">{page.page}</code>
                <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400">
                  <span>{page.views} views</span>
                  <span>{page.bounce} bounce</span>
                </div>
                <span className="text-xs font-bold text-green-400">{page.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-bold text-white flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-amber-400" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activityColors[item.type]}`} />
                <div>
                  <p className="text-sm text-gray-200">{item.event}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AdSense & SEO Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5 border border-amber-500/15">
          <h2 className="font-bold text-white flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-amber-400" />
            AdSense Setup Checklist
          </h2>
          <div className="space-y-2">
            {[
              { task: "Privacy Policy page", done: false },
              { task: "Terms of Service page", done: false },
              { task: "About Us page", done: false },
              { task: "Contact page", done: false },
              { task: "Google Analytics connected", done: false },
              { task: "Submit site to Google Search Console", done: false },
              { task: "Apply for AdSense", done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${item.done ? "bg-green-500 border-green-500" : "border-gray-600"}`}>
                  {item.done && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={item.done ? "text-green-400 line-through" : "text-gray-300"}>{item.task}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-blue-500/15">
          <h2 className="font-bold text-white flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-blue-400" />
            SEO Status
          </h2>
          <div className="space-y-3">
            {[
              { metric: "Meta Titles", status: "✅ Configured", color: "text-green-400" },
              { metric: "Meta Descriptions", status: "✅ Set on all pages", color: "text-green-400" },
              { metric: "Structured Data", status: "⚠️ Pending", color: "text-amber-400" },
              { metric: "Sitemap.xml", status: "⚠️ Generate needed", color: "text-amber-400" },
              { metric: "Robots.txt", status: "⚠️ Pending", color: "text-amber-400" },
              { metric: "Page Speed", status: "🔄 Optimizing...", color: "text-blue-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{item.metric}</span>
                <span className={item.color}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add TV Channel", icon: "📡", color: "hover:border-red-500/30" },
            { label: "Feature a Movie", icon: "🎬", color: "hover:border-pink-500/30" },
            { label: "Update Scores", icon: "🏏", color: "hover:border-green-500/30" },
            { label: "Site Settings", icon: "⚙️", color: "hover:border-purple-500/30" },
          ].map((action, i) => (
            <button key={i} className={`p-4 rounded-xl bg-white/3 border border-white/5 ${action.color} transition-all text-center hover:bg-white/5`}>
              <span className="text-2xl block mb-2">{action.icon}</span>
              <span className="text-xs font-semibold text-gray-300">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
