
import React, { useMemo } from 'react';
import { ReworkTicket, Status } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  tickets: ReworkTicket[];
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#6366f1'];

const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {
  const stats = useMemo(() => {
    const total = tickets.length;
    const pending = tickets.filter(t => t.status === Status.PENDING).length;
    const resolved = tickets.filter(t => t.status === Status.RESOLVED).length;
    const totalCost = tickets.reduce((acc, t) => acc + t.cost, 0);
    const totalHours = tickets.reduce((acc, t) => acc + t.hours, 0);

    const deptData = tickets.reduce((acc: any, t) => {
      acc[t.department] = (acc[t.department] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(deptData).map(name => ({
      name,
      value: deptData[name]
    }));

    const costData = Object.keys(deptData).map(name => ({
      name,
      cost: tickets.filter(t => t.department === name).reduce((sum, t) => sum + t.cost, 0)
    }));

    return { total, pending, resolved, totalCost, totalHours, chartData, costData };
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value={stats.total} color="blue" />
        <StatCard title="Pending Items" value={stats.pending} color="yellow" />
        <StatCard title="Total Cost" value={`$${stats.totalCost.toLocaleString()}`} color="red" />
        <StatCard title="Productive Hours Lost" value={`${stats.totalHours}h`} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tickets by Department</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Cost Analysis per Dept ($)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[color]} shadow-sm`}>
      <p className="text-sm font-medium opacity-80 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default Dashboard;
