import { useReadContract } from "wagmi";
import { erc20Abi } from "../../abis/erc20";

export function useTokenBalance(token, address) {
  return useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });
}
