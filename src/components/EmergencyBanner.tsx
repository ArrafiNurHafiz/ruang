import React from "react";
import { AlertCircle, Phone, ArrowRight, X } from "lucide-react";

interface EmergencyBannerProps {
  onOpenModal: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onOpenModal,
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-red-600 text-white text-[11px] sm:text-xs py-2 px-4 sm:px-8 shadow-inner relative z-30 font-sans tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 font-bold uppercase tracking-wider">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <AlertCircle className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
          <span>
            Layanan Darurat Nasional: SAPA 129 | Polisi 110 | UPTD PPA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono tracking-wider opacity-90">
            <span className="bg-red-700/80 px-2 py-0.5 rounded border border-red-500/60 font-bold">
              SESI: #TMG-8821
            </span>
            <span>Bukan Layanan Darurat 24 Jam</span>
          </div>

          <button
            id="banner-emergency-hotline-btn"
            onClick={onOpenModal}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white text-white hover:text-red-600 font-bold px-3 py-1 rounded-full text-[11px] transition-all border border-white/30 cursor-pointer shadow-xs"
          >
            <Phone className="w-3 h-3" />
            <span>Kontak Cepat</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Tutup Banner Darurat"
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
