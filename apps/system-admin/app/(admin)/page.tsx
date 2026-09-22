import { Server, Users, Activity, AlertCircle } from "lucide-react";

export default function PlatformHealth() {
  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative overflow-hidden rounded-3xl p-6 md:p-10 border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#00F2FE] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-[#D4AF37] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Platform Overview
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
            Monitor the global health, usage metrics, and active alerts across all client organizations on the Tavonza network.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Active Organizations", value: "142", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]", icon: <Users className="w-5 h-5 text-[#D4AF37]" /> },
          { label: "Platform Uptime", value: "99.99%", color: "text-[#00F2FE]", bg: "bg-[#00F2FE]", icon: <Server className="w-5 h-5 text-[#00F2FE]" /> },
          { label: "API Requests (24h)", value: "12.4M", color: "text-gray-300", bg: "bg-gray-400", icon: <Activity className="w-5 h-5 text-gray-400" /> },
          { label: "Active Support Alerts", value: "3", color: "text-red-400", bg: "bg-red-500", icon: <AlertCircle className="w-5 h-5 text-red-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl border border-white/5 bg-white/[0.02] shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className={`text-4xl font-bold mb-1 tracking-tight ${stat.color} drop-shadow-sm`}>{stat.value}</h3>
              <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events List */}
      <div className="bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <h2 className="text-lg md:text-xl font-bold text-white mb-6 tracking-tight">Recent Platform Events</h2>
        <div className="space-y-1">
          {[
             { time: "10 mins ago", event: "New Organization Created: 'Bella Italia'", type: "info" },
             { time: "1 hour ago", event: "API Latency Spike Detected (US-East)", type: "warning" },
             { time: "3 hours ago", event: "Database Backup Completed", type: "success" },
             { time: "5 hours ago", event: "Support Token Revoked: 'Sushi Paradise'", type: "default" },
          ].map((log, i) => (
             <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-4 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors">
               <span className="text-xs text-gray-500 sm:w-24 shrink-0 uppercase tracking-wider">{log.time}</span>
               <span className={`w-fit px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-lg border ${
                 log.type === 'info' ? 'bg-[#00F2FE]/10 text-[#00F2FE] border-[#00F2FE]/20' :
                 log.type === 'warning' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20' :
                 log.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                 'bg-white/5 text-gray-400 border-white/10'
               }`}>
                 {log.type}
               </span>
               <span className="text-gray-300 text-sm md:text-base font-medium">{log.event}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
