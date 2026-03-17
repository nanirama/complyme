import { ReactNode } from 'react';

interface CardProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export function Card({ title, icon, children }: CardProps) {
  return (
    <article 
      className="h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
      aria-labelledby={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <header className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 mt-1" aria-hidden="true">
            <span className="text-2xl" role="img" aria-label={icon}>{icon}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 
            id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100"
          >
            {title}
          </h3>
          <div className="text-gray-600 dark:text-gray-400">{children}</div>
        </div>
      </header>
    </article>
  );
}
