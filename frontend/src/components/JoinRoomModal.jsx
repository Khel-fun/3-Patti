import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { X, Loader2, Coins, AlertCircle, Search, ShieldCheck } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import { useContracts } from '@/hooks/useContracts';
import { useWallet } from '@/hooks/useWallet';
import { useAccount, useReadContract } from 'wagmi';
import TokenABI from '@/contracts/TeenPattiToken.json';
import addresses from '@/contracts/addresses.json';
import { expandShortCode } from '@/lib/utils';

export default function JoinRoomModal({ isOpen, onClose, onSuccess, socket, roomId: initialRoomId }) {
  const { account } = useWallet();
  const { address: walletAddress } = useAccount();
  const { joinRoom, approveTokens, getRoomDetails, contractAddresses } = useContracts();

  // Get token balance
  const { data: balance } = useReadContract({
    address: addresses.baseSepolia?.TeenPattiToken,
    abi: TokenABI.abi,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: !!walletAddress,
    },
  });

  const [blockchainRoomId, setBlockchainRoomId] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState(''); // User input (can be short code or full ID)
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [resolvingCode, setResolvingCode] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('input'); // input, approving, joining

  useEffect(() => {
    if (initialRoomId) {
      setRoomCodeInput(initialRoomId);
      setBlockchainRoomId(initialRoomId);
    }
  }, [initialRoomId]);

  useEffect(() => {
    if (blockchainRoomId && blockchainRoomId.startsWith('0x')) {
      fetchRoomDetails();
    }
  }, [blockchainRoomId]);

  // Socket listener for room code resolution
  useEffect(() => {
    if (!socket) return;

    const handleRoomCodeResolved = ({ success, blockchainRoomId: resolvedId, error: resolveError }) => {
      setResolvingCode(false);
      if (success && resolvedId) {
        setBlockchainRoomId(resolvedId);
        setError('');
      } else {
        setError(resolveError || 'Room code not found');
        setBlockchainRoomId('');
        setRoomDetails(null);
      }
    };

    socket.on('roomCodeResolved', handleRoomCodeResolved);

    return () => {
      socket.off('roomCodeResolved', handleRoomCodeResolved);
    };
  }, [socket]);

  if (!isOpen) return null;

  // Handle room code input and resolve short codes if needed
  function handleRoomCodeChange(value) {
    setRoomCodeInput(value);
    setError('');
    setRoomDetails(null);
    
    const trimmed = value.trim();
    
    // If it's already a full blockchain ID (starts with 0x and is long)
    if (trimmed.startsWith('0x') && trimmed.length > 10) {
      setBlockchainRoomId(trimmed);
      setResolvingCode(false);
    } 
    // If it looks like a short code (6 hex characters)
    else if (trimmed.length >= 4 && /^[0-9a-fA-F]+$/.test(trimmed)) {
      // Don't resolve yet, wait for user to click search
      setBlockchainRoomId('');
    } else {
      setBlockchainRoomId('');
    }
  }

  // Resolve short code to full blockchain room ID
  function handleResolveCode() {
    const trimmed = roomCodeInput.trim();
    
    if (!trimmed) {
      setError('Please enter a room code');
      return;
    }

    // If already a full ID, just use it
    if (trimmed.startsWith('0x') && trimmed.length > 10) {
      setBlockchainRoomId(trimmed);
      return;
    }

    // Try to resolve as short code
    if (socket) {
      setResolvingCode(true);
      setError('');
      const cleanCode = expandShortCode(trimmed);
      socket.emit('resolveRoomCode', { shortCode: cleanCode });
    } else {
      setError('Not connected to server');
    }
  }

  async function fetchRoomDetails() {
    setLoadingDetails(true);
    setError('');

    try {
      const details = await getRoomDetails(blockchainRoomId);

      if (!details) {
        setError('Room not found on blockchain');
        setRoomDetails(null);
        return;
      }

      console.log(details)

      if (Number(details.state) !== 0) { // 0 = WAITING
        setError('Room is not accepting players');
        setRoomDetails(null);
        return;
      }

      setRoomDetails(details);
    } catch (err) {
      console.error('Error fetching room details:', err);
      setError('Failed to fetch room details');
      setRoomDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }

  async function handleJoin() {
    if (!account) {
      setError('Please connect your wallet');
      return;
    }

    if (!blockchainRoomId || !blockchainRoomId.startsWith('0x')) {
      setError('Please enter a valid blockchain room ID');
      return;
    }

    if (!roomDetails) {
      setError('Please load room details first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const buyInAmount = roomDetails.buyIn;

      // Step 1: Approve tokens
      setStep('approving');
      console.log('Approving tokens...');

      const approveResult = await approveTokens(
        contractAddresses.TeenPattiGame,
        buyInAmount
      );

      if (!approveResult.success) {
        throw new Error(approveResult.error || 'Failed to approve tokens');
      }

      console.log('Tokens approved:', approveResult.txHash);

      // Step 2: Join room on blockchain
      setStep('joining');
      console.log('Joining room on blockchain...');

      const joinResult = await joinRoom(blockchainRoomId);

      if (!joinResult.success) {
        throw new Error(joinResult.error || 'Failed to join room');
      }

      console.log('Joined room on blockchain:', joinResult);

      // Step 3: Notify backend via Socket.IO
      if (socket) {
        // Convert balance to number (in tokens, not wei)
        const tokenBalance = balance ? parseFloat(ethers.formatEther(balance)) : 0;

        socket.emit('joinRoomWithBlockchain', {
          blockchainRoomId: blockchainRoomId,
          player: account,
          txHash: joinResult.txHash,
          tokenBalance: tokenBalance,
          // Use on-chain room buy-in (in token units) as starting chips for off-chain game
          buyInTokens: Number(ethers.formatEther(roomDetails.buyIn))
        });

        // Wait for backend confirmation
        socket.once('roomJoined', ({ roomId }) => {
          setLoading(false);
          setStep('input');
          onSuccess(roomId, blockchainRoomId);
        });

        socket.once('error', ({ message }) => {
          setLoading(false);
          setStep('input');
          setError(message);
        });
      } else {
        // No socket, just return success
        setLoading(false);
        setStep('input');
        onSuccess(null, blockchainRoomId);
      }

    } catch (err) {
      console.error('Error joining room:', err);
      setLoading(false);
      setStep('input');

      let errorMessage = err.message;
      if (err.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient token balance';
      } else if (err.message.includes('Already joined')) {
        errorMessage = 'You have already joined this room';
      } else if (err.message.includes('Room is full')) {
        errorMessage = 'Room is full';
      }

      setError(errorMessage);
    }
  }

  function handleClose() {
    if (!loading) {
      setStep('input');
      setError('');
      setRoomDetails(null);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-fade-in duration-300">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-[1px] relative overflow-hidden shadow-2xl animate-zoom-in duration-300">

        {/* Animated Border */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

        <div className="bg-[#050505]/95 backdrop-blur-2xl rounded-[23px] relative z-10 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-inner">
                <Search className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide uppercase font-display">Join Table</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Blockchain Entry</p>
              </div>
            </div>

            <Button
              onClick={handleClose}
              disabled={loading}
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">

            {/* Room Code Input */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                Room Code
              </label>
              <p className="text-xs text-gray-500 -mt-2">
                Enter a 6-character room code (e.g., A399E5) or full blockchain ID
              </p>
              <div className="flex gap-2 relative group">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => handleRoomCodeChange(e.target.value)}
                    placeholder="A399E5 or 0x..."
                    disabled={loading || loadingDetails || resolvingCode}
                    className="bg-black/50 border-white/10 text-white font-mono text-sm placeholder:text-gray-700 h-12 px-4 rounded-xl focus:border-white/20 transition-all focus:ring-1 focus:ring-white/10 w-full uppercase"
                  />
                </div>
                <Button
                  onClick={handleResolveCode}
                  disabled={loading || loadingDetails || resolvingCode || !roomCodeInput.trim()}
                  size="icon"
                  className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-105 active:scale-95"
                >
                  {(loadingDetails || resolvingCode) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Room Details Card */}
            <div className={`overflow-hidden transition-all duration-500 ${roomDetails ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-6 space-y-4 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck className="w-20 h-20 text-white" />
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Entry Fee</p>
                    <p className="text-xl font-black text-white font-mono tracking-wide flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      {roomDetails ? ethers.formatEther(roomDetails.buyIn) : '0'} <span className="text-sm text-gray-600">TPT</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold text-green-400 uppercase tracking-wide flex items-center gap-1 justify-end">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Active
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Players</p>
                    <p className="text-white font-mono font-bold">{roomDetails?.currentPlayers.toString()} / {roomDetails?.maxPlayers.toString()}</p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pot Size</p>
                    <p className="text-yellow-400 font-mono font-bold">{roomDetails ? ethers.formatEther(roomDetails.pot) : '0'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Status */}
            {loading && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-100">Processing Transaction</p>
                  <p className="text-xs text-blue-300/70 mt-0.5">
                    {step === 'approving' && 'Approving Token Spend... Check Wallet.'}
                    {step === 'joining' && 'Joining Room on Chain... Check Wallet.'}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-200 text-xs font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <Button
                onClick={handleClose}
                disabled={loading}
                variant="outline"
                className="flex-1 h-12 bg-transparent border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoin}
                disabled={loading || !roomDetails}
                className="flex-1 h-12 bg-gradient-to-r from-amber-600 via-yellow-500 to-slate-300 hover:from-amber-500 hover:via-yellow-400 hover:to-slate-200 text-gray-900 font-black tracking-wide shadow-[0_0_20px_rgba(234,179,8,0.4)] border border-white/40"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Join'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
