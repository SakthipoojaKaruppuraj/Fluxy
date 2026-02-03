import { useReadContract } from "wagmi";
import { erc20Abi } from "../../abis/erc20";
import { ROUTER_ADDRESS } from "../../constants";

export function useAllowance(token, owner) {
  return useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: owner ? [owner, ROUTER_ADDRESS] : undefined,
    enabled: !!owner,
    watch: true,
  });
}
