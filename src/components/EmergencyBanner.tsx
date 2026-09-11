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
    <div className="bg-rose-50 border-b border-rose-100 text-rose-900 text-xs py-2 px-4 sm:px-6 relative z-30">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <p className="font-medium text-[11px] sm:text-xs">
            <strong className="font-semibold text-rose-800">Situasi darurat atau bahaya fisik mendesak?</strong> Segera hubungi{" "}
            <span className="font-semibold underline decoration-rose-300">SAPA 129</span> atau{" "}
            <span className="font-semibold underline decoration-rose-300">Polisi 110</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="banner-emergency-hotline-btn"
            onClick={onOpenModal}
            className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-medium px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer shadow-xs"
          >
            <Phone className="w-3 h-3" />
            <span>Kontak Darurat</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Tutup Banner Darurat"
            className="text-rose-400 hover:text-rose-700 p-1 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
