import React from 'react';  
import { Link } from 'react-router-dom';
import { FiCompass, FiArrowLeft, FiHome } from 'react-icons/fi';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
      <div className="w-20 h-20 rounded-3xl bg-ocean-sky/20 dark:bg-ocean-deep/90 border border-ocean-teal/40 flex items-center justify-center text-ocean-teal shadow-glow-teal">
        <FiCompass className="w-10 h-10 animate-spin-slow" />
      </div>

      <div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-ocean-navy dark:text-ocean-surface">
          404
        </h1>
        <h2 className="text-xl font-bold font-heading text-ocean-teal mt-2">
          Uncharted Waters
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-ocean-sky/70 max-w-md mx-auto mt-2">
          The coordinates you navigated to do not exist in our bathymetric registry or ocean GIS database.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link to="/dashboard">
          <Button variant="primary" icon={FiHome}>
            Return to Dashboard
          </Button>
        </Link>
        <Link to="/map">
          <Button variant="secondary" icon={FiCompass}>
            Open Ocean Map
          </Button>
        </Link>
      </div>
    </div>
  );
}
