export const metadata = { title: "Settings | Admin | LiveStreamTV.pk" };

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Site Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Configure API keys, ads, and site preferences</p>
      </div>

      {/* API Keys */}
      <div className="glass rounded-2xl p-6 space-y-5">
        <h2 className="font-bold text-white border-b border-white/5 pb-3">🔑 API Configuration</h2>
        {[
          { label: "TMDB API Key", key: "NEXT_PUBLIC_TMDB_API_KEY", placeholder: "Get free key at themoviedb.org", hint: "Used for movies and TV shows data" },
          { label: "CricAPI Key", key: "CRICAPI_KEY", placeholder: "Get key at cricapi.com", hint: "Used for live cricket scores" },
          { label: "Google Analytics ID", key: "NEXT_PUBLIC_GA_ID", placeholder: "G-XXXXXXXXXX", hint: "Required before AdSense application" },
          { label: "AdSense Publisher ID", key: "NEXT_PUBLIC_ADSENSE_ID", placeholder: "ca-pub-XXXXXXXXXXXXXXXXX", hint: "From Google AdSense dashboard" },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-sm font-semibold text-gray-300 block mb-1.5">{field.label}</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={field.placeholder}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <button className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 text-sm font-medium hover:bg-purple-600/30 transition-colors">
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">💡 {field.hint}</p>
          </div>
        ))}
      </div>

      {/* Site Info */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-white border-b border-white/5 pb-3">🌐 Site Information</h2>
        {[
          { label: "Site Name", placeholder: "LiveStreamTV.pk", value: "LiveStreamTV.pk" },
          { label: "Tagline", placeholder: "Pakistan's #1 Sports Hub", value: "" },
          { label: "Contact Email", placeholder: "admin@livestreamtv.pk", value: "" },
          { label: "Social — Twitter", placeholder: "@livestreamtv_pk", value: "" },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-sm font-semibold text-gray-300 block mb-1.5">{field.label}</label>
            <input
              type="text"
              defaultValue={field.value}
              placeholder={field.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        ))}
        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Save Settings
        </button>
      </div>

      {/* Ad Slots */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-white border-b border-white/5 pb-3">💰 AdSense Slots</h2>
        <div className="space-y-3">
          {[
            { slot: "Header Banner (728x90)", status: "Pending", location: "All pages — top" },
            { slot: "In-Content (300x250)", status: "Pending", location: "Match pages — mid" },
            { slot: "Sidebar (300x600)", status: "Pending", location: "Desktop — right" },
            { slot: "Footer Banner (728x90)", status: "Pending", location: "All pages — bottom" },
          ].map((ad, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
              <div>
                <p className="text-sm font-semibold text-white">{ad.slot}</p>
                <p className="text-xs text-gray-400">{ad.location}</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {ad.status}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 bg-blue-500/5 border border-blue-500/15 rounded-xl p-3">
          💡 <strong className="text-blue-400">To enable AdSense:</strong> First add your Publisher ID above, then replace the &ldquo;ad-slot&rdquo; divs in each page with your actual AdSense code blocks.
        </p>
      </div>
    </div>
  );
}
