import AppShell from "./components/layout/AppShell";
import Header from "./components/layout/Header";
import SwapCard from "./components/swap/SwapCard";

export default function App() {
  return (
    <AppShell>
      <Header />
      <div className="flex-1 flex flex-col justify-center items-center mt-12 sm:mt-20">
         <SwapCard />
      </div>
    </AppShell>
  );
}
