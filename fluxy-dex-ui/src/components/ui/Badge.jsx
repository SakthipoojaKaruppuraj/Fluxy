export default function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-surfaceHighlight text-zinc-300 border border-zinc-700/50",
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    primary: "bg-primary/10 text-primary border border-primary/20",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
