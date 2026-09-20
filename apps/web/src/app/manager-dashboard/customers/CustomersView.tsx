'use client';

import React, { useState, useMemo } from 'react';
import { Download, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  CustomerKPIs,
  CustomerAIRecommendationBanner,
  CustomerCard,
  AddCustomerModal,
  CustomerProfileModal,
} from './components';
import {
  ManagerCustomer,
  CustomerKPIsData,
  AddCustomerFormData,
} from '../types';
import {
  initialCustomers,
  initialCustomerKPIs,
} from '../data';

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<ManagerCustomer[]>(initialCustomers);
  const [kpis, setKpis] = useState<CustomerKPIsData>(initialCustomerKPIs);
  const [activeSegment, setActiveSegment] = useState<'All' | 'VIP' | 'Regular'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProfileCustomer, setSelectedProfileCustomer] =
    useState<ManagerCustomer | null>(null);

  // Recalculate KPIs when customers change
  const updateKPIs = (currentCustomers: ManagerCustomer[]) => {
    const total = currentCustomers.length;
    const vip = currentCustomers.filter((c) => c.isVIP).length;
    const avgScore = Number(
      (
        currentCustomers.reduce((acc, c) => acc + c.rating, 0) /
        (currentCustomers.length || 1)
      ).toFixed(1)
    );

    setKpis((prev) => ({
      ...prev,
      totalCustomers: total,
      vipMembers: vip,
      avgRating: avgScore,
    }));
  };

  // Filter customers by segment and search query
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSegment =
        activeSegment === 'All' ||
        (activeSegment === 'VIP' && customer.isVIP) ||
        (activeSegment === 'Regular' && !customer.isVIP);

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q) ||
        (customer.preferredTable &&
          customer.preferredTable.toLowerCase().includes(q)) ||
        (customer.dietaryPreferences &&
          customer.dietaryPreferences.toLowerCase().includes(q)) ||
        (customer.notes && customer.notes.toLowerCase().includes(q));

      return matchesSegment && matchesSearch;
    });
  }, [customers, activeSegment, searchQuery]);

  // Handlers
  const handleAddCustomer = (data: AddCustomerFormData) => {
    const newCustomer: ManagerCustomer = {
      id: `cust-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      initials: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase(),
      phone: data.phone,
      email: data.email,
      dob: data.dob,
      preferredTable: data.preferredTable,
      dietaryPreferences: data.dietaryPreferences,
      notes: data.notes,
      isVIP: data.isVIP,
      rating: 5,
      visits: 1,
      spent: 0,
      lastVisit: 'Today',
    };

    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    updateKPIs(updated);
    setIsAddModalOpen(false);
    toast.success(`Registered customer profile for ${newCustomer.name}`);
  };

  const handleEmailCustomer = (customer: ManagerCustomer) => {
    toast.info(`Drafting email to ${customer.email}...`);
  };

  const handleExportCustomers = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Email,Phone,VIP,Visits,Total Spent,Rating,Preferred Table']
        .concat(
          customers.map(
            (c) =>
              `"${c.name}","${c.email}","${c.phone}",${c.isVIP},${c.visits},${c.spent},${c.rating},"${c.preferredTable || ''}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tavonza-customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customer directory exported to CSV');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Top Header Bar matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-tight">
            Customer Management
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-normal font-['Inter'] mt-1">
            Loyalty profiles, history, and feedback
          </p>
        </div>

        {/* Action Buttons: Export & Add Customer */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCustomers}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-200/20 flex items-center gap-1.5 text-white text-sm font-semibold font-['Inter'] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-white text-sm font-semibold font-['Inter'] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(255,214,168,1.00)] flex items-center gap-1.5 transition-all cursor-pointer shadow-amber-500/20 active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <CustomerKPIs kpis={kpis} />

      {/* Row 2: AI Recommendation Banner */}
      <CustomerAIRecommendationBanner
        onActionClick={() =>
          toast.info('Opening VIP retention promotional sequence draft...')
        }
      />

      {/* Row 3: Filter Pills Bar & Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Segment Filter Pills */}
        <div className="flex items-center gap-2">
          {(['All', 'VIP', 'Regular'] as const).map((segment) => (
            <button
              key={segment}
              type="button"
              onClick={() => setActiveSegment(segment)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium font-['Inter'] transition-all cursor-pointer ${
                activeSegment === segment
                  ? 'bg-amber-400 text-white font-semibold shadow-sm shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {segment === 'All'
                ? `All Customers (${customers.length})`
                : segment === 'VIP'
                ? `VIP Members (${customers.filter((c) => c.isVIP).length})`
                : `Regular (${customers.filter((c) => !c.isVIP).length})`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, table, notes..."
            className="w-full h-8.5 pl-9 pr-3 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 text-white placeholder-zinc-500 text-sm focus:outline-yellow-500 transition-all font-['Plus_Jakarta_Sans']"
          />
        </div>
      </div>

      {/* Row 4: 3-Column Customer Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="w-full h-64 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-white text-lg font-medium">No customers found</p>
          <p className="text-slate-400 text-sm mt-1">
            Try adjusting your search criteria or switch the segment filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onView={(c) => setSelectedProfileCustomer(c)}
              onEmail={handleEmailCustomer}
            />
          ))}
        </div>
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      {/* Customer Profile View Modal */}
      <CustomerProfileModal
        isOpen={Boolean(selectedProfileCustomer)}
        onClose={() => setSelectedProfileCustomer(null)}
        customer={selectedProfileCustomer}
        onSendEmail={(email) => toast.info(`Drafting email to ${email}...`)}
      />
    </div>
  );
};

export const ManagerCustomersView = CustomersView;
export default CustomersView;
