import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { formatEther, parseEther } from "viem";
import { useState } from "react";

import { erc20Abi } from "./abis/erc20";
import { poolAbi } from "./abis/pool";
import { routerAbi } from "./abis/router";

import {
  ZBT_TOKEN,
  MND_TOKEN,
  POOL_ADDRESS,
  ROUTER_ADDRESS,
} from "./constants";

export default function App() {
  /* ---------------- WALLET ---------------- */
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();

  /* ---------------- STATE ---------------- */
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [direction, setDirection] = useState("ZBT_TO_MND");

  /* ---------------- TOKEN SELECTION ---------------- */
  const tokenIn =
    direction === "ZBT_TO_MND" ? ZBT_TOKEN : MND_TOKEN;
  const tokenOut =
    direction === "ZBT_TO_MND" ? MND_TOKEN : ZBT_TOKEN;

  const symbolIn =
    direction === "ZBT_TO_MND" ? "ZBT" : "MND";
  const symbolOut =
    direction === "ZBT_TO_MND" ? "MND" : "ZBT";

  /* ---------------- READS ---------------- */

  const { data: zbtBalance, refetch: refetchZbt } =
    useReadContract({
      address: ZBT_TOKEN,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
      query: { enabled: !!address },
    });

  const { data: mndBalance, refetch: refetchMnd } =
    useReadContract({
      address: MND_TOKEN,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
      query: { enabled: !!address },
    });

  const activeBalance =
    direction === "ZBT_TO_MND"
      ? zbtBalance
      : mndBalance;

  const balanceNum = activeBalance
    ? Number(formatEther(activeBalance))
    : 0;

  const { data: allowance, refetch: refetchAllowance } =
    useReadContract({
      address: tokenIn,
      abi: erc20Abi,
      functionName: "allowance",
      args: [address, ROUTER_ADDRESS],
      query: { enabled: !!address },
    });

  const { data: reserves, refetch: refetchReserves } =
    useReadContract({
      address: POOL_ADDRESS,
      abi: poolAbi,
      functionName: "getReserves",
    });

  /* ---------------- AMM MATH ---------------- */

  const reserveZbt = reserves
    ? Number(formatEther(reserves[0]))
    : 0;
  const reserveMnd = reserves
    ? Number(formatEther(reserves[1]))
    : 0;

  const reserveIn =
    direction === "ZBT_TO_MND"
      ? reserveZbt
      : reserveMnd;
  const reserveOut =
    direction === "ZBT_TO_MND"
      ? reserveMnd
      : reserveZbt;

  const amountInNum = Number(amountIn || 0);

  const invalidAmount =
    amountInNum <= 0 || amountInNum > balanceNum;

  const amountOut =
    amountInNum && reserveIn > 0
      ? (amountInNum * reserveOut) /
        (reserveIn + amountInNum)
      : 0;

  const minOut = amountOut * (1 - slippage / 100);

  /* ---------------- QUICK AMOUNT ---------------- */

  const setPercent = (percent) => {
    const value =
      percent === 100
        ? balanceNum
        : (balanceNum * percent) / 100;

    setAmountIn(
      value > 0 ? value.toFixed(6) : ""
    );
  };

  /* ---------------- ACTIONS ---------------- */

  const approve = async () => {
    try {
      setIsPending(true);
      await writeContract({
        address: tokenIn,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, parseEther("1000000")],
      });
      refetchAllowance();
    } catch (err) {
      console.error("Approve error:", err);
    } finally {
      setIsPending(false);
    }
  };

  const swap = async () => {
    try {
      setIsPending(true);
      await writeContract({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "swapExactTokensForTokens",
        args: [
          tokenIn,
          parseEther(amountIn),
          parseEther(minOut.toFixed(6)),
        ],
      });

      setTimeout(() => {
        refetchZbt();
        refetchMnd();
        refetchReserves();
      }, 3000);
    } catch (err) {
      console.error("Swap error:", err);
    } finally {
      setIsPending(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-zinc-800 p-6 rounded-xl space-y-4 w-96">
        <h1 className="text-xl font-bold text-center">
          {symbolIn} ⇄ {symbolOut} DEX
        </h1>

        {!isConnected ? (
          <button
            className="w-full bg-blue-600 p-2 rounded"
            onClick={() =>
              connect({ connector: injected() })
            }
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="text-xs break-all text-zinc-400">
              <p>Address: {address}</p>
              <p>Network: {chain?.name}</p>
            </div>

            <button
              className="w-full bg-red-600 p-2 rounded"
              onClick={disconnect}
            >
              Disconnect
            </button>

            {/* Direction toggle */}
            <button
              className="w-full bg-zinc-700 p-2 rounded"
              onClick={() =>
                setDirection((d) =>
                  d === "ZBT_TO_MND"
                    ? "MND_TO_ZBT"
                    : "ZBT_TO_MND"
                )
              }
            >
              Reverse ({symbolOut} ⇄ {symbolIn})
            </button>

            {/* Balances */}
            <div className="text-sm space-y-1">
              <p>
                ZBT:{" "}
                {zbtBalance
                  ? Number(formatEther(zbtBalance)).toFixed(4)
                  : "0"}
              </p>
              <p>
                MND:{" "}
                {mndBalance
                  ? Number(formatEther(mndBalance)).toFixed(4)
                  : "0"}
              </p>
            </div>

            {/* Input */}
            <div>
              <p className="text-sm text-zinc-400">
                From ({symbolIn})
              </p>
              <input
                className="w-full p-2 rounded bg-zinc-900"
                placeholder={`${symbolIn} amount`}
                value={amountIn}
                onChange={(e) =>
                  setAmountIn(e.target.value)
                }
              />

              {/* Quick buttons */}
              <div className="flex justify-between mt-2 text-xs">
                {[25, 50, 75, 100].map((p) => (
                  <button
                    key={p}
                    className="bg-zinc-700 px-2 py-1 rounded"
                    onClick={() => setPercent(p)}
                  >
                    {p === 100 ? "MAX" : `${p}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Output */}
            <div className="text-sm">
              <p className="text-zinc-400">
                To ({symbolOut})
              </p>
              <p>
                Estimated:{" "}
                {amountOut.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </p>
              <p>
                Min Out ({slippage}%):{" "}
                {minOut.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}
              </p>
            </div>

            {/* Slippage */}
            <select
              className="w-full bg-zinc-900 p-2 rounded"
              value={slippage}
              onChange={(e) =>
                setSlippage(Number(e.target.value))
              }
            >
              <option value={0.5}>0.5%</option>
              <option value={1}>1%</option>
              <option value={2}>2%</option>
            </select>

            {/* Action */}
            {allowance < parseEther(amountIn || "0") ? (
              <button
                className={`w-full p-2 rounded ${
                  invalidAmount || isPending
                    ? "bg-yellow-500/50 cursor-not-allowed"
                    : "bg-yellow-500"
                }`}
                disabled={invalidAmount || isPending}
                onClick={approve}
              >
                {isPending
                  ? "Approving..."
                  : `Approve ${symbolIn}`}
              </button>
            ) : (
              <button
                className={`w-full p-2 rounded ${
                  invalidAmount || isPending
                    ? "bg-green-600/50 cursor-not-allowed"
                    : "bg-green-600"
                }`}
                disabled={invalidAmount || isPending}
                onClick={swap}
              >
                {isPending ? "Swapping..." : "Swap"}
              </button>
            )}

            {/* Pool stats */}
            <div className="bg-zinc-900 p-3 rounded text-sm space-y-1">
              <p>Pool ZBT: {reserveZbt.toLocaleString()}</p>
              <p>Pool MND: {reserveMnd.toLocaleString()}</p>
              <p>
                Price: 1 ZBT ≈{" "}
                {(reserveMnd / reserveZbt).toFixed(4)} MND
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
