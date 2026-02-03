import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { RefreshCw, Settings, ArrowDownUp, Info } from "lucide-react";
import { formatEther, parseEther } from "viem";

import Card from "../ui/Card";
import TokenInput from "./TokenInput";
import SwapButton from "./SwapButton";
import AdvancedInfo from "../info/AdvancedInfo";
import { erc20Abi } from "../../abis/erc20";
import { routerAbi } from "../../abis/router";

import {
  ZBT_TOKEN,
  MND_TOKEN,
  ROUTER_ADDRESS,
  POOL_ADDRESS,
} from "../../constants";

import { useTokenBalance } from "../hooks/useTokenBalance";
import { usePoolReserves } from "../hooks/usePoolReserves";
import { useAllowance } from "../hooks/useAllowance";

export default function SwapCard() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const [fromToken, setFromToken] = useState(ZBT_TOKEN);
  const [toToken, setToToken] = useState(MND_TOKEN);
  const [fromSymbol, setFromSymbol] = useState("ZBT");
  const [toSymbol, setToSymbol] = useState("MND");
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState(1); // 1%
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Reads
  const { data: balanceData, refetch: refetchBalance } = useTokenBalance(fromToken, address);
  const { data: toBalanceData, refetch: refetchToBalance } = useTokenBalance(toToken, address);
  const { data: allowanceData, refetch: refetchAllowance } = useAllowance(fromToken, address);
  const { data: reservesData, refetch: refetchReserves } = usePoolReserves();

  // Parsing Data
  const balance = balanceData ? Number(formatEther(balanceData)) : 0;
  const allowance = allowanceData ? Number(formatEther(allowanceData)) : 0;
  
  const reserveZbt = reservesData ? Number(formatEther(reservesData[0])) : 0;
  const reserveMnd = reservesData ? Number(formatEther(reservesData[1])) : 0;

  const isZbtToMnd = fromToken === ZBT_TOKEN;
  const reserveIn = isZbtToMnd ? reserveZbt : reserveMnd;
  const reserveOut = isZbtToMnd ? reserveMnd : reserveZbt;

  // Calculations
  const amountInNum = Number(fromAmount || 0);
  const amountOut =
    amountInNum && reserveIn > 0
      ? (amountInNum * reserveOut) / (reserveIn + amountInNum)
      : 0;

  const minOut = amountOut * (1 - slippage / 100);

  // UI Helper Functions
  function switchDirection() {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setFromAmount("");
  }

  function handlePercent(p) {
    if (!balance) return;
    const value = (balance * p) / 100;
    setFromAmount(value > 0 ? value.toFixed(6) : "");
  }

  const refreshData = () => {
    refetchBalance();
    refetchToBalance();
    refetchAllowance();
    refetchReserves();
  };

  // Actions
  const handleApprove = async () => {
    try {
      setIsPending(true);
      await writeContract({
        address: fromToken,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, parseEther("1000000")], // Max approve
      }, {
        onSuccess: () => {
           // Wait a bit for indexing then refetch
           setTimeout(refetchAllowance, 2000);
           setIsPending(false);
        },
        onError: (err) => {
            console.error(err);
            setIsPending(false);
        }
      });
    } catch (err) {
      console.error("Approve error:", err);
      setIsPending(false);
    }
  };

  const handleSwap = async () => {
    try {
      setIsPending(true);
      await writeContract({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "swapExactTokensForTokens",
        args: [
          fromToken,
          parseEther(fromAmount),
          parseEther(minOut.toFixed(6)),
        ],
      }, {
        onSuccess: () => {
            setTimeout(refreshData, 3000);
            setIsPending(false);
            setFromAmount("");
        },
        onError: (err) => {
            console.error(err);
            setIsPending(false);
        }
      });
    } catch (err) {
      console.error("Swap error:", err);
      setIsPending(false);
    }
  };

  // Determine Button State
  let buttonState = "disabled";
  if (!isConnected) {
    buttonState = "connect";
  } else if (amountInNum > 0) {
    if (amountInNum > balance) {
      buttonState = "insufficient_balance";
    } else if (allowance < amountInNum) {
      buttonState = "approve";
    } else {
      buttonState = "swap";
    }
  }

  const handleAction = () => {
    if (buttonState === "connect") {
        // Connect is handled by Header usually
    } else if (buttonState === "approve") {
      handleApprove();
    } else if (buttonState === "swap") {
      handleSwap();
    }
  };

  const advancedData = {
      reserves: `${reserveZbt.toFixed(2)} ZBT / ${reserveMnd.toFixed(2)} MND`,
      volume: "$1,234.56", // Mock
      pool: POOL_ADDRESS,
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 blur-3xl -z-10 rounded-full opacity-50" />

      <Card className="shadow-2xl shadow-black/50 backdrop-blur-xl bg-surface/90 border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Swap</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-xl transition-colors ${showInfo ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              <Info className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-colors ${showSettings ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={refreshData}
              className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              <RefreshCw className={`w-5 h-5 ${isPending ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-1 relative">
          <TokenInput
            label="Sell"
            symbol={fromSymbol}
            value={fromAmount}
            onChange={setFromAmount}
            balance={balance.toFixed(4)}
            onPercent={handlePercent}
          />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              onClick={switchDirection}
              className="p-2 bg-surface border-4 border-background rounded-xl text-zinc-400 hover:text-white hover:scale-110 transition-all shadow-lg"
            >
              <ArrowDownUp className="w-5 h-5" />
            </button>
          </div>

          <TokenInput
            label="Buy"
            symbol={toSymbol}
            value={amountOut > 0 ? amountOut.toFixed(6) : ""}
            readOnly
            balance={toBalanceData ? Number(formatEther(toBalanceData)).toFixed(4) : "0.0"}
          />
        </div>

        {/* Price Info */}
        {amountOut > 0 && (
           <div className="flex justify-between items-center px-2 py-4 text-xs font-medium text-zinc-500">
             <span>Rate</span>
             <span>1 {fromSymbol} ≈ {(amountOut / amountInNum).toFixed(4)} {toSymbol}</span>
           </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
            <SwapButton
                state={buttonState}
                onClick={handleAction}
                loading={isPending}
            />
        </div>
      </Card>
      
      {showSettings && (
         <div className="mt-4 p-4 bg-surface/50 border border-zinc-800 rounded-2xl animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-zinc-400">Slippage Tolerance</span>
                <span className="text-sm font-medium text-primary">{slippage}%</span>
            </div>
            <div className="flex gap-2">
               {[0.5, 1.0, 2.5].map(val => (
                  <button 
                    key={val} 
                    onClick={() => setSlippage(val)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${slippage === val ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                     {val}%
                  </button>
               ))}
            </div>
         </div>
      )}

      <AdvancedInfo open={showInfo} data={advancedData} />
    </div>
  );
}
