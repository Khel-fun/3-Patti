import { Coins, RefreshCw } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { ethers } from 'ethers';
import TokenABI from '@/contracts/TeenPattiToken.json';
import addresses from '@/contracts/addresses.json';

export default function TokenBalance() {
  const { address: account, isConnected } = useAccount();

  // Only enable contract reads if wallet is ACTUALLY connected with valid address
  const hasValidAccount = isConnected && account && typeof account === 'string' && account.startsWith('0x');

  const { data: balance, refetch, isLoading } = useReadContract({
    address: addresses.baseSepolia?.TeenPattiToken,
    abi: TokenABI.abi,
    functionName: 'balanceOf',
    args: account ? [account] : undefined,
    query: {
      enabled: hasValidAccount,
      refetchInterval: 5000,
    },
  });

  // Don't show component if not connected or no valid account
  if (!hasValidAccount) {
    return null;
  }

  const formattedBalance = balance ? ethers.formatEther(balance) : '0';

  return (
    <div className="group relative glass-panel rounded-full px-1 py-1 pr-4 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 duration-300">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)] border border-yellow-300 relative z-10">
        <Coins className="w-5 h-5 text-black fill-current drop-shadow-sm" />
      </div>

      <div className="flex flex-col relative z-0">
        <span className="text-[9px] text-yellow-500/80 font-black uppercase tracking-widest leading-none mb-0.5">My Chips</span>
        <span className="text-sm font-black text-white tracking-wide font-mono leading-none drop-shadow-sm flex items-center gap-1">
          {parseInt(formattedBalance).toLocaleString()} <span className="text-yellow-400 text-[10px]">TPT</span>
        </span>
      </div>

      <button
        onClick={() => refetch()}
        disabled={isLoading}
        className="ml-2 p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
        title="Refresh Balance"
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
