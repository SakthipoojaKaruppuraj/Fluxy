export default function DirectionSwitch({ onClick }) {
    return (
      <div className="flex justify-center">
        <button
          onClick={onClick}
          className="w-10 h-10 rounded-full bg-zinc-800 hover:scale-105 transition"
        >
          ⇅
        </button>
      </div>
    );
  }
  