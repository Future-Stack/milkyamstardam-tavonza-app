'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { RestaurantInfoSettings } from '../../types';

interface RestaurantInfoCardProps {
  initialInfo: RestaurantInfoSettings;
}

export const RestaurantInfoCard: React.FC<RestaurantInfoCardProps> = ({ initialInfo }) => {
  const [info, setInfo] = useState<RestaurantInfoSettings>(initialInfo);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Restaurant information updated successfully.');
    }, 600);
  };

  return (
    <div className="w-full bg-white/10 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/5 p-5 sm:p-6 flex flex-col justify-start items-start gap-4 backdrop-blur-md shadow-lg">
      {/* Card Title */}
      <h2 className="text-slate-200 text-lg font-semibold font-sans">
        Restaurant Information
      </h2>

      {/* Form Fields */}
      <form onSubmit={handleSave} className="w-full space-y-3.5">
        {/* Restaurant Name */}
        <div className="flex flex-col gap-1">
          <label className="text-white text-xs font-semibold font-sans uppercase tracking-wide">
            Restaurant Name
          </label>
          <div className="h-10 px-3 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/5 flex items-center focus-within:outline-amber-500/50">
            <input
              type="text"
              value={info.restaurantName}
              onChange={(e) => setInfo({ ...info, restaurantName: e.target.value })}
              className="w-full bg-transparent text-slate-200 text-sm font-normal font-sans focus:outline-none"
            />
          </div>
        </div>

        {/* Branch */}
        <div className="flex flex-col gap-1">
          <label className="text-white text-xs font-semibold font-sans uppercase tracking-wide">
            Branch
          </label>
          <div className="h-10 px-3 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/5 flex items-center focus-within:outline-amber-500/50">
            <input
              type="text"
              value={info.branch}
              onChange={(e) => setInfo({ ...info, branch: e.target.value })}
              className="w-full bg-transparent text-slate-200 text-sm font-normal font-sans focus:outline-none"
            />
          </div>
        </div>

        {/* Address & Phone 2-column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-white text-xs font-semibold font-sans uppercase tracking-wide">
              Address
            </label>
            <div className="h-10 px-3 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/5 flex items-center focus-within:outline-amber-500/50">
              <input
                type="text"
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                className="w-full bg-transparent text-slate-200 text-sm font-normal font-sans focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white text-xs font-semibold font-sans uppercase tracking-wide">
              Phone
            </label>
            <div className="h-10 px-3 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/5 flex items-center focus-within:outline-amber-500/50">
              <input
                type="text"
                value={info.phone}
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                className="w-full bg-transparent text-slate-200 text-sm font-normal font-sans focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-sm font-semibold font-sans rounded-md shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
