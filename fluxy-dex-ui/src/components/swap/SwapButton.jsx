import Button from "../ui/Button";

export default function SwapButton({
  state = "disabled",
  onClick,
  loading = false,
}) {
  const config = {
    connect: { label: "Connect Wallet", variant: "primary" },
    approve: { label: "Approve Token", variant: "secondary" },
    swap: { label: "Swap", variant: "primary" },
    disabled: { label: "Enter Amount", variant: "secondary" },
    insufficient_balance: { label: "Insufficient Balance", variant: "danger" },
  };

  const { label, variant } = config[state] || config.disabled;
  // If state is explicitly one of the "actionable" ones but loading is true, we still disable.
  // "disabled" and "insufficient_balance" are always disabled.
  const isDisabled = state === "disabled" || state === "insufficient_balance";

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      isLoading={loading}
      variant={variant}
      size="lg"
      className="w-full"
    >
      {label}
    </Button>
  );
}
