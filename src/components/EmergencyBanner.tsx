import React from "react";
import { ArrowRight, Phone, X } from "lucide-react";
import { useLanguage } from "../lib/i18n";

interface EmergencyBannerProps {
  onOpenModal: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onOpenModal,
}) => {
  const { t, lang } = useLanguage();
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="emergency-bar">
      <p>
        <span className="status-dot" />
        <span>
          {t("emergency.barText")}{" "}
          <strong>{t("emergency.sapa")}</strong> {lang === "en" ? "or" : "atau"}{" "}
          <strong>{t("emergency.police")}</strong>.
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          id="banner-emergency-hotline-btn"
          onClick={onOpenModal}
          className="action-btn"
        >
          <span>{t("emergency.btn")}</span>
          <ArrowRight size={12} />
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={lang === "en" ? "Dismiss Emergency Banner" : "Tutup Banner Darurat"}
          className="text-danger/60 hover:text-danger p-1 rounded-md transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

