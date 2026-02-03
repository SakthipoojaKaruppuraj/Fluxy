export default function SlippageRow({ slippage, onChange }) {
    return (
      <div className="flex justify-between items-center text-sm text-zinc-400">
        <span>Slippage</span>
        <select
          value={slippage}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-800 rounded-lg px-2 py-1"
        >
          <option value="0.5">0.5%</option>
          <option value="1">1%</option>
          <option value="2">2%</option>
        </select>
      </div>
    );
  }
  