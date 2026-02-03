import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function InfoRow({ label, value, copy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-zinc-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-zinc-300 font-medium truncate max-w-[150px] sm:max-w-[200px]">
           {value}
        </span>
        {copy && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-zinc-700 rounded-md transition-colors text-zinc-500 hover:text-white"
            title="Copy"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );
}
