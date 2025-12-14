import React, { useState, useEffect, useRef } from 'react';
import { getRiddle, getUniqueCategories } from './services/gemini';
import { RiddleData, GameState, GameSession, GameMode, GameDifficulty, Team, PartyConfig, Turn, SeriesLength, PartyFlow } from './types';
import { Logo } from './components/Logo';
import { Button } from './components/Button';
import { Scroll, Sparkles, AlertCircle, Trophy, ChevronRight, Crown, Users, User, Star, Shield, Flame, ArrowLeft, Volume2, VolumeX, Clock, Hourglass, SkipForward, Lightbulb, Book, Sun, Smile, Gamepad2, Map, Quote, Plus, Trash2, Info, X, Play, BookOpen, Sword, Cloud, Skull, Heart, Globe, FlameKindling, Share2 } from 'lucide-react';
import { audio } from './services/audio';

// --- VISUAL COMPONENTS ---

const ParticleBackground = ({ mode }: { mode: 'normal' | 'kids' }) => {
  const isKids = mode === 'kids';
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep atmospheric base */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 ${isKids ? 'bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-950' : 'bg-gradient-to-b from-royal-950 via-royal-900 to-black'}`}
      ></div>
      
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
      
      {/* GOD RAYS - Majestic rotating light (Normal mode only) */}
      {!isKids && (
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-[0.07] animate-[spin_60s_linear_infinite] pointer-events-none">
             <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,215,0,0.5)_20deg,transparent_45deg,rgba(255,215,0,0.3)_90deg,transparent_130deg,rgba(255,215,0,0.5)_180deg,transparent_220deg)] blur-3xl"></div>
        </div>
      )}
      
      {/* Animated Light Orbs */}
      <div 
         className={`absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full blur-[100px] animate-pulse-slow opacity-20 ${isKids ? 'bg-cyan-500' : 'bg-purple-900'}`}
      ></div>
      
      <div 
         className={`absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] rounded-full blur-[120px] animate-pulse-slow opacity-15 ${isKids ? 'bg-yellow-400' : 'bg-gold-700'}`} 
         style={{ animationDelay: '3s' }}
      ></div>
      
      {/* Central glow for focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-radial-gradient from-white/5 to-transparent blur-3xl opacity-50 pointer-events-none"></div>

      {/* Floating Particles - 3 Layers of depth */}
      {/* Layer 1: Slow, distant */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={`l1-${i}`}
          className={`absolute rounded-full ${isKids ? 'bg-cyan-200' : 'bg-gold-100'}`}
          style={{
            width: Math.random() * 2 + 'px',
            height: Math.random() * 2 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.2 + 0.05,
            animation: `float ${Math.random() * 20 + 20}s ease-in-out infinite`
          }}
        />
      ))}
      
      {/* Layer 2: Medium */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={`l2-${i}`}
          className={`absolute rounded-full ${isKids ? 'bg-cyan-100' : 'bg-gold-300'}`}
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.3 + 0.1,
            animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      {/* Layer 3: Close, fast, brighter (Fireflies/Sparks) */}
      {!isKids && [...Array(5)].map((_, i) => (
         <div 
           key={`l3-${i}`}
           className="absolute rounded-full bg-gold-400 blur-[1px]"
           style={{
             width: Math.random() * 2 + 2 + 'px',
             height: Math.random() * 2 + 2 + 'px',
             top: Math.random() * 100 + '%',
             left: Math.random() * 100 + '%',
             opacity: 0,
             animation: `pulse-slow ${Math.random() * 3 + 2}s ease-in-out infinite, float ${Math.random() * 10 + 5}s ease-in-out infinite`,
             boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.3)'
           }}
         />
      ))}
    </div>
  );
};

// --- RULES MODAL ---
const RulesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-royal-900 border border-gold-500/30 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gold-500/50 hover:text-gold-400 transition-colors">
          <X size={24} />
        </button>
        
        <h2 className="text-3xl font-serif text-gold-300 mb-6 border-b border-gold-500/20 pb-4 text-center">Sacred Scrolls (Rules)</h2>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h3 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2"><User size={16}/> Solo Pilgrim</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>You have <strong>60 seconds</strong> to solve as many riddles as possible.</li>
              <li>Each correct answer adds time (based on difficulty) and points.</li>
              <li>Streaks of 5+ add <strong>10s</strong>, 10+ add <strong>20s</strong>.</li>
              <li>Incorrect answers reset your streak but do not reduce time instantly (time flows naturally).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2"><Users size={16}/> Congregation (Party Mode)</h3>
            <div className="space-y-4 text-sm">
              <p>Gather your friends in teams. Max 10 players per team.</p>
              
              <div>
                <strong className="text-gold-200">Game Series:</strong>
                <p className="text-xs text-gray-400">Choose length: 1, 3, 5, or 7 rounds per player.</p>
              </div>

              <div>
                <strong className="text-gold-200">Turn-Based Flow:</strong>
                <p className="text-xs text-gray-400">Teams alternate turns. (e.g., Team A Player 1, then Team B Player 1, etc.)</p>
              </div>

              <div>
                <strong className="text-gold-200">Team-Based Flow:</strong>
                <p className="text-xs text-gray-400">One team plays all their rounds consecutively, setting a high score to beat. Then the next team plays.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2"><Star size={16}/> Scoring</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Easy: 100pts | Medium: 200pts | Hard: 300pts</li>
              <li>Streaks apply multipliers to your score.</li>
              <li>Hints cost 5 points each.</li>
            </ul>
          </section>
        </div>

        <div className="mt-8">
           <Button fullWidth onClick={onClose}>I Understand</Button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START_SCREEN);
  const [session, setSession] = useState<GameSession>({ score: 0, streak: 0, highScore: 0 });
  const [currentRiddle, setCurrentRiddle] = useState<RiddleData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(audio.getEnabled());
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showRules, setShowRules] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // -- Party Mode State --
  const [partyConfig, setPartyConfig] = useState<PartyConfig>({
    teams: [
      { id: 't1', name: 'Prophets', players: [{id: 'p1-1', name: 'Player 1'}], score: 0, color: 'text-blue-400' },
      { id: 't2', name: 'Apostles', players: [{id: 'p2-1', name: 'Player 1'}], score: 0, color: 'text-red-400' }
    ],
    seriesLength: 3,
    flow: 'TURN_BASED'
  });
  const [turnQueue, setTurnQueue] = useState<Turn[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

  // Timers
  const [globalTimer, setGlobalTimer] = useState(60);
  const [questionTimer, setQuestionTimer] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isKidsMode = session.difficulty === GameDifficulty.KIDS;
  const isPartyMode = session.mode === GameMode.PARTY;

  useEffect(() => {
    const stored = localStorage.getItem('anointed_highscore');
    if (stored) {
      setSession(s => ({ ...s, highScore: parseInt(stored) }));
    }
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      if (isKidsMode) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      timerRef.current = setInterval(() => {
        // Only run global timer for Single Mode
        if (!isPartyMode) {
          setGlobalTimer((prev) => {
            if (prev <= 1) {
              handleGameOver();
              return 0;
            }
            return prev - 1;
          });
        }

        // Question timer runs for everyone (unless kids)
        setQuestionTimer((prev) => {
          if (prev <= 1) {
            handleQuestionTimeout();
            return 0; 
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, isKidsMode, isPartyMode]);

  const handleGameOver = () => {
    audio.playTransition();
    setGameState(GameState.GAME_SUMMARY);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleQuestionTimeout = () => {
    audio.playError();
    setSession(prev => ({ ...prev, streak: 0 }));
    // In party mode, timeout is just a wrong answer (0 points), move to next turn
    if (isPartyMode) {
       handlePartyNextTurn();
    } else {
       fetchNextRiddle(session.difficulty || GameDifficulty.EASY, 0); 
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    audio.setEnabled(newState);
    if (newState) audio.playClick();
  };

  // --- Party Flow Logic ---

  // Refactored to accept optional config for immediate queue generation
  const generateTurnQueue = (config: PartyConfig = partyConfig) => {
    const queue: Turn[] = [];
    const { teams, seriesLength, flow } = config;

    if (flow === 'TURN_BASED') {
      for (let r = 1; r <= seriesLength; r++) {
        const maxPlayers = Math.max(...teams.map(t => t.players.length));
        for (let pIdx = 0; pIdx < maxPlayers; pIdx++) {
           for (const team of teams) {
             if (team.players[pIdx]) { 
                queue.push({
                  teamId: team.id,
                  playerId: team.players[pIdx].id,
                  playerName: team.players[pIdx].name,
                  teamName: team.name,
                  teamColor: team.color,
                  round: r
                });
             }
           }
        }
      }
    } else {
      // TEAM_BASED (Consecutive)
      for (const team of teams) {
        for (let r = 1; r <= seriesLength; r++) {
           for (const player of team.players) {
              queue.push({
                teamId: team.id,
                playerId: player.id,
                playerName: player.name,
                teamName: team.name,
                teamColor: team.color,
                round: r
              });
           }
        }
      }
    }
    return queue;
  };

  const handlePartyStart = () => {
    const queue = generateTurnQueue();
    setTurnQueue(queue);
    setCurrentTurnIndex(0);
    setGameState(GameState.SETUP_DIFFICULTY); // Proceed to select difficulty for the session
  };

  const handlePartyNextTurn = () => {
    const nextIndex = currentTurnIndex + 1;
    if (nextIndex >= turnQueue.length) {
      handleGameOver();
    } else {
      setCurrentTurnIndex(nextIndex);
      
      // If Kids mode, skip transition screen to keep engagement
      if (session.difficulty === GameDifficulty.KIDS) {
         fetchNextRiddle(session.difficulty, 0, session.category);
      } else {
         setGameState(GameState.TURN_TRANSITION);
      }
    }
  };

  // --- Flow Handlers ---

  const handleStartSetup = () => {
    audio.playClick();
    setGameState(GameState.SETUP_MODE);
  };

  const handleSelectMode = (mode: GameMode) => {
    audio.playClick();
    setSession(prev => ({ ...prev, mode }));
    if (mode === GameMode.PARTY) {
      setGameState(GameState.SETUP_PARTY);
    } else {
      setGameState(GameState.SETUP_DIFFICULTY);
    }
  };

  const handleSelectDifficulty = (difficulty: GameDifficulty) => {
    audio.playTransition(); 
    setSession(prev => ({ ...prev, difficulty, category: undefined })); // Reset category if picking difficulty
    startNewGame(difficulty, undefined);
  };

  const handleSelectCategory = (category: string) => {
    audio.playTransition();
    // When selecting a category, we default to "Medium" difficulty for scoring/timing purposes, 
    // but the riddle fetcher will filter by category primarily.
    setSession(prev => ({ ...prev, difficulty: GameDifficulty.MEDIUM, category }));
    startNewGame(GameDifficulty.MEDIUM, category);
  };

  const startNewGame = (difficulty: GameDifficulty, category?: string) => {
    // Reset basic session
    setSession(prev => ({ ...prev, score: 0, streak: 0, difficulty, category }));
    
    if (isPartyMode) {
      // Create new config object for the new game
      let nextConfig = {
        ...partyConfig,
        // Reset scores
        teams: partyConfig.teams.map(t => ({...t, score: 0}))
      };

      // KIDS MODE OVERRIDE: Force 10 questions per player for Party Mode
      if (difficulty === GameDifficulty.KIDS) {
         nextConfig.seriesLength = 10;
      }
      
      // Update state
      setPartyConfig(nextConfig);

      // Regenerate queue based on the new config (handling the Kids mode change if applicable)
      const newQueue = generateTurnQueue(nextConfig);
      setTurnQueue(newQueue);
      setCurrentTurnIndex(0);
      
      setGameState(GameState.TURN_TRANSITION);
    } else {
      setGlobalTimer(60);
      setQuestionTimer(15); 
      fetchNextRiddle(difficulty, 0, category);
    }
  };

  const startPartyTurn = () => {
    const turn = turnQueue[currentTurnIndex];
    fetchNextRiddle(session.difficulty || GameDifficulty.EASY, 0, session.category);
  };

  const getTimerDuration = (level: number, currentStreak: number) => {
    let base = 15; 
    if (level === 3) base = 20;
    if (level > 3) base = 25;
    
    let bonus = 0;
    if (currentStreak >= 10) bonus = 20;
    else if (currentStreak >= 5) bonus = 10;

    return base + bonus;
  };

  const fetchNextRiddle = async (difficulty: GameDifficulty, streakOverride?: number, category?: string) => {
    setGameState(GameState.LOADING);
    setErrorMsg(null);
    setHintLevel(0); 
    
    const effectiveStreak = streakOverride !== undefined ? streakOverride : session.streak;

    try {
      // Pass category if it exists in session or argument
      const cat = category || session.category;
      const riddle = await getRiddle(difficulty, cat);
      setCurrentRiddle(riddle);
      setQuestionTimer(getTimerDuration(riddle.difficultyLevel, effectiveStreak));
      setSelectedOption(null);
      setIsCorrect(null);
      setGameState(GameState.PLAYING);
    } catch (e) {
      console.error(e);
      setErrorMsg("The scrolls are currently sealed. Please check your connection and try again.");
      setGameState(GameState.ERROR);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; 

    setSelectedOption(option);
    const correct = option === currentRiddle?.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      audio.playSuccess(); 
      const newStreak = session.streak + 1;
      const basePoints = 100;
      if (isPartyMode) {
         const currentTurn = turnQueue[currentTurnIndex];
         const points = basePoints; 
         setPartyConfig(prev => ({
           ...prev,
           teams: prev.teams.map(t => t.id === currentTurn.teamId ? { ...t, score: t.score + points } : t)
         }));
      } else {
         const percentageBonus = 0.02 + ((newStreak - 1) * 0.01); 
         const points = Math.round(basePoints * (1 + percentageBonus));
         const newScore = session.score + points;
         const newHigh = Math.max(newScore, session.highScore);
         setSession(prev => ({ ...prev, score: newScore, streak: newStreak, highScore: newHigh }));
         localStorage.setItem('anointed_highscore', newHigh.toString());
      }
      
      const delay = isKidsMode ? 1500 : 1000;
      setTimeout(() => {
        if (isPartyMode) handlePartyNextTurn();
        else handleNext(newStreak);
      }, delay);

    } else {
       audio.playError(); 
       if (!isPartyMode) setSession(prev => ({ ...prev, streak: 0 }));
       
       const delay = isKidsMode ? 2000 : 1000;
       setTimeout(() => {
         if (isPartyMode) handlePartyNextTurn();
         else handleNext(0);
       }, delay);
    }
  };

  const handleSkip = () => {
    if (selectedOption) return; 
    audio.playClick();
    
    if (isPartyMode) {
       handlePartyNextTurn();
    } else {
       setSession(prev => ({ ...prev, score: Math.max(0, prev.score - 5), streak: 0 }));
       handleNext(0);
    }
  };

  const handleHint = () => {
    if (selectedOption) return;
    if (!isPartyMode && session.score < 5) return; 
    if (isPartyMode) {
       const currentTurn = turnQueue[currentTurnIndex];
       const team = partyConfig.teams.find(t => t.id === currentTurn.teamId);
       if (!team || team.score < 5) return;
       setPartyConfig(prev => ({
           ...prev,
           teams: prev.teams.map(t => t.id === team.id ? { ...t, score: t.score - 5 } : t)
       }));
    }

    if (hintLevel >= 2) return; 

    audio.playClick();
    if (!isPartyMode) setSession(prev => ({ ...prev, score: Math.max(0, prev.score - 5) }));
    setHintLevel(prev => prev + 1);
  };

  const handleNext = (streakOverride?: number) => {
    // If category mode is active, fetch with category
    if (session.category) {
       fetchNextRiddle(session.difficulty || GameDifficulty.MEDIUM, streakOverride, session.category);
    } else {
       fetchNextRiddle(session.difficulty || GameDifficulty.EASY, streakOverride);
    }
  };

  const handleHome = () => {
    audio.playClick();
    setGameState(GameState.START_SCREEN);
  };
  
  const handleShare = async () => {
    const isKids = session.difficulty === GameDifficulty.KIDS;
    let shareText = "";
    
    if (isPartyMode) {
        // Find winner
        const winner = [...partyConfig.teams].sort((a, b) => b.score - a.score)[0];
        const winnerText = winner ? `${winner.name} won` : "We played";
        shareText = `📜 Anointed Bible Riddles: Party Mode\n${winnerText} with ${winner?.score || 0} points!\nCan you beat our congregation?`;
    } else {
        const difficultyStr = session.difficulty === GameDifficulty.KIDS ? "Kids Mode" : session.difficulty || "Easy";
        shareText = `📜 Anointed Bible Riddles\nI scored ${session.score} points on ${difficultyStr}!\nStreak: ${session.streak} 🔥\nCan you solve the mystery?`;
    }

    try {
        await navigator.clipboard.writeText(shareText);
        setCopyFeedback(true);
        audio.playSuccess();
        setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
        console.error("Failed to copy", err);
    }
  };

  // --- Screens ---

  // 1. START SCREEN
  if (gameState === GameState.START_SCREEN) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <ParticleBackground mode="normal" />
        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
        
        <div className="absolute top-6 right-6 z-30 flex gap-3">
             <button onClick={() => setShowRules(true)} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all" title="Rules">
               <Info size={20}/>
             </button>
             <button onClick={toggleSound} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all">
               {soundEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
             </button>
        </div>

        <div className="z-10 flex flex-col items-center max-w-md w-full text-center space-y-12 animate-fade-in mt-8">
          
          <div 
            className="relative group cursor-pointer" 
            onClick={() => audio.playSuccess()}
          >
               <div className="absolute inset-0 bg-gold-500 blur-[80px] opacity-20 animate-pulse-slow"></div>
               <Logo size="lg" className="animate-float relative z-10" />
          </div>

          <div className="space-y-4">
            <div className="relative">
                <h1 className="text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-600 animate-gradient-text drop-shadow-[0_0_35px_rgba(255,215,0,0.6)] tracking-tighter relative z-10">
                Anointed
                </h1>
                <h1 className="text-6xl md:text-8xl font-serif font-black text-gold-500/20 absolute top-1 left-1 blur-sm tracking-tighter -z-10">
                Anointed
                </h1>
            </div>
            
            <div className="flex items-center justify-center gap-4">
               <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60"></div>
               <p className="text-gold-100 font-serif tracking-[0.5em] text-sm uppercase drop-shadow-md">Bible Riddles</p>
               <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60"></div>
            </div>
          </div>

          <div 
              className="w-full glass-panel p-8 rounded-2xl flex flex-col items-center gap-6 animate-slide-up hover:border-gold-500/30 transition-colors duration-500" 
              style={{ animationDelay: '0.2s' }}
          >
             <div className="flex items-center gap-3 text-gold-300 bg-black/20 px-6 py-2 rounded-full border border-white/5">
                <Trophy className="w-5 h-5 text-gold-500" /> 
                <span className="text-sm font-bold uppercase tracking-widest">High Score: <span className="text-white text-lg ml-2">{session.highScore}</span></span>
             </div>
             
             <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent"></div>
             
             <Button onClick={handleStartSetup} fullWidth className="text-xl py-6 shadow-[0_0_30px_-5px_rgba(255,215,0,0.3)] hover:scale-105">
                Enter the Throne Room
             </Button>
             
             <p className="text-xs text-gray-400 mt-2 font-serif italic tracking-wide opacity-70">"It is the glory of God to conceal a matter..."</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. SETUP MODE (Single/Party)
  if (gameState === GameState.SETUP_MODE) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <ParticleBackground mode="normal" />
        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
        
        {/* Navigation Logo - Home Menu Link */}
        <div className="absolute top-6 left-6 z-30 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleHome} title="Return Home">
             <Logo size="sm" />
        </div>
        <button onClick={() => setShowRules(true)} className="absolute top-6 right-6 z-30 p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all" title="Rules">
           <Info size={20}/>
        </button>

        <div className="z-10 w-full max-w-2xl space-y-8 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gold-300 mb-2 text-glow">Choose Your Path</h2>
            <p className="text-gold-100/50 text-sm tracking-[0.2em] uppercase">How shall you journey?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => handleSelectMode(GameMode.SINGLE)}
              className="glass-panel group p-8 rounded-2xl hover:bg-gold-500/5 transition-all duration-300 text-left hover:-translate-y-2 hover:border-gold-500/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <User className="w-24 h-24 text-gold-500" />
              </div>
              <div className="bg-gradient-to-br from-gold-500 to-gold-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-gold-500/30 transition-shadow">
                <User className="w-6 h-6 text-royal-950" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-100 group-hover:text-gold-300 mb-2">Solo Pilgrim</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Face the scroll alone. 60 seconds to prove your knowledge.</p>
            </button>

            <button 
               onClick={() => handleSelectMode(GameMode.PARTY)}
               className="glass-panel group p-8 rounded-2xl hover:bg-gold-500/5 transition-all duration-300 text-left hover:-translate-y-2 hover:border-gold-500/40 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Users className="w-24 h-24 text-gold-500" />
              </div>
               <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
                 <Users className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-2xl font-serif font-bold text-gray-100 group-hover:text-gold-300 mb-2">Congregation</h3>
               <p className="text-sm text-gray-400 leading-relaxed">Pass the device. Compete in teams with friends and family.</p>
            </button>
          </div>

          <div className="flex justify-center mt-12">
            <button onClick={handleHome} className="flex items-center gap-2 text-gold-500/50 hover:text-gold-400 transition-colors uppercase text-xs tracking-widest font-bold">
               <ArrowLeft className="w-4 h-4" /> Return to Entrance
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- NEW: PARTY SETUP SCREEN ---
  if (gameState === GameState.SETUP_PARTY) {
    const addTeam = () => {
      if (partyConfig.teams.length >= 4) return;
      const id = Date.now().toString();
      const colors = ['text-blue-400', 'text-red-400', 'text-green-400', 'text-purple-400'];
      const color = colors[partyConfig.teams.length % colors.length];
      setPartyConfig({
        ...partyConfig,
        teams: [...partyConfig.teams, { id, name: `Team ${partyConfig.teams.length + 1}`, players: [{id: `${id}-p1`, name: 'Player 1'}], score: 0, color }]
      });
    };

    const removeTeam = (teamIndex: number) => {
      // Must maintain at least 2 teams for gameplay logic
      if (partyConfig.teams.length <= 2) return;
      
      const newTeams = [...partyConfig.teams];
      newTeams.splice(teamIndex, 1);
      setPartyConfig({...partyConfig, teams: newTeams});
    };

    const updateTeamName = (teamIndex: number, name: string) => {
      const newTeams = [...partyConfig.teams];
      newTeams[teamIndex].name = name;
      setPartyConfig({...partyConfig, teams: newTeams});
    };

    const addPlayer = (teamIndex: number) => {
      const team = partyConfig.teams[teamIndex];
      if (team.players.length >= 10) return;
      const newPlayer = { id: `${team.id}-p${team.players.length + 1}`, name: `Player ${team.players.length + 1}` };
      const newTeams = [...partyConfig.teams];
      newTeams[teamIndex].players = [...team.players, newPlayer];
      setPartyConfig({...partyConfig, teams: newTeams});
    };

    const updatePlayerName = (teamIndex: number, playerIndex: number, name: string) => {
      const newTeams = [...partyConfig.teams];
      newTeams[teamIndex].players[playerIndex].name = name;
      setPartyConfig({...partyConfig, teams: newTeams});
    };

    const removePlayer = (teamIndex: number, playerIndex: number) => {
      const newTeams = [...partyConfig.teams];
      // Keep at least one player
      if (newTeams[teamIndex].players.length <= 1) return;
      newTeams[teamIndex].players.splice(playerIndex, 1);
      setPartyConfig({...partyConfig, teams: newTeams});
    };

    return (
      <div className="min-h-screen flex flex-col p-6 relative overflow-hidden bg-royal-950">
        <ParticleBackground mode="normal" />
        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
        
        <div className="absolute top-6 right-6 z-30">
           <button onClick={() => setShowRules(true)} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all" title="Rules">
             <Info size={20}/>
           </button>
        </div>

        <div className="z-10 w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
          <header className="text-center mb-8">
             <h2 className="text-3xl font-serif text-gold-300">Congregation Assembly</h2>
             <p className="text-gray-400 text-sm">Gather your tribes</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- CONFIGURATION PANEL --- */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
               <h3 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-4 border-b border-white/10 pb-2">Game Settings</h3>
               
               <div>
                 <label className="block text-gray-400 text-sm mb-2">Flow Style</label>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setPartyConfig({...partyConfig, flow: 'TURN_BASED'})}
                      className={`flex-1 py-3 px-4 rounded-lg border text-sm font-bold transition-all ${partyConfig.flow === 'TURN_BASED' ? 'bg-gold-500/20 border-gold-500 text-gold-300' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}
                    >
                      Turn-Based
                      <span className="block text-[10px] font-normal opacity-60 mt-1">Alternating Teams</span>
                    </button>
                    <button 
                      onClick={() => setPartyConfig({...partyConfig, flow: 'TEAM_BASED'})}
                      className={`flex-1 py-3 px-4 rounded-lg border text-sm font-bold transition-all ${partyConfig.flow === 'TEAM_BASED' ? 'bg-gold-500/20 border-gold-500 text-gold-300' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}
                    >
                      Team-Based
                      <span className="block text-[10px] font-normal opacity-60 mt-1">One Team at a time</span>
                    </button>
                 </div>
               </div>

               <div>
                 <label className="block text-gray-400 text-sm mb-2">Series Length (Rounds per Player)</label>
                 <div className="flex gap-2">
                    {[1, 3, 5, 7].map(num => (
                      <button 
                        key={num}
                        onClick={() => setPartyConfig({...partyConfig, seriesLength: num as SeriesLength})}
                        className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${partyConfig.seriesLength === num ? 'bg-gold-500/20 border-gold-500 text-gold-300' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}
                      >
                        {num}
                      </button>
                    ))}
                 </div>
               </div>
            </div>

            {/* --- TEAM BUILDER --- */}
            <div className="space-y-4">
               {partyConfig.teams.map((team, tIdx) => (
                 <div key={team.id} className="glass-panel p-4 rounded-xl border-l-4 relative" style={{ borderLeftColor: team.color.replace('text-', 'bg-') }}>
                    <div className="flex items-center gap-2 mb-3">
                       <input 
                         value={team.name}
                         onChange={(e) => updateTeamName(tIdx, e.target.value)}
                         className="bg-transparent border-b border-white/20 text-gold-200 font-serif font-bold focus:outline-none focus:border-gold-500 w-full"
                         placeholder="Team Name"
                       />
                       <span className={`text-xs uppercase font-bold ${team.color} whitespace-nowrap`}>{team.players.length} Players</span>
                       
                       {/* Remove Team Button - only shows if > 2 teams */}
                       {partyConfig.teams.length > 2 && (
                         <button 
                           onClick={() => removeTeam(tIdx)} 
                           className="ml-2 text-red-500/50 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                           title="Remove Team"
                         >
                            <Trash2 size={16} />
                         </button>
                       )}
                    </div>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                       {team.players.map((player, pIdx) => (
                         <div key={player.id} className="flex items-center gap-2">
                            <User size={12} className="text-gray-500"/>
                            <input 
                              value={player.name}
                              onChange={(e) => updatePlayerName(tIdx, pIdx, e.target.value)}
                              className="bg-transparent text-sm text-gray-300 w-full focus:outline-none focus:text-white"
                            />
                            {team.players.length > 1 && (
                              <button onClick={() => removePlayer(tIdx, pIdx)} className="text-red-500/50 hover:text-red-400">
                                <Trash2 size={12} />
                              </button>
                            )}
                         </div>
                       ))}
                    </div>
                    <button onClick={() => addPlayer(tIdx)} className="mt-3 text-xs flex items-center gap-1 text-gold-500/60 hover:text-gold-400">
                       <Plus size={12} /> Add Player
                    </button>
                 </div>
               ))}
               
               {partyConfig.teams.length < 4 && (
                 <button onClick={addTeam} className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:border-gold-500/30 hover:text-gold-400 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Another Team
                 </button>
               )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full p-4 bg-royal-950/90 backdrop-blur border-t border-white/10 flex justify-between items-center z-40">
             <button onClick={() => setGameState(GameState.SETUP_MODE)} className="text-sm text-gray-500 hover:text-white uppercase tracking-widest font-bold">Back</button>
             <Button onClick={handlePartyStart} className="px-12">Proceed to Difficulty <ChevronRight className="ml-2 inline" size={16} /></Button>
          </div>
        </div>
      </div>
    );
  }

  // --- TURN TRANSITION SCREEN ---
  if (gameState === GameState.TURN_TRANSITION && isPartyMode) {
    const turn = turnQueue[currentTurnIndex];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-royal-950 text-center">
         <ParticleBackground mode="normal" />
         
         <div className="z-10 max-w-lg w-full animate-scale-in">
            <h2 className="text-gold-500 uppercase tracking-[0.3em] text-sm font-bold mb-6">Next Pilgrim</h2>
            
            <div className={`glass-panel p-10 rounded-3xl border-2 ${turn.teamColor.replace('text-', 'border-')}`}>
               <div className="mb-2 text-gray-400 text-sm uppercase tracking-widest">Team</div>
               <h3 className={`text-3xl font-serif font-black mb-8 ${turn.teamColor}`}>{turn.teamName}</h3>
               
               <div className="w-16 h-1 bg-white/10 mx-auto mb-8 rounded-full"></div>
               
               <div className="mb-2 text-gray-400 text-sm uppercase tracking-widest">Player</div>
               <h1 className="text-5xl font-serif font-bold text-white mb-2">{turn.playerName}</h1>
               <p className="text-gold-500/50 text-xs">Round {turn.round} of {partyConfig.seriesLength}</p>
            </div>

            <Button onClick={startPartyTurn} fullWidth className="mt-10 text-xl">
               <Play className="mr-2" size={20} fill="currentColor" /> Ready!
            </Button>
         </div>
      </div>
    );
  }

  // 3. DIFFICULTY SELECTION
  if (gameState === GameState.SETUP_DIFFICULTY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <ParticleBackground mode="normal" />

        {/* Navigation Logo - Home Menu Link */}
        <div className="absolute top-6 left-6 z-30 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleHome} title="Return Home">
             <Logo size="sm" />
        </div>
        
        <div className="z-10 w-full max-w-lg space-y-6 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-serif font-bold text-gold-300 mb-2 text-glow">Prepare Your Mind</h2>
            <p className="text-gold-100/50 text-sm tracking-[0.2em] uppercase">Select difficulty level</p>
          </div>
          
          {/* KIDS MODE FEATURED CARD */}
          <button 
             onClick={() => handleSelectDifficulty(GameDifficulty.KIDS)}
             className="w-full group glass-panel-kids p-1 rounded-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden mb-6"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
             <div className="bg-cyan-950/40 p-6 rounded-xl flex items-center gap-5 relative z-10">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-full shadow-lg shadow-cyan-500/30 group-hover:animate-spin-slow">
                  <Sun className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                   <h3 className="font-serif font-bold text-cyan-100 text-xl group-hover:text-white transition-colors">Kids Mode</h3>
                   <p className="text-cyan-200/60 text-sm mt-1">Infinite time. Friendly riddles. Fun for all!</p>
                </div>
                <ChevronRight className="w-6 h-6 text-cyan-500/50 group-hover:translate-x-1 transition-transform" />
             </div>
          </button>

          <div className="space-y-4">
            {[
              { id: GameDifficulty.EASY, label: 'Disciple', sub: 'Foundational stories.', icon: Star, color: 'text-green-400', border: 'hover:border-green-500/50', shadow: 'hover:shadow-green-900/20' },
              { id: GameDifficulty.MEDIUM, label: 'Teacher', sub: 'Deeper questions.', icon: Shield, color: 'text-gold-400', border: 'hover:border-gold-500/50', shadow: 'hover:shadow-gold-900/20' },
              { id: GameDifficulty.HARD, label: 'Prophet', sub: 'Obscure details.', icon: Flame, color: 'text-red-400', border: 'hover:border-red-500/50', shadow: 'hover:shadow-red-900/20' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => handleSelectDifficulty(item.id)}
                className={`w-full glass-panel p-5 rounded-xl flex items-center gap-4 transition-all duration-300 hover:bg-white/5 ${item.border} hover:translate-x-1`}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <div className="text-left flex-1">
                    <h3 className="font-serif font-bold text-gray-200">{item.label}</h3>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${item.color} opacity-0 group-hover:opacity-100`}></div>
              </button>
            ))}
          </div>
          
           {/* CATEGORY SELECTOR BUTTON */}
           <div className="pt-4 border-t border-white/5">
              <button 
                onClick={() => setGameState(GameState.SETUP_CATEGORY)}
                className="w-full glass-panel p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 hover:bg-gold-500/10 hover:border-gold-500/50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                     <BookOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-serif font-bold text-gray-200 group-hover:text-gold-200">Select Specific Category</h3>
                    <p className="text-xs text-gray-500">Focus on Prophets, Kings, Parables, etc.</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gold-500 transition-colors" />
              </button>
           </div>

           <button onClick={() => setGameState(isPartyMode ? GameState.SETUP_PARTY : GameState.SETUP_MODE)} className="w-full text-center text-xs uppercase font-bold tracking-widest text-gold-500/40 hover:text-gold-400 mt-6 flex items-center justify-center gap-2">
             <ArrowLeft className="w-3 h-3" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // --- NEW: CATEGORY SELECTION SCREEN ---
  if (gameState === GameState.SETUP_CATEGORY) {
    const categories = getUniqueCategories();
    
    // Map icons to categories
    const getCategoryIcon = (cat: string) => {
       if (cat.includes("Patriarchs")) return <User className="w-6 h-6 text-green-400"/>;
       if (cat.includes("Prophets")) return <Book className="w-6 h-6 text-purple-400"/>;
       if (cat.includes("Kings")) return <Crown className="w-6 h-6 text-gold-500"/>;
       if (cat.includes("Women")) return <Heart className="w-6 h-6 text-rose-400"/>;
       if (cat.includes("Judges")) return <Sword className="w-6 h-6 text-red-400"/>;
       if (cat.includes("Apostles")) return <FlameKindling className="w-6 h-6 text-orange-400"/>;
       if (cat.includes("Gentiles")) return <Globe className="w-6 h-6 text-blue-400"/>;
       if (cat.includes("Angels")) return <Cloud className="w-6 h-6 text-cyan-400"/>;
       if (cat.includes("Enemies")) return <Skull className="w-6 h-6 text-gray-400"/>;
       if (cat.includes("Parables")) return <Lightbulb className="w-6 h-6 text-yellow-400"/>;
       return <Star className="w-6 h-6 text-gold-200"/>;
    };

    return (
      <div className="min-h-screen flex flex-col items-center p-6 relative bg-royal-950 overflow-hidden">
        <ParticleBackground mode="normal" />

        {/* Navigation Logo - Home Menu Link */}
        <div className="absolute top-6 left-6 z-30 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleHome} title="Return Home">
             <Logo size="sm" />
        </div>
        
        <div className="z-10 w-full max-w-4xl space-y-6 animate-fade-in flex flex-col h-full">
           <header className="text-center mb-6 mt-12 md:mt-0">
            <h2 className="text-3xl font-serif font-bold text-gold-300 mb-2">Choose Your Subject</h2>
            <p className="text-gold-100/50 text-xs tracking-[0.2em] uppercase">All difficulty levels included</p>
           </header>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
              {categories.map((cat, idx) => (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className="glass-panel p-6 rounded-xl flex items-center gap-4 hover:bg-gold-500/10 hover:border-gold-500/40 hover:-translate-y-1 transition-all duration-300 text-left group"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                   <div className="p-3 bg-black/30 rounded-full border border-white/5 group-hover:border-gold-500/30 transition-colors">
                      {getCategoryIcon(cat)}
                   </div>
                   <div>
                      <h3 className="font-serif font-bold text-gray-200 group-hover:text-gold-200 text-sm md:text-base leading-tight">{cat}</h3>
                   </div>
                </button>
              ))}
           </div>
           
           <div className="fixed bottom-0 left-0 w-full p-4 bg-royal-950/90 backdrop-blur border-t border-white/10 flex justify-center z-40">
             <button onClick={() => setGameState(GameState.SETUP_DIFFICULTY)} className="text-sm text-gray-500 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Difficulty
             </button>
           </div>
        </div>
      </div>
    );
  }

  // 4. GAME SUMMARY
  if (gameState === GameState.GAME_SUMMARY) {
     const isKids = session.difficulty === GameDifficulty.KIDS;
     
     // Calculate winner for party mode
     let winner: Team | null = null;
     if (isPartyMode) {
        winner = [...partyConfig.teams].sort((a, b) => b.score - a.score)[0];
     }

     return (
       <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
         <ParticleBackground mode={isKids ? 'kids' : 'normal'} />
         
         {/* Navigation Logo - Home Menu Link */}
        <div className="absolute top-6 left-6 z-30 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleHome} title="Return Home">
             <Logo size="sm" className={isKids ? 'grayscale brightness-150 sepia-0 hue-rotate-180' : ''} />
        </div>

         <div className={`z-10 text-center max-w-md w-full p-10 rounded-3xl backdrop-blur-xl border shadow-2xl animate-scale-in ${isKids ? 'bg-cyan-950/60 border-cyan-500/30' : 'bg-royal-900/80 border-gold-500/30'}`}>
            
            <div className="flex justify-center -mt-20 mb-6">
              <div className="relative">
                 <div className={`absolute inset-0 blur-3xl opacity-40 animate-pulse ${isKids ? 'bg-cyan-400' : 'bg-gold-500'}`}></div>
                 <div className={`relative p-6 rounded-full border-4 shadow-2xl ${isKids ? 'bg-cyan-900 border-cyan-400' : 'bg-royal-900 border-gold-500'}`}>
                   {isKids ? (
                       <Star className="w-16 h-16 text-cyan-300 animate-bounce" />
                   ) : (
                       <Trophy className="w-16 h-16 text-gold-400" />
                   )}
                 </div>
              </div>
            </div>

            <div className="space-y-3 mb-10">
               <h2 className={`text-4xl font-serif font-black ${isKids ? 'text-cyan-100 text-glow-cyan' : 'text-gold-300 text-glow'}`}>
                  {isPartyMode ? (winner ? winner.name + " Wins!" : "It's a Tie!") : (isKids ? "Great Job!" : "Time's Up")}
               </h2>
               <p className={`text-sm ${isKids ? 'text-cyan-200/70' : 'text-gold-100/50'}`}>
                  {isPartyMode ? "Glory to the victors." : (isKids ? "You are growing in wisdom!" : "The scroll is rolled shut.")}
               </p>
            </div>

            {isPartyMode ? (
               <div className="space-y-3 mb-8">
                  {partyConfig.teams.sort((a,b) => b.score - a.score).map((team, idx) => (
                    <div key={team.id} className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-bold text-gray-500">#{idx + 1}</span>
                           <span className={`font-serif font-bold ${team.color}`}>{team.name}</span>
                        </div>
                        <span className="font-mono text-xl text-white">{team.score}</span>
                    </div>
                  ))}
               </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className={`p-4 rounded-2xl border ${isKids ? 'bg-black/20 border-cyan-500/20' : 'bg-black/20 border-gold-500/10'}`}>
                    <span className={`text-[10px] uppercase tracking-widest block mb-1 ${isKids ? 'text-cyan-400' : 'text-gold-500/50'}`}>Score</span>
                    <p className={`text-4xl font-serif font-bold ${isKids ? 'text-cyan-200' : 'text-gold-100'}`}>{session.score}</p>
                 </div>
                 <div className={`p-4 rounded-2xl border ${isKids ? 'bg-black/20 border-cyan-500/20' : 'bg-black/20 border-gold-500/10'}`}>
                    <span className={`text-[10px] uppercase tracking-widest block mb-1 ${isKids ? 'text-cyan-400' : 'text-gold-500/50'}`}>Streak</span>
                    <p className={`text-4xl font-serif font-bold ${isKids ? 'text-cyan-200' : 'text-gold-100'}`}>{session.streak}</p>
                 </div>
              </div>
            )}
            
            <Button 
                variant="secondary" 
                onClick={handleShare} 
                fullWidth 
                className={`mb-3 ${isKids ? "!border-cyan-500/30 !text-cyan-200 hover:!bg-cyan-500/20" : ""}`}
            >
                {copyFeedback ? "Copied!" : <><Share2 className="mr-2" size={18} /> Share Scroll</>}
            </Button>

            <Button onClick={() => startNewGame(session.difficulty || GameDifficulty.EASY)} fullWidth className={isKids ? "!bg-cyan-600 !border-cyan-400 hover:!bg-cyan-500" : ""}>
               Play Again
            </Button>
            <button onClick={handleHome} className={`block w-full text-center mt-6 text-xs font-bold uppercase tracking-widest ${isKids ? 'text-cyan-500 hover:text-cyan-300' : 'text-gold-500/50 hover:text-gold-400'}`}>
               Return Home
            </button>
         </div>
       </div>
     );
  }

  // 5. LOADING / ERROR
  if (gameState === GameState.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-royal-950 text-gold-400 overflow-hidden">
        <ParticleBackground mode={isKidsMode ? 'kids' : 'normal'} />
        <div className="relative z-10">
          <div className="absolute inset-0 bg-gold-500 blur-3xl opacity-20 animate-pulse"></div>
          <Crown className="w-20 h-20 animate-bounce text-gold-500 relative z-10 drop-shadow-lg" />
        </div>
        <p className="mt-8 font-serif text-xl animate-pulse text-gold-200 tracking-widest">Consulting the Scribes...</p>
      </div>
    );
  }

  if (gameState === GameState.ERROR) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
         <ParticleBackground mode={isKidsMode ? 'kids' : 'normal'} />
         
         {/* Navigation Logo - Home Menu Link */}
        <div className="absolute top-6 left-6 z-30 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleHome} title="Return Home">
             <Logo size="sm" className={isKidsMode ? 'grayscale brightness-150 sepia-0 hue-rotate-180' : ''} />
        </div>

         <div className="glass-panel p-8 rounded-2xl max-w-sm z-10">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-serif text-gold-400 mb-2">A Stumbling Block</h2>
            <p className="text-gray-400 mb-8">{errorMsg}</p>
            <Button onClick={() => startNewGame(session.difficulty || GameDifficulty.EASY)}>Try Again</Button>
            <button onClick={handleHome} className="mt-4 text-xs text-gray-500 hover:text-gold-400 uppercase tracking-widest">Back to Home</button>
         </div>
       </div>
    );
  }

  // 6. PLAYING
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:max-w-4xl mx-auto relative overflow-hidden">
       <ParticleBackground mode={isKidsMode ? 'kids' : 'normal'} />

       {/* --- RPG HUD Header --- */}
       <header className={`relative z-20 mb-4 rounded-2xl p-4 border backdrop-blur-md shadow-xl transition-all ${isKidsMode ? 'bg-cyan-950/60 border-cyan-500/20' : 'bg-royal-900/60 border-gold-500/10'}`}>
          <div className="flex justify-between items-center">
             
             {/* Left: Branding & Sound */}
             <div className="flex items-center gap-4">
                 <div onClick={handleHome} className="cursor-pointer hover:scale-105 transition-transform" title="Return Home">
                     <Logo size="sm" className={isKidsMode ? 'grayscale brightness-150 sepia-0 hue-rotate-180' : ''} />
                 </div>
                 <div className="hidden sm:block">
                   <h2 className={`font-serif font-bold leading-none ${isKidsMode ? 'text-cyan-100' : 'text-gold-200'}`}>Who Am I?</h2>
                   <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60 mt-1">
                      {isKidsMode ? <span className="text-cyan-400"><Smile size={10} className="inline mr-1"/> Kids Mode</span> : <span className="text-gold-400">{session.category || session.mode}</span>}
                   </div>
                 </div>
                 <button onClick={toggleSound} className={`p-2 rounded-full border transition-all ${isKidsMode ? 'bg-cyan-900/50 border-cyan-500/30 text-cyan-400' : 'bg-royal-800/50 border-gold-500/20 text-gold-400'}`}>
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                 </button>
             </div>

             {/* Right: Stats */}
             <div className="flex gap-3 sm:gap-6 items-center">
                 {/* Score Badge */}
                 <div className="flex flex-col items-end">
                    <span className={`text-[9px] uppercase tracking-widest font-bold ${isKidsMode ? 'text-cyan-500' : 'text-gold-600'}`}>
                      {isPartyMode ? 'Team Score' : 'Score'}
                    </span>
                    <div className="flex items-center gap-2">
                       <span className={`font-serif font-black text-2xl ${isKidsMode ? 'text-cyan-100 text-glow-cyan' : 'text-gold-100 text-glow'}`}>
                         {isPartyMode 
                           ? partyConfig.teams.find(t => t.id === turnQueue[currentTurnIndex]?.teamId)?.score || 0
                           : session.score}
                       </span>
                    </div>
                 </div>

                 {/* Party Mode Player Indicator */}
                 {isPartyMode && (
                   <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Pilgrim</span>
                      <div className="flex items-center gap-1">
                         <span className={`font-serif font-bold text-sm ${turnQueue[currentTurnIndex]?.teamColor}`}>{turnQueue[currentTurnIndex]?.playerName}</span>
                      </div>
                   </div>
                 )}

                 {/* Streak Badge (Only Single) */}
                 {!isKidsMode && !isPartyMode && (
                   <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-orange-500">Streak</span>
                      <div className="flex items-center gap-1 text-orange-400">
                         <Flame size={16} fill="currentColor" className={session.streak > 2 ? 'animate-bounce' : ''} />
                         <span className="font-serif font-black text-xl">{session.streak}</span>
                      </div>
                   </div>
                 )}

                 {/* Timer / Infinite Badge */}
                 {isKidsMode ? (
                     <div className="bg-cyan-500/20 w-12 h-12 flex items-center justify-center rounded-full border border-cyan-500/40">
                        <span className="text-2xl text-cyan-300 mb-1">∞</span>
                     </div>
                 ) : (
                     <div className="relative w-12 h-12 flex items-center justify-center bg-royal-950/50 rounded-full border border-gold-500/20 shadow-inner">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 48 48">
                           {/* Background Track */}
                           <circle cx="24" cy="24" r="20" stroke="rgba(255,215,0,0.1)" strokeWidth="3" fill="transparent" />
                           {/* Active Progress */}
                           <circle 
                              cx="24" cy="24" r="20" 
                              stroke={globalTimer < 10 ? '#ef4444' : '#eab308'} 
                              strokeWidth="3" 
                              fill="transparent" 
                              strokeDasharray="125.66"
                              strokeDashoffset={125.66 * (1 - (isPartyMode ? 1 : globalTimer / 60))} 
                              strokeLinecap="round"
                              className={`transition-[stroke-dashoffset] duration-1000 ease-linear ${isPartyMode ? 'opacity-0' : ''}`}
                           />
                        </svg>
                        <span className={`text-sm font-bold font-mono ${globalTimer < 10 && !isPartyMode ? 'text-red-400 animate-pulse' : 'text-gold-100'}`}>
                           {isPartyMode ? (turnQueue.length - currentTurnIndex) : globalTimer}
                        </span>
                        {isPartyMode && <span className="absolute text-[8px] bottom-2 text-gray-500 uppercase tracking-widest">Left</span>}
                     </div>
                 )}
                 
                 {isKidsMode && <button onClick={() => setGameState(GameState.GAME_SUMMARY)} className="text-xs font-bold text-red-400 hover:text-red-300 uppercase">Exit</button>}
             </div>
          </div>
          
          {/* Question Timer Bar */}
          {!isKidsMode && (
             <div className="absolute bottom-0 left-0 w-full h-1 bg-black/50 overflow-hidden rounded-b-2xl">
                 <div 
                   className="h-full bg-gradient-to-r from-gold-700 via-gold-500 to-white shadow-[0_0_10px_#FFD700] transition-all duration-1000 ease-linear"
                   style={{ width: `${(questionTimer / (currentRiddle ? getTimerDuration(currentRiddle.difficultyLevel, session.streak) : 15)) * 100}%` }}
                 ></div>
             </div>
          )}
       </header>

       <main className="flex-1 flex flex-col justify-center w-full z-10 relative">
          
          {/* --- The Riddle Artifact --- */}
          <div className={`relative backdrop-blur-xl rounded-3xl p-5 md:p-8 shadow-2xl overflow-hidden transition-all duration-500 animate-slide-up hover:shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] ${isKidsMode ? 'bg-cyan-950/40 border border-cyan-400/30' : 'bg-royal-900/60 border border-gold-500/30'}`}>
            
            {/* Inner glow effect */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${isKidsMode ? 'bg-cyan-400' : 'bg-gold-500'}`}></div>

            {/* Question Header */}
            <div className="mb-4 relative z-10">
               <div className="flex justify-between items-start mb-4">
                  
                  {/* Difficulty Badge */}
                  {(() => {
                     const diff = currentRiddle?.difficulty;
                     let dColor = "text-gold-300";
                     let dBg = "bg-gold-500/10";
                     let dBorder = "border-gold-500/30";
                     let dIcon = <Sparkles className="w-3 h-3" />;

                     if (diff === 'Easy') {
                        dColor = "text-emerald-400";
                        dBg = "bg-emerald-500/10";
                        dBorder = "border-emerald-500/30";
                        dIcon = <Star className="w-3 h-3" />;
                     } else if (diff === 'Medium') {
                        dColor = "text-amber-400";
                        dBg = "bg-amber-500/10";
                        dBorder = "border-amber-500/30";
                        dIcon = <Shield className="w-3 h-3" />;
                     } else if (diff === 'Hard') {
                        dColor = "text-rose-400";
                        dBg = "bg-rose-500/10";
                        dBorder = "border-rose-500/30";
                        dIcon = <Flame className="w-3 h-3" />;
                     } else if (diff === 'Kids') {
                        dColor = "text-cyan-300";
                        dBg = "bg-cyan-500/10";
                        dBorder = "border-cyan-500/30";
                        dIcon = <Smile className="w-3 h-3" />;
                     }

                     return (
                       <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-widest ${dBg} ${dBorder} ${dColor} shadow-[0_0_10px_-5px_currentColor]`}>
                          {dIcon}
                          {diff}
                       </div>
                     );
                  })()}
                  
                  {/* Category Tag */}
                  <div className={`text-[10px] uppercase tracking-widest font-bold opacity-60 ${isKidsMode ? 'text-cyan-200' : 'text-gold-200'}`}>
                     {currentRiddle?.category}
                  </div>
               </div>
               
               {/* NEW POETIC QUESTION FORMAT */}
               <div className="relative mt-2">
                 {/* Decorative Quote Icon */}
                 <Quote className={`absolute -top-4 -left-2 w-8 h-8 opacity-20 transform -scale-x-100 ${isKidsMode ? 'text-cyan-400' : 'text-gold-400'}`} />
                 
                 {/* Text Display with Crimson Pro Font */}
                 <div className={`font-riddle text-2xl md:text-3xl leading-relaxed text-center italic ${
                     isKidsMode 
                        ? 'text-cyan-100 drop-shadow-[0_2px_4px_rgba(8,145,178,0.5)]' 
                        : 'text-transparent bg-clip-text bg-gradient-to-br from-gold-100 via-gold-300 to-gold-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
                 }`}>
                    {currentRiddle?.question.split('\n').map((line, i) => (
                      <p key={i} className={`pb-3 ${line.trim() === '' ? 'h-4' : ''}`}>
                        {line}
                      </p>
                    ))}
                 </div>
               </div>
               
               {/* HINTS */}
               <div className="min-h-[20px] mt-6 space-y-2">
                  {hintLevel > 0 && (
                    <div className="flex items-center justify-center gap-3 animate-scale-in">
                       <div className="p-2 bg-gold-500/20 rounded-lg"><Lightbulb size={14} className="text-gold-400"/></div>
                       <span className="text-sm text-gold-200 font-serif"><span className="text-gold-500 font-bold uppercase text-xs mr-2">Category:</span> {currentRiddle?.category}</span>
                    </div>
                  )}
                  {hintLevel > 1 && (
                    <div className="flex items-center justify-center gap-3 animate-scale-in" style={{animationDelay: '0.1s'}}>
                       <div className="p-2 bg-blue-500/20 rounded-lg"><Book size={14} className="text-blue-400"/></div>
                       <span className="text-sm text-blue-200 font-serif"><span className="text-blue-400 font-bold uppercase text-xs mr-2">Book:</span> {currentRiddle?.reference}</span>
                    </div>
                  )}
               </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
               {currentRiddle?.options.map((option, idx) => {
                 let stateStyles = isKidsMode 
                    ? "bg-cyan-900/40 border-cyan-500/20 text-cyan-100 hover:bg-cyan-500/20 hover:border-cyan-400/50" 
                    : "bg-royal-800/40 border-gold-500/20 text-gray-200 hover:bg-gold-500/10 hover:border-gold-500/50";
                 
                 let icon = null;

                 if (selectedOption) {
                    if (option === currentRiddle.correctAnswer) {
                       stateStyles = "bg-green-500/20 border-green-400 text-green-100 shadow-[0_0_20px_rgba(34,197,94,0.2)] scale-[1.02]";
                       icon = <Crown className="w-5 h-5 text-green-400 animate-bounce" />;
                    } else if (option === selectedOption) {
                       stateStyles = "bg-red-500/20 border-red-400 text-red-100 opacity-80";
                       icon = <AlertCircle className="w-5 h-5 text-red-400" />;
                    } else {
                       stateStyles = "opacity-30 grayscale";
                    }
                 }

                 return (
                   <button
                     key={idx}
                     disabled={selectedOption !== null}
                     onClick={() => handleOptionSelect(option)}
                     className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group backdrop-blur-sm ${stateStyles}`}
                   >
                     <span className="font-sans font-medium text-lg">{option}</span>
                     {icon}
                   </button>
                 );
               })}
            </div>

            {/* Feedback for Kids */}
            {selectedOption && !isCorrect && isKidsMode && (
                <div className="mt-4 p-4 bg-cyan-800/50 border border-cyan-400/30 rounded-xl text-center animate-fade-in">
                    <p className="text-cyan-200 font-serif text-lg font-bold flex items-center justify-center gap-2">
                       <Smile className="text-cyan-400" /> Nice try! Keep going!
                    </p>
                </div>
            )}

            {/* Bottom Controls */}
            <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-6">
               <button
                  onClick={handleHint}
                  disabled={selectedOption !== null || hintLevel >= 2 || (!isPartyMode && session.score < 5)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-widest ${
                      isKidsMode 
                      ? 'text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-30'
                      : 'text-gold-400 hover:text-gold-200 hover:bg-gold-500/10 disabled:opacity-30'
                  }`}
               >
                  {hintLevel >= 2 ? 'Max Hints Used' : 'Reveal Hint (-5 pts)'}
               </button>

               <button
                  onClick={handleSkip}
                  disabled={selectedOption !== null}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-30"
               >
                  Skip <SkipForward size={14} />
               </button>
            </div>
          </div>

       </main>
    </div>
  );
}