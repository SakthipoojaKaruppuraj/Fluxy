import InfoRow from "./InfoRow";

export default function AdvancedInfo({ open = true, data = {} }) {
  if (!open) return null;

  return (
    <div className="bg-surfaceHighlight/50 border border-zinc-800 rounded-2xl p-4 text-sm space-y-2 mt-4 animate-in slide-in-from-top-2">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        Pool Details
      </h3>
      <InfoRow label="Pool Reserves" value={data.reserves || "-"} />
      <InfoRow label="Swap Fee" value="0.30%" />
      <InfoRow label="Total Volume" value={data.volume || "-"} />
      <InfoRow label="Pool Address" value={data.pool || "-"} copy />
    </div>
  );
}
