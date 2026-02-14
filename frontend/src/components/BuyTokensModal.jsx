import React, { useState } from 'react';
import { X, Coins, Loader2, Wallet, ArrowDown } from 'lucide-react';
import { useContracts } from '@/hooks/useContracts';
import { ethers } from 'ethers';
import Button from './Button';
import Input from './Input';

export default function BuyTokensModal({ isOpen, onClose, onSuccess }) {
  const { buyTokens, calculateTokensForWei } = useContracts();
  const [ethAmount, setEthAmount] = useState('');
  const [expectedTokens, setExpectedTokens] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickAmounts = [
    { eth: '0.0001', label: '100 μETH' },
    { eth: '0.001', label: '0.001 ETH' },
    { eth: '0.01', label: '0.01 ETH' },
    { eth: '0.1', label: '0.1 ETH' },
  ];

  async function handleAmountChange(amount) {
    setEthAmount(amount);
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setExpectedTokens('0');
      return;
    }

    try {
      const weiAmount = ethers.parseEther(amount);
      const tokens = await calculateTokensForWei(weiAmount);
      setExpectedTokens(ethers.formatEther(tokens));
    } catch (err) {
      console.error('Error calculating tokens:', err);
      // Fallback calculation if contract call fails (just for display)
      // Assuming 1 ETH = 1,000,000 TPT (example rate)
      setExpectedTokens((parseFloat(amount) * 1000000).toString());
    }
  }

  async function handleBuy() {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const weiAmount = ethers.parseEther(ethAmount);
      const result = await buyTokens(weiAmount);

      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(result.error || 'Transaction failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to buy tokens');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-fade-in duration-300">
      <div className="glass-panel w-full max-w-md rounded-3xl p-[1px] relative overflow-hidden shadow-2xl animate-zoom-in duration-300">

        {/* Animated Border */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent pointer-events-none"></div>

        <div className="bg-[#050505]/95 backdrop-blur-2xl rounded-[23px] relative z-10 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-b from-yellow-500/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] border border-yellow-400/50">
                <Coins className="w-6 h-6 text-black fill-current drop-shadow-sm" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide uppercase font-display">Acquire Chips</h2>
                <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Instant Swap</p>
              </div>
            </div>

            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">

            {/* Input Section */}
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                <span>You Pay</span>
                <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> Base Sepolia ETH</span>
              </div>

              <div className="relative">
                <Input
                  type="number"
                  step="0.00001"
                  min="0"
                  value={ethAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent border-none text-3xl font-mono text-white placeholder:text-gray-800 h-12 p-0 focus:ring-0 w-full"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 bg-white/5 px-2 py-1 rounded">ETH</span>
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount.eth}
                    onClick={() => handleAmountChange(amount.eth)}
                    className="py-1.5 px-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-bold border border-transparent hover:border-white/10 transition-all active:scale-95"
                  >
                    {amount.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center -my-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center shadow-lg text-gray-500">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-gradient-to-br from-yellow-900/10 to-transparent border border-yellow-500/20 rounded-2xl p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-yellow-400/5 group-hover:bg-yellow-400/10 transition-colors duration-500"></div>

              <div className="relative z-10 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-yellow-500/70 uppercase tracking-wider">
                  <span>You Receive</span>
                  <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> Game Chips</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 tracking-tight">
                    {parseFloat(expectedTokens).toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-yellow-600">TPT</span>
                </div>

                <p className="text-[10px] text-gray-500 pt-2 border-t border-yellow-500/10 flex justify-between">
                  <span>Exchange Rate</span>
                  <span className="font-mono text-gray-400">1 ETH ≈ 1M TPT</span>
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-200 text-xs font-medium text-center">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12 bg-transparent border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBuy}
                className="flex-1 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black tracking-wide shadow-[0_0_20px_rgba(234,179,8,0.2)] border-none"
                disabled={loading || !ethAmount || parseFloat(ethAmount) <= 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  'SWAP NOW'
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
