import { Wallet } from "lucide-react";

export default function TokenInput({
  label,
  symbol = "LEO",
  value,
  onChange,
  balance = "0.0",
  onPercent,
  readOnly = false,
}) {
  return (
    <div className="bg-surfaceHighlight/50 rounded-2xl p-4 border border-transparent focus-within:border-primary/50 focus-within:bg-surfaceHighlight transition-all">
      <div className="flex justify-between text-sm text-zinc-400 mb-2">
        <span>{label}</span>
        {balance && (
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3 h-3" />
            <span>{balance}</span>
            {!readOnly && onPercent && (
              <button
                onClick={() => onPercent(100)}
                className="text-primary hover:text-primaryHover font-medium ml-1 text-xs uppercase tracking-wide"
              >
                Max
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <input
          className="bg-transparent flex-1 text-3xl font-medium outline-none placeholder:text-zinc-600 w-full"
          placeholder="0.0"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={readOnly}
          type="number"
        />
        <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-3 py-1.5 border border-zinc-700 shrink-0">
          {/* Placeholder for Token Icon if available */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-blue-500" />
          <span className="font-semibold">{symbol}</span>
        </div>
      </div>
    </div>
  );
}
