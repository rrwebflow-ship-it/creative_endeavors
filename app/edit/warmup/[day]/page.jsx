'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getWarmupForDay, updateWarmupItems } from '@/lib/warmupStorage';
import EditWarmUpForm from '@/components/EditWarmUpForm';

const ORANGE = '#FF8C42';

export default function EditWarmUpPage({ params }) {
  const { day } = use(params);
  const dayNumber = parseInt(day, 10);

  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    const warmup = getWarmupForDay(dayNumber);
    setItems(warmup.items || []);
    setMounted(true);
  }, [dayNumber]);

  function save(next) {
    setItems(next);
    updateWarmupItems(dayNumber, next);
  }

  function handleSave(index, data) {
    const next = items.map((item, i) => i === index ? data : item);
    save(next);
    setEditingIndex(null);
  }

  function handleAdd(data) {
    save([...items, data]);
    setAddingNew(false);
  }

  function handleDelete(index) {
    save(items.filter((_, i) => i !== index));
  }

  function moveUp(index) {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    save(next);
  }

  function moveDown(index) {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    save(next);
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="mx-auto w-full max-w-[480px] px-6">

        {/* Nav — orange */}
        <div
          className="flex items-center justify-between py-5 px-6 -mx-6"
          style={{ background: ORANGE }}
        >
          <span
            className="font-[family-name:var(--font-display)] font-bold uppercase text-[#0F0F0F] tracking-wider"
            style={{ fontSize: 'clamp(1.125rem, 5vw, 1.25rem)' }}
          >
            EDIT WARM-UP
          </span>
          <Link
            href={`/warmup/${dayNumber}`}
            className="font-[family-name:var(--font-body)] text-[#0F0F0F] tracking-widest uppercase hover:opacity-60 transition-opacity"
            style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}
          >
            ← BACK
          </Link>
        </div>

        <div className="mt-4">
          {items.map((item, i) => (
            <div key={i}>
              {editingIndex === i ? (
                <EditWarmUpForm
                  item={item}
                  onSave={data => handleSave(i, data)}
                  onCancel={() => setEditingIndex(null)}
                />
              ) : (
                <div className="py-4 px-6 -mx-6 border-b border-[#2A2A2A] flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-[family-name:var(--font-body)] text-[#F0EDE6]"
                      style={{ fontSize: '1rem' }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="font-[family-name:var(--font-body)] text-[#888780] uppercase mt-0.5"
                      style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                    >
                      {item.duration} · {item.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveUp(i)}
                        disabled={i === 0}
                        className="cursor-pointer text-[#444440] hover:text-[#FF8C42] disabled:opacity-20 transition-colors leading-none"
                        style={{ fontSize: 10 }}
                      >▲</button>
                      <button
                        onClick={() => moveDown(i)}
                        disabled={i === items.length - 1}
                        className="cursor-pointer text-[#444440] hover:text-[#FF8C42] disabled:opacity-20 transition-colors leading-none"
                        style={{ fontSize: 10 }}
                      >▼</button>
                    </div>
                    <button
                      onClick={() => setEditingIndex(i)}
                      className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#2A2A2A] px-2 py-1 text-[#888780] transition-colors"
                      style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888780'; }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#2A2A2A] px-2 py-1 text-[#888780] hover:border-red-500 hover:text-red-500 transition-colors"
                      style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new item */}
          {addingNew ? (
            <EditWarmUpForm
              onSave={handleAdd}
              onCancel={() => setAddingNew(false)}
            />
          ) : (
            <div className="flex justify-center py-6">
              <button
                onClick={() => setAddingNew(true)}
                className="cursor-pointer font-[family-name:var(--font-body)] uppercase tracking-widest border border-[#2A2A2A] px-4 py-2 transition-colors"
                style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)', color: ORANGE }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; }}
              >
                + Add Warm-Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
