'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { StaffMember, StaffKPIsData } from '../types';
import { initialStaffMembers, initialStaffKPIs } from '../data';
import {
  StaffKPIs,
  StaffAIRecommendationBanner,
  StaffFilterBar,
  StaffCard,
  AddStaffModal,
  StaffScheduleModal,
} from './components';

export const StaffView: React.FC = () => {
  const [members, setMembers] = useState<StaffMember[]>(initialStaffMembers);
  const [kpis, setKpis] = useState<StaffKPIsData>(initialStaffKPIs);
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Recalculate KPIs
  const updateKPIs = (currentMembers: StaffMember[]) => {
    const onDuty = currentMembers.filter((m) => m.status !== 'Off Duty').length;
    const activeWaiters = currentMembers.filter(
      (m) => m.role.toLowerCase() === 'waiter' && m.status === 'Active'
    ).length;
    const kitchenStaff = currentMembers.filter(
      (m) => m.role.toLowerCase() === 'chef' && m.status === 'Active'
    ).length;
    const onBreak = currentMembers.filter((m) => m.status === 'On Break').length;
    const totalRating = currentMembers.reduce((sum, m) => sum + m.rating, 0);
    const avgRating = Number((totalRating / currentMembers.length).toFixed(1));

    setKpis({
      onDutyCount: onDuty,
      onDutySubtitle: `${onDuty - onBreak} active · ${onBreak} on break`,
      waitersActiveCount: activeWaiters,
      waitersSubtitle: 'Covering 18 tables',
      kitchenStaffCount: kitchenStaff,
      kitchenSubtitle: '2 stations active',
      avgRating: avgRating || 4.8,
      ratingSubtitle: 'Team performance',
    });
  };

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Role filter
      let matchesRole = true;
      if (selectedRole !== 'All Roles' && selectedRole !== 'All') {
        const lowerRole = selectedRole.toLowerCase();
        if (lowerRole === 'waiters') {
          matchesRole = member.role.toLowerCase() === 'waiter';
        } else if (lowerRole === 'kitchen') {
          matchesRole = member.role.toLowerCase() === 'chef';
        } else if (lowerRole === 'bartenders') {
          matchesRole = member.role.toLowerCase() === 'bartender';
        } else if (lowerRole === 'hosts') {
          matchesRole = member.role.toLowerCase() === 'host';
        } else if (lowerRole === 'managers') {
          matchesRole = member.role.toLowerCase() === 'manager';
        } else {
          matchesRole = member.role.toLowerCase() === lowerRole;
        }
      }

      // Status filter
      let matchesStatus = true;
      if (selectedStatus !== 'All Status' && selectedStatus !== 'All') {
        matchesStatus = member.status.toLowerCase() === selectedStatus.toLowerCase();
      }

      // Search filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        member.fullName.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [members, selectedRole, selectedStatus, searchQuery]);

  // Toggle staff status
  const handleToggleStatus = (id: string) => {
    const updated = members.map((m) => {
      if (m.id === id) {
        const newStatus = m.status === 'Active' ? ('On Break' as const) : ('Active' as const);
        toast.info(`${m.fullName} status updated to ${newStatus}`);
        return { ...m, status: newStatus };
      }
      return m;
    });
    setMembers(updated);
    updateKPIs(updated);
  };

  // Add staff
  const handleAddStaff = (newMember: StaffMember) => {
    const updated = [newMember, ...members];
    setMembers(updated);
    updateKPIs(updated);
    toast.success(`Successfully registered ${newMember.fullName} as ${newMember.role}!`);
  };

  // AI Table load balancing
  const handleBalanceLoads = () => {
    const updated = members.map((m) => {
      if (m.id === 'staff-1') {
        return { ...m, tablesCount: 3 }; // Emma Wilson 4 -> 3
      }
      if (m.id === 'staff-2') {
        return { ...m, tablesCount: 3 }; // Olivia Park 4 -> 3
      }
      if (m.id === 'staff-3') {
        return { ...m, tablesCount: 4 }; // David Chen 3 -> 4
      }
      if (m.id === 'staff-4') {
        return { ...m, tablesCount: 4 }; // Lucas Rossi 3 -> 4
      }
      return m;
    });
    setMembers(updated);
    toast.success('AI load balancing applied: Tables evenly redistributed to 3-4 per waiter.');
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300 font-['Inter']">
      {/* Header matching Figma */}
      <div>
        <h1 className="text-white text-3xl sm:text-4xl font-semibold font-['Inter'] leading-tight">
          Staff Management
        </h1>
        <p className="text-slate-500 text-base sm:text-lg font-normal font-['Inter'] mt-1">
          Monitor team activity and performance
        </p>
      </div>

      {/* 4 KPI Cards */}
      <StaffKPIs
        kpis={kpis}
        onFilterRole={(role) => setSelectedRole(role)}
      />

      {/* AI Recommendation Banner */}
      <StaffAIRecommendationBanner onBalanceLoads={handleBalanceLoads} />

      {/* Filter & Action Bar */}
      <StaffFilterBar
        selectedRole={selectedRole}
        onSelectRole={setSelectedRole}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Staff Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-black rounded-2xl border border-white/10 space-y-3">
          <p className="text-zinc-400 text-base">No staff members found matching criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedRole('All Roles');
              setSelectedStatus('All Status');
              setSearchQuery('');
            }}
            className="text-sm text-amber-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredMembers.map((member) => (
            <StaffCard
              key={member.id}
              member={member}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStaff={handleAddStaff}
      />

      {/* Staff Schedule Modal */}
      <StaffScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        staffMembers={members}
      />
    </div>
  );
};

export const ManagerStaffView = StaffView;
export default StaffView;
