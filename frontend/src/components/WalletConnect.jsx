import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Wallet, LogOut, ChevronDown, CheckCircle2, Network } from 'lucide-react';
import Button from './Button';
import { cn } from '@/lib/utils';

// Supported chains configuration
const SUPPORTED_CHAINS = [
  {
    id: 84532,
    name: 'Base Sepolia',
    shortName: 'Base Sepolia',
    icon: '🔵',
    color: 'blue',
    hasContracts: true,
  },
  {
    id: 8453,
    name: 'Base',
    shortName: 'Base',
    icon: '🔵',
    color: 'blue',
    hasContracts: false,
  },
  {
    id: 80002,
    name: 'Polygon Amoy',
    shortName: 'Polygon Amoy',
    icon: '🟣',
    color: 'purple',
    hasContracts: false,
  },
  {
    id: 137,
    name: 'Polygon',
    shortName: 'Polygon',
    icon: '🟣',
    color: 'purple',
    hasContracts: false,
  },
  {
    id: 11155111,
    name: 'Sepolia',
    shortName: 'Sepolia',
    icon: '⚪',
    color: 'gray',
    hasContracts: false,
  },
];

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [showConnectors, setShowConnectors] = useState(false);
  const [showChainSelector, setShowChainSelector] = useState(false);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chain?.id);

  const handleChainSwitch = async (chainId) => {
    try {
      await switchChain({ chainId });
      setShowChainSelector(false);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  // Only show connected state if BOTH isConnected is true AND we have an actual address
  if (isConnected && address && typeof address === 'string' && address.startsWith('0x')) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-3 hover:bg-white/5 transition-colors group relative overflow-hidden">
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />

          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none">Connected</span>
            <span className="text-sm font-mono font-bold text-gray-200 leading-none mt-0.5">{formatAddress(address)}</span>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Chain Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowChainSelector(!showChainSelector)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
              title="Switch Network"
            >
              <Network className="w-3 h-3" />
              <span className="text-xs font-bold">{currentChain?.icon || '🌐'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showChainSelector ? 'rotate-180' : ''}`} />
            </button>

            {showChainSelector && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowChainSelector(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-2xl overflow-hidden z-50 animate-zoom-in duration-200 shadow-2xl border border-white/10">
                  <div className="p-3 space-y-1">
                    <div className="px-2 py-1.5 mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Network</span>
                    </div>

                    {SUPPORTED_CHAINS.map((supportedChain) => {
                      const isActive = chain?.id === supportedChain.id;
                      const isAvailable = supportedChain.hasContracts;

                      return (
                        <button
                          key={supportedChain.id}
                          onClick={() => isAvailable && handleChainSwitch(supportedChain.id)}
                          disabled={isSwitching || !isAvailable}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200",
                            isActive
                              ? "bg-white/10 border border-white/20"
                              : isAvailable
                                ? "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20"
                                : "bg-white/[0.02] border border-white/5 opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{supportedChain.icon}</span>
                            <div className="flex flex-col items-start">
                              <span className={cn(
                                "font-bold text-sm",
                                isActive ? "text-white" : "text-gray-300"
                              )}>
                                {supportedChain.shortName}
                              </span>
                              {!isAvailable && (
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Coming Soon</span>
                              )}
                            </div>
                          </div>
                          {isActive && (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-2 bg-white/[0.02] border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-500">Switch networks to play on different chains</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={() => disconnect()}
          variant="ghost"
          size="icon"
          className="h-9 w-9 opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-full"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={isPending}
        className="shadow-lg shadow-purple-500/20"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showConnectors ? 'rotate-180' : ''}`} />
      </Button>

      {showConnectors && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowConnectors(false)}
          />
          <div className="absolute right-0 mt-3 w-72 glass-panel rounded-2xl overflow-hidden z-50 animate-zoom-in duration-200">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Provider</span>
                <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded">Secure</span>
              </div>

              <div className="space-y-2">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => {
                      connect({ connector });
                      setShowConnectors(false);
                    }}
                    disabled={isPending}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
                        <Wallet className="w-4 h-4 text-gray-300 group-hover:text-white" />
                      </div>
                      <span className="font-bold text-gray-200 group-hover:text-white text-sm">{connector.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center">
              <p className="text-[10px] text-gray-500">By connecting, you agree to our Terms of Service</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
