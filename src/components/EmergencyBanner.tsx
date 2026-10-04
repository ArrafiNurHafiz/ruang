import React from "react";
import { ArrowRight, Phone, X } from "lucide-react";

interface EmergencyBannerProps {
  onOpenModal: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onOpenModal,
}) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="emergency-bar">
      <p>
        <span className="status-dot" />
        <span>
          Situasi darurat atau merasa tidak aman? Segera hubungi{" "}
          <strong>SAPA 129</strong> atau <strong>Polisi 110</strong>.
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          id="banner-emergency-hotline-btn"
          onClick={onOpenModal}
          className="action-btn"
        >
          <span>Kontak Darurat</span>
          <ArrowRight size={12} />
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Tutup Banner Darurat"
          className="text-danger/60 hover:text-danger p-1 rounded-md transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
