import React from "react";

const variants = {
  primary: "bg-primary hover:bg-primaryHover text-white shadow-lg shadow-purple-900/20",
  secondary: "bg-secondary hover:bg-zinc-600 text-white",
  outline: "border border-zinc-700 hover:bg-zinc-800 text-zinc-300",
  ghost: "hover:bg-zinc-800/50 text-zinc-400 hover:text-white",
  danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5",
  lg: "px-6 py-3 text-lg font-semibold",
  icon: "p-2",
};

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled,
  isLoading,
  ...props 
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        rounded-xl transition-all duration-200 font-medium
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed grayscale" : "active:scale-95"}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
