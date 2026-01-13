
import React from 'react';
import { ReworkTicket, Status, Priority } from '../types';
import { Icons } from '../constants';

interface ReworkListProps {
  tickets: ReworkTicket[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
  onAnalyze: (ticket: ReworkTicket) => void;
}

const ReworkList: React.FC<ReworkListProps> = ({ tickets, onDelete, onStatusChange, onAnalyze }) => {
  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.CRITICAL: return 'bg-red-100 text-red-800';
      case Priority.HIGH: return 'bg-orange-100 text-orange-800';
      case Priority.MEDIUM: return 'bg-blue-100 text-blue-800';
      case Priority.LOW: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (s: Status) => {
    switch (s) {
      case Status.RESOLVED: return 'text-emerald-600 bg-emerald-50';
      case Status.PENDING: return 'text-amber-600 bg-amber-50';
      case Status.IN_PROGRESS: return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Ticket</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Cost</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No rework tickets found. Click "New Rework" to start tracking.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{ticket.title}</div>
                    <div className="text-sm text-slate-500 truncate max-w-xs">{ticket.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 text-sm">{ticket.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={ticket.status}
                      onChange={(e) => onStatusChange(ticket.id, e.target.value as Status)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(ticket.status)}`}
                    >
                      {Object.values(Status).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    ${ticket.cost}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onAnalyze(ticket)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="AI Analysis"
                      >
                        <Icons.Analysis />
                      </button>
                      <button
                        onClick={() => onDelete(ticket.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReworkList;
