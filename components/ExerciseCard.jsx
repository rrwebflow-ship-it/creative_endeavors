'use client';

import RestTimer from './RestTimer';

export default function ExerciseCard({ name, sets, reps, type, isComplete = false, isNext = false, onComplete }) {
  return (
    <div
      className="py-4 px-6 -mx-6 border-b border-[#2A2A2A] transition-all duration-300"
      style={{
        opacity: isComplete ? 0.35 : 1,
        borderLeft: isNext ? '3px solid #D1E231' : '3px solid transparent',
        background: isNext ? '#1A1A18' : 'transparent',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Completion circle — wrapper height = 1 line of exercise name text so circle centers with it */}
        <div className="flex-shrink-0 flex items-center self-start" style={{ height: '1.5rem' }}>
          <button
            onClick={onComplete}
            aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
            className="flex items-center justify-center transition-all duration-200 w-[15px] h-[15px]"
            style={{
              marginTop: 'clamp(1px, calc(1.43vw - 4.14px), 5px)',
              borderRadius: '50%',
              border: isComplete ? 'none' : isNext ? '2px solid #D1E231' : '2px solid #2A2A2A',
              background: isComplete ? '#D1E231' : 'transparent',
              color: '#0F0F0F',
              fontSize: 7,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {isComplete ? '✓' : ''}
          </button>
        </div>

        {/* Name & type */}
        <div className="min-w-0 flex-1">
          <p
            className="font-[family-name:var(--font-body)] transition-colors duration-300"
            style={{
              fontSize: '1rem',
              color: isComplete ? '#888780' : '#F0EDE6',
              textDecoration: isComplete ? 'line-through' : 'none',
            }}
          >
            {name}
          </p>
          <p className="font-[family-name:var(--font-body)] text-[#888780] uppercase mt-0.5" style={{ fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)' }}>
            {type}
          </p>
        </div>

        {/* Sets badge */}
        <div
          className="flex-shrink-0 py-1.5 font-[family-name:var(--font-body)] whitespace-nowrap transition-all duration-300 text-center"
          style={{
            fontSize: 'clamp(0.8125rem, 3.2vw, 0.875rem)',
            width: '88px',
            background: isNext ? '#1A1A0F' : '#252520',
            border: isNext ? '1px solid #D1E231' : '1px solid #2A2A2A',
            color: isNext ? '#D1E231' : '#F0EDE6',
          }}
        >
          {sets} × {reps}
        </div>
      </div>

      {/* Rest timer — indented to align under exercise name, not the circle */}
      {!isComplete && (
        <div className="ml-[27px]">
          <RestTimer />
        </div>
      )}
    </div>
  );
}
