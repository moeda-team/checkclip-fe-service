"use client";
import { Spiral } from "@phosphor-icons/react";
import { Handshake, Users } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const revenueData = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 2000, profit: 9800 },
  { month: 'Apr', revenue: 2780, profit: 3908 },
  { month: 'May', revenue: 1890, profit: 4800 },
  { month: 'Jun', revenue: 2390, profit: 3800 },
  { month: 'Jul', revenue: 3490, profit: 4300 },
];

const salesData = [
  { name: 'Product A', sales: 4000, target: 3500 },
  { name: 'Product B', sales: 3000, target: 3200 },
  { name: 'Product C', sales: 2000, target: 2800 },
  { name: 'Product D', sales: 2780, target: 2500 },
  { name: 'Product E', sales: 1890, target: 2000 },
];

const distributionData = [
  { name: 'Direct', value: 400, color: '#7c3aed' },
  { name: 'Social', value: 300, color: '#10b981' },
  { name: 'Referral', value: 300, color: '#f59e0b' },
  { name: 'Organic', value: 200, color: '#8b5cf6' },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 pb-2">Total Revenue (MTD)</p>
              <p className="text-2xl font-bold text-gray-900">¥38,500,000</p>
              <p className="text-sm text-green-600">+16.0%</p>
              <p className="text-xs text-gray-500">vs. ¥33,200,000 last month</p>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">¥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 pb-2">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-green-600">+2</p>
              <p className="text-xs text-gray-500">Total pipeline: ¥90,700,000</p>
            </div>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <Handshake className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 pb-2">New Contacts (MTD)</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-sm text-green-600">+12.5%</p>
              <p className="text-xs text-gray-500">Conversion rate: 18.2%</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 pb-2">Campaign ROI</p>
              <p className="text-2xl font-bold text-gray-900">324%</p>
              <p className="text-sm text-red-600">-5.2%</p>
              <p className="text-xs text-gray-500">8 active campaigns</p>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Spiral className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow border">
          <div className="text-sm font-semibold text-gray-900 py-4 px-4 b-4 border-b">Revenue Trend</div>
          <div className="p-4 text-xs">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Performance Chart */}
        <div className="bg-white rounded-lg shadow border">
          <div className="text-sm font-semibold text-gray-900 py-4 px-4 b-4 border-b">Sales Performance</div>
          <div className="p-4 text-xs">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#7c3aed" />
                <Bar dataKey="target" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow border">
          <div className="text-sm font-semibold text-gray-900 py-4 px-4 b-4 border-b">Traffic Distribution</div>
          <div className="p-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border">
          <div className="text-sm font-semibold text-gray-900 py-4 px-4 b-4 border-b">Recent Activity</div>
          <div className="space-y-2 px-4 py-4 max-h-96 overflow-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-medium">JD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Created a new deal worth ¥50,000</p>
                <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-medium">SJ</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Won the Enterprise deal</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-medium">MW</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Mike Wilson</p>
                <p className="text-xs text-gray-500">Scheduled a demo with Tech Corp</p>
                <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-medium">ED</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Emma Davis</p>
                <p className="text-xs text-gray-500">Added 5 new contacts</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-medium">TC</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Tom Chen</p>
                <p className="text-xs text-gray-500">Updated the Marketing campaign</p>
                <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-medium">AL</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Alice Lee</p>
                <p className="text-xs text-gray-500">Closed the Cloud Migration project</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
        {/* Deals Closing Soon */}
        <div className="bg-white rounded-lg shadow border">
          <div className="text-sm font-semibold text-gray-900 py-4 px-4 b-4 border-b">Deals Closing Soon</div>
          <div className="space-y-2 px-4 py-4 max-h-96 overflow-auto">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">TC</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Tech Corp</h4>
                  <p className="text-xs text-gray-500">Enterprise Software</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-4 py-1 rounded-full">Negotiation</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span className="font-medium">¥12,500,000</span>
                <span>75% complete</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Closing in 2 days</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">GS</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Global Solutions</h4>
                  <p className="text-xs text-gray-500">Marketing Campaign</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-4 py-1 rounded-full">Proposal</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span className="font-medium">¥8,500,000</span>
                <span>60% complete</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Closing in 5 days</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">DS</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Digital Systems</h4>
                  <p className="text-xs text-gray-500">Cloud Migration</p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-xs px-4 py-1 rounded-full">Review</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span className="font-medium">¥20,000,000</span>
                <span>40% complete</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '40%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Closing in 1 week</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">IL</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Innovate Labs</h4>
                  <p className="text-xs text-gray-500">AI Implementation</p>
                </div>
                <span className="bg-purple-100 text-purple-700 text-xs px-4 py-1 rounded-full">Discovery</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span className="font-medium">¥15,000,000</span>
                <span>25% complete</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Closing in 2 weeks</p>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg shadow border">
          <div className="text-sm font-semibold text-gray-900 py-4 px-4 b-4 border-b">Team Performance</div>
          <div className="space-y-2 px-4 py-4 max-h-96 overflow-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">JS</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Smith</p>
                  <p className="text-xs text-gray-500">Sales Manager</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">$245,000</p>
                <p className="text-xs text-gray-500">12 deals</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">SJ</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Account Executive</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">$189,000</p>
                <p className="text-xs text-gray-500">8 deals</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">MW</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Mike Wilson</p>
                  <p className="text-xs text-gray-500">Sales Rep</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">$156,000</p>
                <p className="text-xs text-gray-500">6 deals</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">ED</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Emma Davis</p>
                  <p className="text-xs text-gray-500">Sales Rep</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">$134,000</p>
                <p className="text-xs text-gray-500">5 deals</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">248</p>
                <p className="text-xs text-gray-500">Active Contacts</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">31</p>
                <p className="text-xs text-gray-500">Won This Month</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">68%</p>
                <p className="text-xs text-gray-500">Win Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
