'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPlan, savePlan, resetPlan, resetCycle } from '@/lib/storage';

export default function EditPlanPage() {
  const [plan, setPlan] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setPlan(getPlan());
    setMounted(true);
  }, []);

  function handleReset() {
    resetPlan();
    resetCycle();
    setPlan(getPlan());
    setShowResetConfirm(false);
  }

  function updateDayName(dayNumber, name) {
    const next = plan.map(d => d.day === dayNumber ? { ...d, name } : d);
    setPlan(next);
    savePlan(next);
  }

  function updateDayFocus(dayNumber, focus) {
    const next = plan.map(d => d.day === dayNumber ? { ...d, focus } : d);
    setPlan(next);
    savePlan(next);
  }

  if (!mounted) return null;

  const inputClass = "bg-[#1A1A1A] border border-[#2A2A2A] text-[#F0EDE6] px-3 py-1.5 font-[family-name:var(--font-body)] focus:outline-none focus:border-[#D1E231] transition-colors w-full";

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="mx-auto w-full max-w-[480px] px-6">

        {/* Nav */}
        <div className="flex items-center justify-between py-5 px-6 -mx-6 bg-[#D1E231]">
          <span className="font-[family-name:var(--font-display)] font-bold uppercase text-[#0F0F0F] tracking-wider" style={{ fontSize: 'clamp(1.125rem, 5vw, 1.25rem)' }}>
            EDIT DAYS
          </span>
          <Link
            href="/week"
            className="font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity"
            style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          >
            ← BACK
          </Link>
        </div>

        {/* Day list */}
        <div className="mt-4">
          {plan.map(day => {
            const isEditing = editingDay === day.day;
            return (
              <div key={day.day} className="py-4 px-6 -mx-6 border-b border-[#2A2A2A]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-body)] text-[#888780] uppercase tracking-widest mb-1" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
                      Day {day.day}
                    </p>
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          className={inputClass}
                          style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
                          defaultValue={day.name}
                          placeholder="Day name"
                          onBlur={e => updateDayName(day.day, e.target.value)}
                        />
                        <input
                          className={inputClass}
                          style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
                          defaultValue={day.focus}
                          placeholder="Focus / muscle groups"
                          onBlur={e => updateDayFocus(day.day, e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-[family-name:var(--font-display)] font-bold uppercase text-[#F0EDE6] leading-tight" style={{ fontSize: 'clamp(1.0625rem, 4.5vw, 1.125rem)' }}>
                          {day.name}
                        </p>
                        <p className="font-[family-name:var(--font-body)] text-[#888780] mt-0.5" style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}>
                          {day.focus}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingDay(isEditing ? null : day.day)}
                      className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border px-3 py-1 transition-colors"
                      style={{
                        fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)',
                        borderColor: isEditing ? '#D1E231' : '#2A2A2A',
                        color: isEditing ? '#D1E231' : '#888780',
                      }}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset to defaults */}
        <div className="py-8 flex justify-center">
          {showResetConfirm ? (
            <div className="text-center">
              <p className="font-[family-name:var(--font-body)] text-[#888780] mb-4" style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}>
                Reset to default plan? This cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 bg-[#D1E231] text-[#0F0F0F] font-bold"
                  style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest px-4 py-2 border border-[#2A2A2A] text-[#888780]"
                  style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#2A2A2A] px-4 py-2 text-[#888780] hover:border-[#D1E231] hover:text-[#D1E231] transition-colors"
              style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
            >
              Reset to Default Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
