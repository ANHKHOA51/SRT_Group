import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-gutter h-16 bg-surface shadow-sm shrink-0 border-b border-outline-variant/30">
      <div className="flex items-center gap-4">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">To do list</h1>
      </div>
    </header>
  );
}
