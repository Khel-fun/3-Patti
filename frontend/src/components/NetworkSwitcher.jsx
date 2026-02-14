import { useEffect, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import addresses from '../contracts/addresses.json';

// Get all supported chain IDs from addresses.json
const SUPPORTED_CHAIN_IDS = Object.values(addresses).map(network => network.chainId);

export default function NetworkSwitcher() {
  const { isConnected, chain, address } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    // Only show if wallet is ACTUALLY connected (has address) AND on wrong network
    if (isConnected && address && chain?.id && !SUPPORTED_CHAIN_IDS.includes(chain.id)) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [isConnected, address, chain?.id]);

  if (!isConnected || !address || !isWrongNetwork) return null;

  const handleSwitch = async () => {
    try {
      // Switch to the first supported network
      await switchChain({ chainId: SUPPORTED_CHAIN_IDS[0] });
    } catch (e) {
      console.error('Failed to switch network:', e);
    }
  };

  // return (
  //   <div className="fixed top-0 left-0 right-0 z-[100] animate-slide-in-top duration-500">
  //     <div className="bg-yellow-500/10 backdrop-blur-md border-b border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
  //       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

  //         <div className="flex items-center gap-4">
  //           <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0 border border-yellow-500/30 animate-pulse">
  //             <AlertTriangle className="w-5 h-5 text-yellow-500" />
  //           </div>
  //           <div>
  //             <h3 className="text-white font-black uppercase tracking-wider text-sm">System Alert: Network Mismatch</h3>
  //             <p className="text-yellow-500/80 text-xs font-medium">
  //               Please switch your wallet to <span className="text-white font-bold">Base Sepolia</span> to continue.
  //             </p>
  //           </div>
  //         </div>

  //         <Button
  //           onClick={handleSwitch}
  //           disabled={isSwitching}
  //           className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wide text-xs px-6 h-10 shadow-lg shadow-yellow-500/20 border-none flex items-center gap-2"
  //         >
  //           {isSwitching ? 'Switching...' : (
  //             <>
  //               Switch Network <ArrowRight className="w-3 h-3" />
  //             </>
  //           )}
  //         </Button>

  //       </div>

  //       {/* Progress Bar Line */}
  //       <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent w-full animate-pulse"></div>
  //     </div>
  //   </div>
  // );
}
