import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Wallet } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function Header() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 mb-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        {/* Left: App Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">
              Fluxy
            </h1>
            <Badge variant="primary">Base Sepolia</Badge>
          </div>
        </div>

        {/* Right: Wallet */}
        <div className="flex items-center gap-4">
          {!address ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => connect({ connector: injected() })}
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-surfaceHighlight rounded-xl p-1 pr-4 border border-zinc-800">
               <div className="px-2 py-1 bg-zinc-900 rounded-lg text-xs font-medium text-zinc-400">
                  {address.slice(0, 6)}...{address.slice(-4)}
               </div>
               <button 
                 onClick={() => disconnect()}
                 className="text-xs text-red-400 hover:text-red-300 transition-colors"
               >
                 Disconnect
               </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
