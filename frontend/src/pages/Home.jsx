import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gamepad2,
  Users,
  Trophy,
  Sparkles,
  Zap,
  Shield,
  Coins,
  Play,
  Crown,
  ChevronDown,
  Activity,
  Lock,
  ArrowRight
} from "lucide-react";
import Button from "@/components/Button";
import WalletConnect from "@/components/WalletConnect";
import TokenBalance from "@/components/TokenBalance";
import BuyTokensModal from "@/components/BuyTokensModal";
import CreateRoomModal from "@/components/CreateRoomModal";
import JoinRoomModal from "@/components/JoinRoomModal";
import { useWallet } from "@/hooks/useWallet.jsx";
import { cn } from "@/lib/utils";

export default function Home({ socket }) {
  const navigate = useNavigate();
  const { isConnected, account } = useWallet();
  const [error, setError] = useState("");
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  function handleCreateRoomSuccess(socketRoomId, blockchainRoomId) {
    console.log("Room created:", { socketRoomId, blockchainRoomId });
    setShowCreateRoom(false);

    if (blockchainRoomId) {
      navigate(`/room/${blockchainRoomId}`, {
        state: {
          playerId: account,
          playerName: account.slice(0, 6),
          blockchainRoomId,
        },
      });
    }
  }

  function handleJoinRoomSuccess(socketRoomId, blockchainRoomId) {
    console.log("Room joined:", { socketRoomId, blockchainRoomId });
    setShowJoinRoom(false);

    if (blockchainRoomId) {
      navigate(`/room/${blockchainRoomId}`, {
        state: {
          playerId: account,
          playerName: account.slice(0, 6),
          blockchainRoomId,
        },
      });
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white font-sans selection:bg-white/20">

      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[150px] animate-pulse delay-1000"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-700"></div>

        {/* Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-400 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shine" />
              <Crown className="w-6 h-6 text-black fill-current drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 font-display leading-none">
                TEEN PATTI
              </h1>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold ml-1 mt-1 group-hover:text-white transition-colors duration-300">
                Premium Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-widest text-gray-500 uppercase">
              {['Tournaments', 'Leaderboard', 'VIP Club'].map((item) => (
                <a key={item} href="#" className="hover:text-white transition-colors relative group py-2">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-3000 ease-out" />
                </a>
              ))}
            </div>
            <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center min-h-[calc(100vh-96px)]">

        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-24 relative">

          {/* New Tag */}
          <div className="inline-flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 hover:bg-white/10 transition-colors cursor-default group">
            <span className="flex items-center justify-center px-1.5 py-0.5 rounded bg-gradient-to-r from-yellow-500 to-amber-600 text-[10px] font-black text-black uppercase tracking-wider shadow-lg shadow-yellow-500/20">
              New
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-gray-300 group-hover:text-white transition-colors">
              The Next Gen Experience
            </span>
            <ChevronDown className="w-3 h-3 text-gray-500 -rotate-90" />
          </div>

          {/* Main Title */}
          <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter relative z-10">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-600 drop-shadow-2xl">
              TEEN PATTI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-16 leading-relaxed">
            High-stakes poker on the <span className="text-white font-medium">blockchain</span>.
            <br className="hidden md:block" />
            Proven fair. Infinitely scalable.
          </p>

          {!isConnected ? (
            <div className="flex flex-col items-center gap-8 animate-fade-in-up">
              <div className="glass-panel p-1 rounded-2xl max-w-md w-full mx-auto relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
                <div className="bg-black/80 rounded-xl p-8 border border-white/5 relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:border-white/30 transition-colors">
                    <Shield className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
                  <p className="text-gray-400 text-sm mb-6 text-center">Connect your secure wallet to access the premium tables and start winning.</p>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">Secure Connection</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto animate-fade-in-up px-4">

              {/* Create Room Card */}
              <div className="group relative silver-border rounded-3xl p-[1px] transition-transform duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-white/5 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative h-full bg-[#050505] rounded-[23px] overflow-hidden flex flex-col">
                  {/* Card Header Image/Design */}
                  <div className="h-32 bg-gradient-to-b from-gray-800 to-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex flex-col flex-1 items-center text-center">
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Table</h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                      Host a private high-stakes game. <br /> Set your rules. Control the pot.
                    </p>
                    <Button
                      onClick={() => setShowCreateRoom(true)}
                      className="w-full mt-auto bg-white/10 hover:bg-white/20 border-white/30"
                      size="lg"
                    >
                      Start Hosting
                    </Button>
                  </div>
                </div>
              </div>

              {/* Join Room Card */}
              <div className="group relative silver-border rounded-3xl p-[1px] transition-transform duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-white/5 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative h-full bg-[#050505] rounded-[23px] overflow-hidden flex flex-col">
                  {/* Card Header Image/Design */}
                  <div className="h-32 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <Users className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex flex-col flex-1 items-center text-center">
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Join Table</h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                      Enter a unique Room ID to join <br /> live action instantly.
                    </p>
                    <Button
                      onClick={() => setShowJoinRoom(true)}
                      variant="secondary"
                      className="w-full mt-auto"
                      size="lg"
                    >
                      Enter Room ID
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Quick Stats Bar */}
          {isConnected && (
            <div className="mt-16 flex flex-wrap justify-center gap-6 animate-fade-in-up items-center">
              <div className="glass-panel rounded-full pl-2 pr-6 py-2 flex items-center gap-4">
                <TokenBalance />
                <div className="h-8 w-px bg-white/10" />
                <Button
                  onClick={() => setShowBuyTokens(true)}
                  variant="ghost"
                  className="rounded-full px-4 h-8 text-xs hover:bg-white/10 border border-white/5"
                >
                  <Coins className="w-3 h-3 mr-2 text-yellow-500" />
                  Acquire Chips
                </Button>
              </div>

              <div className={cn(
                "px-6 py-3 rounded-full border backdrop-blur-md text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3 transition-colors",
                socket
                  ? "bg-green-500/5 border-green-500/20 text-green-400"
                  : "bg-red-500/5 border-red-500/20 text-red-500"
              )}>
                <div className="relative">
                  <div className={cn("w-2 h-2 rounded-full", socket ? "bg-green-400" : "bg-red-500")}></div>
                  {socket && <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>}
                </div>
                {socket ? 'System Online' : 'Reconnecting...'}
              </div>
            </div>
          )}

        </div>

        {/* Features Grid - Glass Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl mb-32 px-4">
          {[
            { icon: Users, title: "Multiplayer", desc: "Real-time 2-6 Player Tables" },
            { icon: Zap, title: "Instant Action", desc: "Zero Latency Gameplay" },
            { icon: Trophy, title: "Ranked Play", desc: "Global Leaderboards" },
            { icon: Lock, title: "Secure", desc: "Blockchain Verified" }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
              <feature.icon className="w-10 h-10 text-gray-500 mb-6 group-hover:text-white transition-colors relative z-10" />
              <h4 className="text-xl font-bold text-white mb-2 relative z-10 font-display tracking-tight">{feature.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed relative z-10">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* How to Play - Industrial Accordion */}
        <div className="w-full max-w-4xl mb-20 px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-700 uppercase tracking-[0.5em]">Game Manual</h2>
          </div>

          <div className="border border-white/10 rounded-3xl overflow-hidden bg-[#050505]">
            <details className="group open:bg-black/40 transition-colors duration-300">
              <summary className="flex items-center justify-between p-8 cursor-pointer hover:bg-white/5 transition-colors list-none select-none">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <span className="block text-xl font-bold text-white tracking-wide">Rules & Strategy</span>
                    <span className="text-sm text-gray-500">Master the basics of Teen Patti</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-open:bg-white/10 group-open:rotate-180 transition-all duration-300">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </summary>

              <div className="px-8 pb-10 pt-2 grid gap-8 border-t border-white/5 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                {/* Hand Rankings */}
                <div className="relative z-10">
                  <h5 className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                    <Trophy className="w-4 h-4 text-yello-500" />
                    Winning Hands
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { rank: "1", title: "Trail (Trio)", desc: "Three of a kind (AAA highest)" },
                      { rank: "2", title: "Pure Sequence", desc: "Straight Flush" },
                      { rank: "3", title: "Sequence", desc: "Straight" },
                      { rank: "4", title: "Color", desc: "Flush" },
                      { rank: "5", title: "Pair", desc: "Two of a kind" },
                    ].map((hand, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-2xl font-black text-white/10">{hand.rank}</span>
                        <div>
                          <div className="font-bold text-white">{hand.title}</div>
                          <div className="text-xs text-gray-500">{hand.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Play Styles */}
                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-white/5">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Blind Play
                    </h5>
                    <p className="text-sm text-gray-400 leading-relaxed">Bet without seeing cards. Moves cost 50% less.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-white/5">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Seen Play
                    </h5>
                    <p className="text-sm text-gray-400 leading-relaxed">View your cards before betting. Regular stakes apply.</p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-12 border-t border-white/5 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Crown className="w-4 h-4" />
            <span className="font-black tracking-widest">KHEL.FUN</span>
          </div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">© 2026 All rights reserved.</p>
        </footer>

      </main>

      {/* Modals */}
      <BuyTokensModal
        isOpen={showBuyTokens}
        onClose={() => setShowBuyTokens(false)}
        onSuccess={() => {
          setShowBuyTokens(false);
        }}
      />

      <CreateRoomModal
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        onSuccess={handleCreateRoomSuccess}
        socket={socket}
      />

      <JoinRoomModal
        isOpen={showJoinRoom}
        onClose={() => setShowJoinRoom(false)}
        onSuccess={handleJoinRoomSuccess}
        socket={socket}
      />

    </div>
  );
}
