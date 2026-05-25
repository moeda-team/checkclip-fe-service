"use client";

import {
  DollarSign,
  Handshake,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Phone,
  Mail,
  FileText,
  Calendar,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Oct", revenue: 2900, target: 3000 },
  { month: "Nov", revenue: 3100, target: 3000 },
  { month: "Dec", revenue: 3600, target: 3200 },
  { month: "Jan", revenue: 2800, target: 3200 },
  { month: "Feb", revenue: 3200, target: 3400 },
  { month: "Mar", revenue: 4000, target: 3500 },
];

const pipelineData = [
  { stage: "Discovery", value: 900 },
  { stage: "Qualificat.", value: 1200 },
  { stage: "Proposal", value: 3500 },
  { stage: "Closed Won", value: 2600 },
  { stage: "Closed Lost", value: 400 },
];

const leadSourceData = [
  { name: "Organic Search", value: 245, percent: 28, color: "#7C3AED" },
  { name: "Paid Search", value: 198, percent: 23, color: "#10B981" },
  { name: "Social Media", value: 156, percent: 18, color: "#F59E0B" },
  { name: "Direct", value: 132, percent: 15, color: "#EC4899" },
  { name: "Referral", value: 89, percent: 10, color: "#06B6D4" },
  { name: "Email", value: 52, percent: 6, color: "#EF4444" },
];

const recentActivities = [
  {
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
    title: "Product demo with Aero Dynamics - DX Platform requirements review",
    person: "Suzuki Hana",
    time: "14:00",
  },
  {
    icon: Mail,
    color: "bg-blue-100 text-blue-600",
    title: "Sent proposal document to Crystal Networks for Network Upgrade project",
    person: "Watanabe Riko",
    time: "11:30",
  },
  {
    icon: Phone,
    color: "bg-green-100 text-green-600",
    title: "Follow-up call regarding Q2 contract renewal terms",
    person: "Ito Daichi",
    time: "10:15",
  },
  {
    icon: Users,
    color: "bg-orange-100 text-orange-600",
    title: "Updated contact preferences - prefers communication via email only",
    person: "Takahashi Mei",
    time: "09:45",
  },
];

const dealsClosingSoon = [
  {
    name: "Infinity AI Module",
    company: "Infinity Solutions",
    value: "¥18,000,000",
    progress: 90,
    stage: "Negotiation",
    due: "2026-03-25",
  },
  {
    name: "Crystal Network Upgrade",
    company: "Crystal Networks",
    value: "¥8,200,000",
    progress: 85,
    stage: "Negotiation",
    due: "2026-03-30",
  },
  {
    name: "Aero DX Platform",
    company: "Aero Dynamics Inc.",
    value: "¥12,500,000",
    progress: 75,
    stage: "Proposal",
    due: "2026-04-15",
  },
  {
    name: "Jupiter Hosting Deal",
    company: "Jupiter Cloud",
    value: "¥7,200,000",
    progress: 55,
    stage: "Proposal",
    due: "2026-04-20",
  },
  {
    name: "Delta Cloud Migration",
    company: "Delta Systems Ltd.",
    value: "¥15,000,000",
    progress: 60,
    stage: "Proposal",
    due: "2026-04-30",
  },
];

const teamPerformance = [
  {
    initials: "TY",
    name: "Tanaka Yuki",
    role: "Admin",
    revenue: "¥32,200,000",
    deals: 4,
    progress: 80,
    color: "bg-purple-500",
  },
  {
    initials: "SM",
    name: "Sato Mika",
    role: "Manager",
    revenue: "¥26,000,000",
    deals: 3,
    progress: 65,
    color: "bg-blue-500",
  },
  {
    initials: "KR",
    name: "Kobayashi Ren",
    role: "Member",
    revenue: "¥32,000,000",
    deals: 3,
    progress: 79,
    color: "bg-green-500",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  sub,
  change,
  changePositive,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: string;
  sub: string;
  change: string;
  changePositive: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span
          className={`flex items-center text-xs font-semibold ${
            changePositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {changePositive ? (
            <TrendingUp className="w-3 h-3 mr-0.5" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-0.5" />
          )}
          {change}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue (MTD)"
          value="¥38,500,000"
          sub="vs. ¥33,200,000 last month"
          change="+16.0%"
          changePositive
          icon={DollarSign}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Active Deals"
          value="8"
          sub="Total pipeline: ¥90,700,000"
          change="+2"
          changePositive
          icon={Handshake}
          iconBg="bg-teal-100"
          iconColor="text-teal-600"
        />
        <StatCard
          title="New Contacts (MTD)"
          value="47"
          sub="Conversion rate: 18.2%"
          change="+12.5%"
          changePositive
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Campaign ROI"
          value="324%"
          sub="8 active campaigns"
          change="-5.2%"
          changePositive={false}
          icon={Target}
          iconBg="bg-orange-100"
          iconColor="text-orange-500"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue vs Target */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Revenue vs Target</h3>
              <p className="text-xs text-gray-400">Past 6 months (10k JPY)</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-52 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3, fill: "#7C3AED" }} name="Revenue" />
                <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="4 3" dot={false} name="Target" />
                <Legend
                  iconType="plainline"
                  iconSize={16}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(value) => (
                    <span style={{ color: "#6B7280" }}>
                      {value === "revenue" ? "→ Revenue" : "⇢ Target"}
                    </span>
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline by Stage */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="mb-1">
            <h3 className="text-sm font-semibold text-gray-900">Pipeline by Stage</h3>
            <p className="text-xs text-gray-400">Deal count & value (10k JPY)</p>
          </div>
          <div className="h-52 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                />
                <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Lead Sources</h3>
            <p className="text-xs text-gray-400">Distribution by channel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={52}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {leadSourceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
                    formatter={(value, name) => [`${value}`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {leadSourceData.map((src) => (
                <div key={src.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                    <span className="text-gray-600 truncate">{src.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-gray-900 font-medium">{src.value}</span>
                    <span className="text-gray-400">{src.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-xs text-purple-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-72 pr-1">
            {recentActivities.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-700 leading-snug line-clamp-2">{act.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{act.person}</span>
                      <span className="flex items-center gap-0.5 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {act.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deals Closing Soon */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Deals Closing Soon</h3>
            <button className="text-xs text-purple-600 font-medium hover:underline">View Pipeline</button>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-72 pr-1">
            {dealsClosingSoon.map((deal, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{deal.name}</p>
                    <p className="text-xs text-gray-400 truncate">{deal.company}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-gray-900">{deal.value}</p>
                    <p className="text-xs text-gray-400">{deal.progress}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${deal.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    deal.stage === "Negotiation"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {deal.stage}
                  </span>
                  <span className="text-xs text-gray-400">Due: {deal.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Team Performance</h3>
            <button className="text-xs text-purple-600 font-medium hover:underline">Details</button>
          </div>
          <div className="space-y-4">
            {teamPerformance.map((member, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${member.color}`}>
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs font-semibold text-gray-900">{member.revenue}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">{member.role}</p>
                      <p className="text-xs text-gray-400">{member.deals} deals</p>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">5</p>
              <p className="text-xs text-gray-400">Active Contacts</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">1</p>
              <p className="text-xs text-gray-400">Won This Month</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">87%</p>
              <p className="text-xs text-gray-400">Win Rate</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
