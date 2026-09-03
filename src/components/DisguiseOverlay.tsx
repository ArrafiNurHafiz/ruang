import React from "react";
import { Calculator, RotateCcw, BookOpen, Check } from "lucide-react";

interface DisguiseOverlayProps {
  isActive: boolean;
  onExitDisguise: () => void;
}

export const DisguiseOverlay: React.FC<DisguiseOverlayProps> = ({
  isActive,
  onExitDisguise,
}) => {
  const [calcInput, setCalcInput] = React.useState(
    "sin(30°) + cos(60°) = 1.00",
  );

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-800 p-6 overflow-y-auto font-serif">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Camouflage Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-700" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 font-sans">
                Latihan Mandiri Matematika Wajib & Fisika Terapan
              </h1>
              <p className="text-xs text-slate-500 font-sans">
                Bab 4: Trigonometri Sudut Relasi & Dinamika Gerak Harmonik
                Sederhana
              </p>
            </div>
          </div>
          <button
            onClick={onExitDisguise}
            title="Kembali ke Ruang Aman"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-sans font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tutup Catatan</span>
          </button>
        </div>

        {/* Camouflage Math Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-600" />
              <span>Kalkulator Rumus Cepat</span>
            </h2>
            <div className="bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-sm">
              <input
                type="text"
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-slate-800"
              />
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
              {[
                "7",
                "8",
                "9",
                "÷",
                "4",
                "5",
                "6",
                "×",
                "1",
                "2",
                "3",
                "-",
                "0",
                ".",
                "=",
                "+",
              ].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === "=") {
                      try {
                        const expr = calcInput.replace(/×/g, "*").replace(/÷/g, "/");
                        const result = Function('"use strict";return (' + expr + ')')();
                        setCalcInput(String(result));
                      } catch {
                        setCalcInput("Error");
                      }
                    } else if (btn === "C") {
                      setCalcInput("");
                    } else {
                      setCalcInput((prev) => prev + btn);
                    }
                  }}
                  className="p-2 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  {btn}
                </button>
              ))}
              <button
                onClick={() => setCalcInput("")}
                className="col-span-4 p-2 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-semibold text-xs"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <h2 className="font-bold text-sm text-slate-800">
              Identitas Trigonometri Dasar
            </h2>
            <div className="text-xs space-y-2 text-slate-600 font-mono">
              <div className="p-2 bg-white rounded border border-slate-200">
                sin²(θ) + cos²(θ) = 1
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                tan(θ) = sin(θ) / cos(θ)
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                1 + tan²(θ) = sec²(θ)
              </div>
            </div>
          </div>
        </div>

        {/* Camouflage Practice Problems */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="font-bold text-base text-slate-900 font-sans">
            Soal Evaluasi Pemahaman
          </h3>

          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <p className="font-medium text-slate-800">
                1. Diketahui segitiga siku-siku ABC dengan panjang sisi miring c
                = 10 cm dan sudut A = 30°. Berapakah panjang sisi di depan sudut
                A?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
                {["A. 5 cm", "B. 5√3 cm", "C. 10 cm", "D. 2.5 cm"].map(
                  (opt, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="soal1"
                        className="text-blue-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <p className="font-medium text-slate-800">
                2. Sebuah benda bermassa 2 kg ditarik dengan gaya 10 N pada
                bidang datar licin. Tentukan percepatan yang dialami benda
                tersebut.
              </p>
              <div className="text-xs text-slate-500 font-sans">
                (Rumus: F = m · a &rarr; a = F / m)
              </div>
            </div>
          </div>
        </div>

        {/* Discrete Return Button */}
        <div className="pt-6 flex justify-between items-center text-xs text-slate-400 font-sans">
          <span>Halaman Catatan Siswa - Semester Genap</span>
          <button
            onClick={onExitDisguise}
            className="text-slate-500 hover:text-slate-800 underline flex items-center gap-1"
          >
            <span>Lanjutkan Navigasi Sebelumnya</span>
          </button>
        </div>
      </div>
    </div>
  );
};
