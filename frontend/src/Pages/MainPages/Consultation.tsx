import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Sun, Wrench } from 'lucide-react';
import SolarConsultationView from '../../Components/Consultations/SolarConsultation/SolarConsultView';
import RepairConsultationView from '../../Components/Consultations/RepairConsultation/RepairConsultView';

const Consultation: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- State Management ---
  const [activeService, setActiveService] = useState<'solar' | 'repair'>('solar');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- Sync URL Params with Loading Effect ---
  useEffect(() => {
    const type = searchParams.get('type');
    if ((type === 'repair' || type === 'solar') && type !== activeService) {
      setIsTransitioning(true);

      // Artificial delay to allow a smooth loading animation UX
      const transitionTimer = setTimeout(() => {
        setActiveService(type);
        setIsTransitioning(false);
      }, 600);

      return () => clearTimeout(transitionTimer);
    }
  }, [searchParams, activeService]);

  // --- Actions ---
  const toggleService = () => {
    if (isTransitioning) return;
    const newType = activeService === 'solar' ? 'repair' : 'solar';

    // Update route and force an immediate smooth scroll to the top
    setSearchParams({ type: newType });
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans lg:pb-10 pb-20 relative">

      {/* --- Global Viewport Loading Overlay --- */}
      {isTransitioning && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md duration-200">
          <div className="flex flex-col items-center p-6 rounded-2xl">
            <Loader2
              className={`w-12 h-12 animate-spin mb-4 ${activeService === 'solar' ? 'text-slate-900' : 'text-amber-500'
                }`}
            />
            <p className="text-slate-900 font-bold tracking-wide animate-pulse text-sm">
              Switching to {activeService === 'solar' ? 'Device Repair' : 'Solar Setup'}...
            </p>
          </div>
        </div>
      )}

      {/* --- Main Content Render Pipeline --- */}
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {activeService === 'solar' ? <SolarConsultationView /> : <RepairConsultationView />}
      </div>

      {/* --- Expandable Floating Action Button (FAB) --- */}
      <button
        onClick={toggleService}
        disabled={isTransitioning}
        className={`
                    group fixed bottom-8 right-8 z-50 flex items-center justify-center p-4 rounded-full font-bold text-white shadow-2xl animate-bounce 
                    transition-all duration-300 ease-in-out cursor-pointer hover:animate-none hover:shadow-xl hover:-translate-y-1 
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    ${activeService === 'solar' ? 'bg-amber-500 shadow-amber-500/30 hover:bg-amber-400' : 'bg-slate-900 shadow-slate-900/30 hover:bg-slate-800'}
                `}
      >
        {activeService ===  'solar' ? <Wrench className="w-5 h-5 text-slate-900" /> : <Sun className="w-5 h-5 text-amber-400" />}

        {/* Expands on desktop layout over breaks */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out sm:group-hover:max-w-[220px] sm:group-hover:opacity-100 sm:group-hover:ml-3 text-sm tracking-wide">
          {activeService === 'solar' ? 'Switch to Device Repair' : 'Switch to Solar Setup'}
        </span>
      </button>

    </div>
  );
};

export default Consultation;