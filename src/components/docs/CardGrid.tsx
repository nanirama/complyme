import { ReactNode } from 'react';
import { Card } from './Card';

interface CardGridProps {
  children: ReactNode;
  stagger?: boolean;
}

export function CardGrid({ children, stagger }: CardGridProps) {
  return (
    <div className="flex flex-col gap-4 my-6">
        <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch ${
            stagger ? 'animate-fade-in' : ''
        }`}
        aria-label="Card grid"
        >
        {children}
        </div>
    </div>
  );
}

// Make Card available through CardGrid
CardGrid.Card = Card;
