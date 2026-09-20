'use client';

import React, { useState } from 'react';
import { Download, FileText, ArrowUpDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { CategoryBreakdownRow } from '../../types';

interface ReportBreakdownTableProps {
  rows: CategoryBreakdownRow[];
}

export const ReportBreakdownTable: React.FC<ReportBreakdownTableProps> = ({ rows }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CategoryBreakdownRow>('grossRevenue');
  const [sortAsc, setSortAsc] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Category', 'Items Sold', 'Gross Revenue ($)', 'Average Ticket ($)', 'Share (%)', 'Growth'];
    const csvContent = [
      headers.join(','),
      ...rows.map((r) =>
        [r.category, r.itemsSold, r.grossRevenue, r.avgTicket, `${r.share}%`, r.growth].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `category_revenue_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Category performance report exported as CSV.');
  };

  const handleSort = (field: keyof CategoryBreakdownRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = rows
    .filter((r) => r.category.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const totalGross = rows.reduce((acc, r) => acc + r.grossRevenue, 0);
  const totalItems = rows.reduce((acc, r) => acc + r.itemsSold, 0);

  return (
    <div className="w-full   rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]   overflow-hidden">
      {/* Table Header Controls */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h3 className="text-white text-lg font-semibold font-['Inter']">
            Category Sales Performance
          </h3>
          <p className="text-slate-400 text-sm font-normal font-['Inter'] mt-0.5">
            Detailed breakdown of menu categories, item velocity, and contribution margins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 px-3 bg-zinc-950 border border-white/10 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
          />

          <button
            type="button"
            onClick={handleExportCSV}
            className="h-8 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>CSV</span>
          </button>
        </div>
      </div> */}

      {/* Table Data */}
      {/* <div className="overflow-x-auto mt-4 custom-scrollbar">
        <table className="w-full text-left text-sm font-['Inter']">
          <thead>
            <tr className="text-neutral-400 border-b border-white/5 select-none">
              <th
                onClick={() => handleSort('category')}
                className="pb-3 font-semibold cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('itemsSold')}
                className="pb-3 font-semibold text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Items Sold</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('grossRevenue')}
                className="pb-3 font-semibold text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Gross Revenue</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('avgTicket')}
                className="pb-3 font-semibold text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Avg. Item Price</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th
                onClick={() => handleSort('share')}
                className="pb-3 font-semibold text-right cursor-pointer hover:text-white"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Share of Total</span>
                  <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                </div>
              </th>
              <th className="pb-3 font-semibold text-right">Growth vs Prev.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 font-medium text-white flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{row.category}</span>
                </td>
                <td className="py-3.5 text-right text-neutral-300 font-mono">
                  {row.itemsSold.toLocaleString()} units
                </td>
                <td className="py-3.5 text-right font-semibold text-white font-mono">
                  ${row.grossRevenue.toLocaleString()}
                </td>
                <td className="py-3.5 text-right text-neutral-300 font-mono">
                  ${row.avgTicket.toFixed(2)}
                </td>
                <td className="py-3.5 text-right">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${row.share}%` }}
                      />
                    </div>
                    <span className="font-mono text-neutral-300">{row.share}%</span>
                  </div>
                </td>
                <td className="py-3.5 text-right font-semibold text-emerald-400 font-mono">
                  {row.growth}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/10 font-semibold text-white">
              <td className="pt-3.5">Total</td>
              <td className="pt-3.5 text-right font-mono text-neutral-300">
                {totalItems.toLocaleString()} units
              </td>
              <td className="pt-3.5 text-right font-mono text-emerald-400 text-base">
                ${totalGross.toLocaleString()}
              </td>
              <td className="pt-3.5 text-right font-mono text-neutral-300">
                ${(totalGross / (totalItems || 1)).toFixed(2)}
              </td>
              <td className="pt-3.5 text-right font-mono">100%</td>
              <td className="pt-3.5 text-right text-emerald-400 font-mono">+12.4%</td>
            </tr>
          </tfoot>
        </table>
      </div> */}
    </div>
  );
};
