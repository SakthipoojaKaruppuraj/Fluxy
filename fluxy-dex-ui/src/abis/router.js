export const routerAbi = [
    {
      name: "swapExactTokensForTokens",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { type: "address" }, // tokenIn
        { type: "uint256" }, // amountIn
        { type: "uint256" }, // minAmountOut
      ],
      outputs: [{ type: "uint256" }],
    },
  ];
  