import { useReadContract } from "wagmi";
import { poolAbi } from "../../abis/pool";
import { POOL_ADDRESS } from "../../constants";

export function usePoolReserves() {
  return useReadContract({
    address: POOL_ADDRESS,
    abi: poolAbi,
    functionName: "getReserves",
    watch: true,
  });
}
