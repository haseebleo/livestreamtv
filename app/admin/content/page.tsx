import { Plus, Edit2, Trash2, Eye, Search } from "lucide-react";

export const metadata = { title: "Content Manager | Admin | LiveStreamTV.pk" };

const featuredContent = [
  { id: 1, title: "Asia Cup 2026 Live Coverage", type: "Cricket", status: "Published", views: "8,450", date: "2026-05-20" },
  { id: 2, title: "Premier League Highlights", type: "Football", status: "Published", views: "5,230", date: "2026-05-19" },
  { id: 3, title: "Where to Watch Avengers Doomsday", type: "Movie Guide", status: "Published", views: "12,100", date: "2026-05-18" },
  { id: 4, title: "Top 10 Cricket Matches This Week", type: "Article", status: "Draft", views: "0", date: "2026-05-20" },
  { id: 5, title: "Champions League Final Preview", type: "Football", status: "Draft", views: "0", date: "2026-05-20" },
];

const typeColors: Record<string, string> = {
  Cricket: "text-green-400 bg-green-500/10 border-green-500/20",
  Football: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "Movie Guide": "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Article: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function ContentPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Content Manager</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage featured articles, guides and pages</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Content
        </button>
      </div>

      {/* Search */}
      <div className="glass rounded-xl flex items-center gap-3 px-4 py-2.5">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search content..."
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Content table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-4">Title</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-4 hidden sm:table-cell">Type</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-4 hidden md:table-cell">Views</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-4">Status</th>
                <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-4 hidden lg:table-cell">Date</th>
                <th className="text-right text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {featuredContent.map((item) => (
                <tr key={item.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-white truncate max-w-xs">{item.title}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${typeColors[item.type] || "text-gray-400"}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-300 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {item.views}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      item.status === "Published"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-blue-400 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
