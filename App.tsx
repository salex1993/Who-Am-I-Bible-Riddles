import React, { useState, useEffect, useRef } from 'react';
import { getRiddle, getUniqueCategories, getDailyRiddles } from './services/gemini';
import { RiddleData, GameState, GameSession, GameMode, GameDifficulty, Team, PartyConfig, Turn, SeriesLength, PartyFlow, AvatarId, LeaderboardEntry, PlayerProfile, Achievement } from './types';
import { Logo } from './components/Logo';
import { Button } from './components/Button';
import { Scroll, Sparkles, AlertCircle, Trophy, ChevronRight, Crown, Users, User, Star, Shield, Flame, ArrowLeft, Volume2, VolumeX, Clock, Hourglass, SkipForward, Lightbulb, Book, Sun, Smile, Gamepad2, Map, Quote, Plus, Trash2, Info, X, Play, BookOpen, Sword, Cloud, Skull, Heart, Globe, FlameKindling, Share2, Percent, Anchor, Medal, Calendar, Swords, Unlock, TreeDeciduous, Sprout, Leaf } from 'lucide-react';
import { audio } from './services/audio';

// --- CONFIG ---
const AVATARS: Record<AvatarId, { icon: React.ElementType, label: string, color: string }> = {
  crown: { icon: Crown, label: "Kingly", color: "text-gold-400" },
  flame: { icon: Flame, label: "Spirit", color: "text-orange-500" },
  shield: { icon: Shield, label: "Faith", color: "text-blue-400" },
  sword: { icon: Sword, label: "Truth", color: "text-red-400" },
  sun: { icon: Sun, label: "Light", color: "text-yellow-400" },
  heart: { icon: Heart, label: "Love", color: "text-pink-400" },
  book: { icon: Book, label: "Wisdom", color: "text-purple-400" },
  cloud: { icon: Cloud, label: "Glory", color: "text-cyan-200" },
  anchor: { icon: Anchor, label: "Hope", color: "text-teal-400" },
  globe: { icon: Globe, label: "Mission", color: "text-green-400" },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Patriarchs & Matriarchs": Star,
  "Judges & Deliverers": Shield,
  "Women of the Bible": Heart,
  "Kings & Rulers": Crown,
  "Prophets & Seers": Flame,
  "Enemies & Villains": Skull,
  "Gentiles & Foreigners": Globe,
  "Apostles & Early Church": Users,
  "Parables & Symbolic Figures": Book,
  "Angels & Heavenly Beings": Cloud,
};

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_steps', title: 'Novice Pilgrim', description: 'Complete your first game.', icon: 'User', xpReward: 50 },
  { id: 'wisdom_seeker', title: 'Wisdom Seeker', description: 'Reach 2,000 Total XP.', icon: 'Book', xpReward: 200 },
  { id: 'faithful', title: 'Faithful Servant', description: 'Play Daily Manna 3 days in a row.', icon: 'Calendar', xpReward: 500 },
  { id: 'sword_master', title: 'Sword of Truth', description: 'Score 500+ in Sword Drill.', icon: 'Swords', xpReward: 300 },
  { id: 'prophetic_streak', title: 'Prophet’s Voice', description: 'Achieve a streak of 10.', icon: 'Flame', xpReward: 1000 },
];

const RANKS = [
  { name: 'Seeker', minXP: 0 },
  { name: 'Shepherd', minXP: 500 },
  { name: 'Disciple', minXP: 2000 },
  { name: 'Servant', minXP: 5000 },
  { name: 'Teacher', minXP: 10000 },
  { name: 'Judge', minXP: 25000 },
  { name: 'King', minXP: 50000 },
  { name: 'Prophet', minXP: 100000 }
];

// --- LOGIC HELPERS ---
const getWisdomLevel = (xp: number) => {
    if (!xp) return 0;
    if (xp < 500) return 1;
    if (xp < 1500) return 2;
    if (xp < 3000) return 3;
    if (xp < 5000) return 4;
    return 5;
};

const getWisdomLevelName = (level: number) => {
    return ["Unknown", "Seed", "Sprout", "Sapling", "Branch", "Fruitful"][level];
};

// --- VISUAL COMPONENTS ---

const Confetti = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string, speed: number, angle: number, spin: number}>>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FDB813', '#4ADE80', '#60A5FA', '#F472B6', '#FFFFFF'];
    const count = 50;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: 50, // Start center-ish
      y: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 15 + 10,
      angle: Math.random() * 360,
      spin: Math.random() * 10
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: p.color,
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${Math.cos(p.angle * Math.PI / 180) * 40}vw), calc(-50% + ${Math.sin(p.angle * Math.PI / 180) * 40}vh)) rotate(${p.spin * 360}deg)`,
            transition: `all 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)`,
            opacity: 0
          }}
          ref={(el) => {
             if (el) {
                requestAnimationFrame(() => {
                    el.style.transform = `translate(${Math.cos(p.angle * Math.PI / 180) * (Math.random() * 500 + 100)}px, ${Math.sin(p.angle * Math.PI / 180) * (Math.random() * 500 + 100)}px) rotate(${Math.random() * 720}deg)`;
                    el.style.opacity = '1';
                    setTimeout(() => { el.style.opacity = '0'; el.style.top = '100%' }, 1000 + Math.random() * 500);
                });
             }
          }}
        />
      ))}
    </div>
  );
};

const ParticleBackground = ({ mode }: { mode: 'normal' | 'kids' }) => {
  const isKids = mode === 'kids';
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className={`absolute inset-0 transition-colors duration-1000 ${isKids ? 'bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-950' : 'bg-gradient-to-b from-royal-950 via-royal-900 to-black'}`}></div>
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
      {!isKids && (
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-[0.07] animate-[spin_60s_linear_infinite] pointer-events-none">
             <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(255,215,0,0.5)_20deg,transparent_45deg,rgba(255,215,0,0.3)_90deg,transparent_130deg,rgba(255,215,0,0.5)_180deg,transparent_220deg)] blur-3xl"></div>
        </div>
      )}
      <div className={`absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full blur-[100px] animate-pulse-slow opacity-20 ${isKids ? 'bg-cyan-500' : 'bg-purple-900'}`}></div>
      <div className={`absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] rounded-full blur-[120px] animate-pulse-slow opacity-15 ${isKids ? 'bg-yellow-400' : 'bg-gold-700'}`} style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-radial-gradient from-white/5 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
    </div>
  );
};

// --- AVATAR SELECTOR ---
const AvatarSelector = ({ selected, onSelect }: { selected: AvatarId, onSelect: (id: AvatarId) => void }) => {
  return (
    <div className="grid grid-cols-5 gap-2 md:gap-4 p-2">
      {Object.entries(AVATARS).map(([id, data]) => {
        const isSelected = selected === id;
        const Icon = data.icon;
        return (
          <button
            key={id}
            onClick={() => { audio.playClick(); onSelect(id as AvatarId); }}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 ${isSelected ? 'bg-gold-500/20 border-gold-400 scale-110 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-black/20 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
          >
             <Icon className={`w-6 h-6 mb-1 ${isSelected ? data.color : 'text-gray-500'}`} />
          </button>
        );
      })}
    </div>
  );
};

// --- WISDOM TREE COMPONENT ---
const WisdomTreeModal = ({ profile, onClose }: { profile: PlayerProfile, onClose: () => void }) => {
    // Map categories to tree coordinates (x: %, y: %)
    const nodes = [
        { id: "Patriarchs & Matriarchs", x: 30, y: 80 },
        { id: "Judges & Deliverers", x: 70, y: 80 },
        { id: "Women of the Bible", x: 50, y: 70 },
        { id: "Kings & Rulers", x: 25, y: 60 },
        { id: "Prophets & Seers", x: 75, y: 60 },
        { id: "Enemies & Villains", x: 15, y: 50 },
        { id: "Gentiles & Foreigners", x: 85, y: 50 },
        { id: "Apostles & Early Church", x: 35, y: 35 },
        { id: "Parables & Symbolic Figures", x: 65, y: 35 },
        { id: "Angels & Heavenly Beings", x: 50, y: 15 },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-2xl h-[80vh] bg-royal-950 border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 z-50 text-gold-500/50 hover:text-gold-400 p-2 bg-black/40 rounded-full"><X size={24} /></button>
                
                <div className="absolute top-4 left-6 z-10">
                    <h2 className="text-3xl font-serif text-gold-300 drop-shadow-lg flex items-center gap-3"><TreeDeciduous /> Wisdom Tree</h2>
                    <p className="text-gold-500/40 text-xs uppercase tracking-widest">Grow in knowledge</p>
                </div>

                {/* Tree Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                         {/* Branches connecting nodes */}
                         <path d="M50 90 L30 80" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M50 90 L70 80" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M30 80 L50 70" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M70 80 L50 70" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M50 70 L25 60" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M50 70 L75 60" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M25 60 L15 50" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M75 60 L85 50" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M25 60 L35 35" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M75 60 L65 35" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M35 35 L50 15" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         <path d="M65 35 L50 15" stroke="#4A3000" strokeWidth="1" strokeOpacity="0.5" />
                         {/* Trunk Base */}
                         <path d="M50 100 L50 70" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" />
                         <defs>
                             <linearGradient id="trunkGrad" x1="0" y1="1" x2="0" y2="0">
                                 <stop offset="0%" stopColor="#8B4513" />
                                 <stop offset="100%" stopColor="#CD853F" />
                             </linearGradient>
                         </defs>
                    </svg>

                    {nodes.map((node, index) => {
                        const xp = profile.categoryProgress?.[node.id] || 0;
                        const level = getWisdomLevel(xp);
                        const isUnlocked = level > 0;
                        const Icon = CATEGORY_ICONS[node.id] || Star;
                        
                        // Node Colors based on level
                        let bgClass = "bg-gray-900 border-gray-700 text-gray-700";
                        if (level === 1) bgClass = "bg-amber-900/80 border-amber-700 text-amber-500";
                        if (level === 2) bgClass = "bg-green-900/80 border-green-700 text-green-400";
                        if (level === 3) bgClass = "bg-blue-900/80 border-blue-500 text-blue-300";
                        if (level === 4) bgClass = "bg-purple-900/80 border-purple-500 text-purple-300";
                        if (level === 5) bgClass = "bg-gold-500 border-white text-royal-950 shadow-[0_0_15px_#FFD700]";

                        return (
                            <div 
                                key={node.id} 
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 group animate-scale-in"
                                style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${bgClass} ${isUnlocked ? 'hover:scale-110 cursor-pointer shadow-lg' : 'opacity-50'}`}>
                                    <Icon size={isUnlocked ? 24 : 20} />
                                    {level > 0 && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black border border-white/20 rounded-full flex items-center justify-center text-[10px] font-bold text-white">{level}</div>}
                                </div>
                                
                                {/* Tooltip */}
                                <div className="absolute left-1/2 bottom-full mb-1 md:mb-2 -translate-x-1/2 w-28 md:w-48 p-2 md:p-3 bg-black/90 border border-gold-500/30 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                                    <div className="text-gold-400 font-bold text-[9px] md:text-xs mb-0.5 md:mb-1 leading-tight">{node.id}</div>
                                    <div className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-wider mb-0.5 md:mb-1">{getWisdomLevelName(level)}</div>
                                    <div className="w-full bg-gray-800 h-0.5 md:h-1 rounded-full overflow-hidden">
                                        <div className="h-full bg-gold-500" style={{width: `${Math.min(100, (xp % 500) / 500 * 100)}%`}}></div>
                                    </div>
                                    <div className="text-white font-mono text-[8px] md:text-[10px] mt-0.5 md:mt-1 text-right">{xp} XP</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- LEADERBOARD COMPONENT ---
const HallOfFaith = ({ entries, onClose }: { entries: LeaderboardEntry[], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
       <div className="bg-royal-950 border border-gold-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gold-500/50 hover:text-gold-400"><X size={24} /></button>
          
          <div className="text-center mb-6">
             <Trophy className="w-12 h-12 text-gold-500 mx-auto mb-2" />
             <h2 className="text-3xl font-serif text-gold-200">Hall of Faith</h2>
             <p className="text-gold-500/50 text-xs uppercase tracking-widest">Legends of the Word</p>
          </div>

          <div className="space-y-2 mb-6">
             {entries.length === 0 ? (
               <div className="text-center py-8 text-gray-500 italic">No legends recorded yet. Be the first!</div>
             ) : (
               entries.map((entry, idx) => {
                 const AvatarIcon = AVATARS[entry.avatar].icon;
                 const color = AVATARS[entry.avatar].color;
                 return (
                   <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${idx === 0 ? 'bg-gold-900/20 border-gold-500/50' : 'bg-white/5 border-white/5'}`}>
                      <div className="flex items-center gap-3">
                         <span className={`font-mono text-sm font-bold w-6 text-right ${idx === 0 ? 'text-gold-400' : 'text-gray-500'}`}>{idx + 1}</span>
                         <div className={`p-1.5 rounded-lg bg-black/40 ${color}`}>
                            <AvatarIcon size={16} />
                         </div>
                         <div>
                            <span className="font-serif font-bold text-gray-200 block leading-none">{entry.name}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{entry.difficulty}</span>
                         </div>
                      </div>
                      <span className="font-mono font-bold text-gold-100">{entry.score}</span>
                   </div>
                 );
               })
             )}
          </div>
          <Button fullWidth onClick={onClose} variant="outline">Close Scroll</Button>
       </div>
    </div>
  );
};

// --- PROFILE COMPONENT ---
const ProfileModal = ({ profile, onClose }: { profile: PlayerProfile, onClose: () => void }) => {
  const nextRank = RANKS.find(r => r.minXP > profile.totalXP) || RANKS[RANKS.length - 1];
  const currentRank = RANKS.slice().reverse().find(r => r.minXP <= profile.totalXP) || RANKS[0];
  const progress = Math.min(100, (profile.totalXP / nextRank.minXP) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
       <div className="bg-royal-950 border border-gold-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gold-500/50 hover:text-gold-400"><X size={24} /></button>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
             <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center border-2 border-gold-500 text-gold-400">
               <Crown size={32} />
             </div>
             <div>
                <h2 className="text-2xl font-serif text-gold-200">{currentRank.name}</h2>
                <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Total XP: {profile.totalXP}</div>
             </div>
          </div>

          <div className="mb-6">
             <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress to {nextRank.name}</span>
                <span>{profile.totalXP} / {nextRank.minXP}</span>
             </div>
             <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-gold-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                 <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Games Played</div>
                 <div className="text-xl font-serif text-white">{profile.gamesPlayed}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                 <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Best Streak</div>
                 <div className="text-xl font-serif text-white">{profile.bestStreak}</div>
              </div>
          </div>

          <h3 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-3">Seals of Achievement</h3>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
             {ACHIEVEMENTS.map(ach => {
                const unlocked = !!profile.achievements[ach.id];
                return (
                  <div key={ach.id} className={`flex items-center gap-3 p-3 rounded-lg border ${unlocked ? 'bg-gold-500/10 border-gold-500/30' : 'bg-black/20 border-white/5 opacity-50'}`}>
                     <div className={`p-2 rounded-full ${unlocked ? 'bg-gold-500 text-royal-950' : 'bg-white/10 text-gray-500'}`}>
                        <Medal size={16} />
                     </div>
                     <div>
                        <div className={`font-bold text-sm ${unlocked ? 'text-gold-200' : 'text-gray-400'}`}>{ach.title}</div>
                        <div className="text-xs text-gray-500">{ach.description}</div>
                     </div>
                     {unlocked && <div className="ml-auto text-gold-500"><Unlock size={14}/></div>}
                  </div>
                );
             })}
          </div>
       </div>
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
              <li>Incorrect answers reset your streak but do not reduce time instantly.</li>
            </ul>
          </section>

          <section>
             <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2"><Swords size={16}/> Sword Drill (Sudden Death)</h3>
             <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>No timer. Pure knowledge.</li>
                <li><strong>One strike and you are out.</strong></li>
                <li>Score multipliers increase as you progress.</li>
             </ul>
          </section>

          <section>
             <h3 className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2"><Sun size={16}/> Daily Manna</h3>
             <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>3 specific riddles every day. Same for everyone.</li>
                <li>Build your daily streak.</li>
             </ul>
          </section>

          <section>
            <h3 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2"><Users size={16}/> Congregation (Party Mode)</h3>
            <div className="space-y-4 text-sm">
              <p>Gather your friends in teams. Max 10 players per team.</p>
              <div><strong className="text-gold-200">Game Series:</strong> Choose length: 1, 3, 5, or 7 rounds per player.</div>
              <div><strong className="text-gold-200">Flow:</strong> Teams can alternate turns or play consecutively.</div>
            </div>
          </section>

          <section>
            <h3 className="text-green-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2"><TreeDeciduous size={16}/> The Wisdom Tree</h3>
            <p className="text-sm">Your knowledge grows as you answer. Each category you master will sprout, grow branches, and bear fruit on your personal Wisdom Tree. Check your growth from the start screen.</p>
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
  const [session, setSession] = useState<GameSession>({ score: 0, streak: 0, highScore: 0, avatar: 'crown', categoryScores: {} });
  const [currentRiddle, setCurrentRiddle] = useState<RiddleData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(audio.getEnabled());
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showRules, setShowRules] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  
  // New States
  const [dailyRiddles, setDailyRiddles] = useState<RiddleData[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showWisdomTree, setShowWisdomTree] = useState(false);
  const [ascensionOffer, setAscensionOffer] = useState(false);
  const [growthUpdates, setGrowthUpdates] = useState<{category: string, oldLevel: number, newLevel: number, xpGained: number}[]>([]);
  
  // Profile State
  const [profile, setProfile] = useState<PlayerProfile>({
     totalXP: 0,
     rank: 'Seeker',
     dailyStreak: 0,
     lastDailyDate: '',
     achievements: {},
     gamesPlayed: 0,
     bestStreak: 0,
     categoryProgress: {}
  });

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [initials, setInitials] = useState("");
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

  // -- Party Mode State --
  const [partyConfig, setPartyConfig] = useState<PartyConfig>({
    teams: [
      { id: 't1', name: 'Prophets', players: [{id: 'p1-1', name: 'Player 1'}], score: 0, color: 'text-blue-400', avatar: 'flame' },
      { id: 't2', name: 'Apostles', players: [{id: 'p2-1', name: 'Player 1'}], score: 0, color: 'text-red-400', avatar: 'shield' }
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
  const isDaily = session.mode === GameMode.DAILY;
  const isSuddenDeath = session.mode === GameMode.SUDDEN_DEATH;

  useEffect(() => {
    // Load local storage
    const storedScore = localStorage.getItem('anointed_highscore');
    if (storedScore) setSession(s => ({ ...s, highScore: parseInt(storedScore) }));

    const storedLB = localStorage.getItem('anointed_hall_of_faith');
    if (storedLB) {
      try {
        setLeaderboard(JSON.parse(storedLB));
      } catch (e) { console.error("Failed to parse leaderboard"); }
    }

    const storedProfile = localStorage.getItem('anointed_profile');
    if (storedProfile) {
       try { setProfile(JSON.parse(storedProfile)); } catch(e) { console.error("Failed to parse profile"); }
    }
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      if (isKidsMode || isSuddenDeath) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      timerRef.current = setInterval(() => {
        if (!isPartyMode && !isDaily) {
          setGlobalTimer((prev) => {
            if (prev <= 1) {
              handleGameOver();
              return 0;
            }
            return prev - 1;
          });
        }
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
  }, [gameState, isKidsMode, isPartyMode, isDaily, isSuddenDeath]);

  const handleGameOver = () => {
    audio.playTransition();
    setGameState(GameState.GAME_SUMMARY);
    setHasSubmittedScore(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Update Profile
    const newProfile = { ...profile };
    newProfile.gamesPlayed += 1;
    newProfile.totalXP += session.score;
    newProfile.bestStreak = Math.max(newProfile.bestStreak, session.streak);

    // Calculate Wisdom Tree Growth
    const updates: {category: string, oldLevel: number, newLevel: number, xpGained: number}[] = [];
    if (session.categoryScores) {
        Object.entries(session.categoryScores).forEach(([cat, xp]) => {
            const oldXP = newProfile.categoryProgress[cat] || 0;
            const newXP = oldXP + xp;
            newProfile.categoryProgress[cat] = newXP;

            const oldLvl = getWisdomLevel(oldXP);
            const newLvl = getWisdomLevel(newXP);
            
            if (xp > 0) {
               updates.push({ category: cat, oldLevel: oldLvl, newLevel: newLvl, xpGained: xp });
            }
        });
    }
    setGrowthUpdates(updates);

    // Update Rank
    const currentRank = RANKS.slice().reverse().find(r => r.minXP <= newProfile.totalXP) || RANKS[0];
    newProfile.rank = currentRank.name;

    // Daily Logic
    if (isDaily) {
        if (session.score > 0) { // Considered 'played' if > 0 points
             const today = new Date().toISOString().split('T')[0];
             if (newProfile.lastDailyDate !== today) {
                 newProfile.dailyStreak += 1;
                 newProfile.lastDailyDate = today;
             }
        }
    }

    // Achievements Check
    ACHIEVEMENTS.forEach(ach => {
        if (!newProfile.achievements[ach.id]) {
            let unlocked = false;
            if (ach.id === 'first_steps' && newProfile.gamesPlayed >= 1) unlocked = true;
            if (ach.id === 'wisdom_seeker' && newProfile.totalXP >= 2000) unlocked = true;
            if (ach.id === 'faithful' && newProfile.dailyStreak >= 3) unlocked = true;
            if (ach.id === 'sword_master' && isSuddenDeath && session.score >= 500) unlocked = true;
            if (ach.id === 'prophetic_streak' && session.streak >= 10) unlocked = true;

            if (unlocked) {
                newProfile.achievements[ach.id] = Date.now();
                newProfile.totalXP += ach.xpReward;
                audio.playPowerup();
            }
        }
    });

    setProfile(newProfile);
    localStorage.setItem('anointed_profile', JSON.stringify(newProfile));
  };

  const handleQuestionTimeout = () => {
    audio.playError();
    setSession(prev => ({ ...prev, streak: 0 }));
    if (isPartyMode) {
       handlePartyNextTurn();
    } else if (isDaily) {
       handleNext(0);
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

  // --- Leaderboard Logic ---
  const saveToLeaderboard = () => {
    if (!initials.trim()) return;
    
    const newEntry: LeaderboardEntry = {
      name: initials.toUpperCase().slice(0, 3),
      score: session.score,
      avatar: session.avatar,
      difficulty: session.difficulty || 'EASY',
      date: Date.now()
    };

    const newLB = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep top 5
    
    setLeaderboard(newLB);
    localStorage.setItem('anointed_hall_of_faith', JSON.stringify(newLB));
    setHasSubmittedScore(true);
    audio.playSuccess();
  };

  const isHighScore = session.score > 0 && (!leaderboard.length || session.score > leaderboard[leaderboard.length - 1].score || leaderboard.length < 5);

  // --- Party Flow Logic ---
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
                  teamAvatar: team.avatar,
                  round: r
                });
             }
           }
        }
      }
    } else {
      // TEAM_BASED
      for (const team of teams) {
        for (let r = 1; r <= seriesLength; r++) {
           for (const player of team.players) {
              queue.push({
                teamId: team.id,
                playerId: player.id,
                playerName: player.name,
                teamName: team.name,
                teamColor: team.color,
                teamAvatar: team.avatar,
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
    setGameState(GameState.SETUP_DIFFICULTY);
  };

  const handlePartyNextTurn = () => {
    const nextIndex = currentTurnIndex + 1;
    if (nextIndex >= turnQueue.length) {
      handleGameOver();
    } else {
      setCurrentTurnIndex(nextIndex);
      if (session.difficulty === GameDifficulty.KIDS) {
         fetchNextRiddle(session.difficulty, 0, session.category);
      } else {
         setGameState(GameState.TURN_TRANSITION);
      }
    }
  };

  const handleStartSetup = () => {
    audio.playClick();
    setGameState(GameState.SETUP_MODE);
  };

  const handleSelectMode = (mode: GameMode) => {
    audio.playClick();
    setSession(prev => ({ ...prev, mode }));
    if (mode === GameMode.PARTY) {
      setGameState(GameState.SETUP_PARTY);
    } else if (mode === GameMode.DAILY) {
      handleStartDaily();
    } else if (mode === GameMode.SUDDEN_DEATH) {
      startNewGame(GameDifficulty.HARD);
    } else {
      setGameState(GameState.SETUP_DIFFICULTY);
    }
  };

  const handleStartDaily = async () => {
      setGameState(GameState.LOADING);
      const today = new Date().toISOString().split('T')[0];
      const daily = await getDailyRiddles(today);
      setDailyRiddles(daily);
      setSession(prev => ({ ...prev, mode: GameMode.DAILY, dailyIndex: 0, score: 0, streak: 0, categoryScores: {} }));
      setCurrentRiddle(daily[0]);
      setQuestionTimer(30);
      setGameState(GameState.PLAYING);
  };

  const handleSelectDifficulty = (difficulty: GameDifficulty) => {
    audio.playTransition(); 
    setSession(prev => ({ ...prev, difficulty, category: undefined }));
    startNewGame(difficulty, undefined);
  };

  const handleSelectCategory = (category: string) => {
    audio.playTransition();
    setSession(prev => ({ ...prev, difficulty: GameDifficulty.MEDIUM, category }));
    startNewGame(GameDifficulty.MEDIUM, category);
  };

  const startNewGame = (difficulty: GameDifficulty, category?: string) => {
    setSession(prev => ({ ...prev, score: 0, streak: 0, difficulty, category, categoryScores: {} }));
    setHasSubmittedScore(false);
    
    if (isPartyMode) {
      let nextConfig = {
        ...partyConfig,
        teams: partyConfig.teams.map(t => ({...t, score: 0}))
      };
      if (difficulty === GameDifficulty.KIDS) {
         nextConfig.seriesLength = 10;
      }
      setPartyConfig(nextConfig);
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
    fetchNextRiddle(session.difficulty || GameDifficulty.EASY, 0, session.category);
  };

  const getTimerDuration = (level: number, currentStreak: number) => {
    if (isDaily) return 30;
    if (isSuddenDeath) return 0; // Infinite
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
    setDisabledOptions([]);
    const effectiveStreak = streakOverride !== undefined ? streakOverride : session.streak;
    try {
      const cat = category || session.category;
      const d = isSuddenDeath ? GameDifficulty.HARD : difficulty;
      const riddle = await getRiddle(d, cat);
      setCurrentRiddle(riddle);
      setQuestionTimer(getTimerDuration(riddle.difficultyLevel, effectiveStreak));
      setSelectedOption(null);
      setIsCorrect(null);
      setGameState(GameState.PLAYING);
    } catch (e) {
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
      let basePoints = 100;
      
      if (isSuddenDeath) {
         const multiplier = 1 + (newStreak * 0.1);
         basePoints = Math.round(100 * multiplier);
      }

      // Update category tracking
      if (currentRiddle) {
         const cat = currentRiddle.category;
         setSession(prev => ({
             ...prev,
             categoryScores: {
                 ...prev.categoryScores,
                 [cat]: (prev.categoryScores?.[cat] || 0) + basePoints
             }
         }));
      }

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
      const delay = isKidsMode ? 1500 : 2500;
      setTimeout(() => {
        if (!isPartyMode && !isDaily && !isSuddenDeath && session.difficulty === GameDifficulty.EASY && newStreak === 5) {
             setAscensionOffer(true);
        } else {
            if (isPartyMode) handlePartyNextTurn();
            else handleNext(newStreak);
        }
      }, delay);
    } else {
       audio.playError(); 
       if (isSuddenDeath) {
           setTimeout(() => handleGameOver(), 2000);
           return;
       }
       if (!isPartyMode && !isDaily) setSession(prev => ({ ...prev, streak: 0 }));
       const delay = isKidsMode ? 2000 : 2500;
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
    } else if (isDaily) {
       handleNext(0);
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

  const handleFiftyFifty = () => {
     if (selectedOption || disabledOptions.length > 0 || !currentRiddle) return;
     if (!isPartyMode && session.score < 40) return;
     if (isPartyMode) {
        const currentTurn = turnQueue[currentTurnIndex];
        const team = partyConfig.teams.find(t => t.id === currentTurn.teamId);
        if (!team || team.score < 40) return;
        setPartyConfig(prev => ({
           ...prev,
           teams: prev.teams.map(t => t.id === team.id ? { ...t, score: t.score - 40 } : t)
        }));
     } else {
        setSession(prev => ({ ...prev, score: Math.max(0, prev.score - 40) }));
     }
     audio.playPowerup();
     const correct = currentRiddle.correctAnswer;
     const incorrects = currentRiddle.options.filter(o => o !== correct);
     for (let i = incorrects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [incorrects[i], incorrects[j]] = [incorrects[j], incorrects[i]];
     }
     setDisabledOptions(incorrects.slice(0, 2));
  };

  const handleNext = (streakOverride?: number) => {
    if (ascensionOffer) {
        // handled in UI
        return;
    }

    if (isDaily) {
        const nextIndex = (session.dailyIndex || 0) + 1;
        if (nextIndex >= dailyRiddles.length) {
            handleGameOver();
        } else {
            setSession(s => ({...s, dailyIndex: nextIndex}));
            setCurrentRiddle(dailyRiddles[nextIndex]);
            setQuestionTimer(30);
            setSelectedOption(null);
            setIsCorrect(null);
            setGameState(GameState.PLAYING);
        }
    } else if (session.category) {
       fetchNextRiddle(session.difficulty || GameDifficulty.MEDIUM, streakOverride, session.category);
    } else {
       fetchNextRiddle(session.difficulty || GameDifficulty.EASY, streakOverride);
    }
  };

  const handleAscend = (accept: boolean) => {
      setAscensionOffer(false);
      if (accept) {
          audio.playPowerup();
          setSession(s => ({...s, difficulty: GameDifficulty.MEDIUM}));
          // Fetch next as Medium
          fetchNextRiddle(GameDifficulty.MEDIUM, session.streak);
      } else {
          // Stay Easy
          fetchNextRiddle(GameDifficulty.EASY, session.streak);
      }
  };

  const handleHome = () => {
    audio.playClick();
    setGameState(GameState.START_SCREEN);
  };
  
  const handleShare = async () => {
    let shareText = "";
    if (isPartyMode) {
        const winner = [...partyConfig.teams].sort((a, b) => b.score - a.score)[0];
        const winnerText = winner ? `${winner.name} won` : "We played";
        shareText = `📜 Anointed Bible Riddles: Party Mode\n${winnerText} with ${winner?.score || 0} points!\nCan you beat our congregation?`;
    } else {
        const difficultyStr = session.difficulty === GameDifficulty.KIDS ? "Kids Mode" : session.difficulty || "Easy";
        shareText = `📜 Anointed Bible Riddles\nI scored ${session.score} points on ${difficultyStr}!\nStreak: ${session.streak} 🔥\nAvatar: ${AVATARS[session.avatar].label}\nCan you solve the mystery?`;
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
        {showLeaderboard && <HallOfFaith entries={leaderboard} onClose={() => setShowLeaderboard(false)} />}
        {showProfile && <ProfileModal profile={profile} onClose={() => setShowProfile(false)} />}
        {showWisdomTree && <WisdomTreeModal profile={profile} onClose={() => setShowWisdomTree(false)} />}
        
        <div className="absolute top-6 right-6 z-30 flex gap-3">
             <button onClick={() => setShowWisdomTree(true)} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all" title="Wisdom Tree">
               <TreeDeciduous size={20}/>
             </button>
             <button onClick={() => setShowProfile(true)} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all" title="Pilgrim Profile">
               <User size={20}/>
             </button>
             <button onClick={() => setShowLeaderboard(true)} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all" title="Hall of Faith">
               <Trophy size={20}/>
             </button>
             <button onClick={() => setShowRules(true)} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all" title="Rules">
               <Info size={20}/>
             </button>
             <button onClick={toggleSound} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all">
               {soundEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
             </button>
        </div>

        <div className="z-10 flex flex-col items-center max-w-md w-full text-center space-y-12 animate-fade-in mt-8">
          <div className="relative group cursor-pointer" onClick={() => audio.playSuccess()}>
               <div className="absolute inset-0 bg-gold-500 blur-[80px] opacity-20 animate-pulse-slow"></div>
               <Logo size="lg" className="animate-float relative z-10" />
          </div>

          <div className="space-y-4">
            <div className="relative">
                <h1 className="text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-600 animate-gradient-text drop-shadow-[0_0_35px_rgba(255,215,0,0.6)] tracking-tighter relative z-10">Anointed</h1>
                <h1 className="text-6xl md:text-8xl font-serif font-black text-gold-500/20 absolute top-1 left-1 blur-sm tracking-tighter -z-10">Anointed</h1>
            </div>
            <div className="flex items-center justify-center gap-4">
               <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60"></div>
               <p className="text-gold-100 font-serif tracking-[0.5em] text-sm uppercase drop-shadow-md">Bible Riddles</p>
               <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60"></div>
            </div>
             {/* Rank Display */}
             <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-gold-400/80">
                 Rank: {profile.rank}
             </div>
          </div>

          <div className="w-full glass-panel p-8 rounded-2xl flex flex-col items-center gap-6 animate-slide-up hover:border-gold-500/30 transition-colors duration-500" style={{ animationDelay: '0.2s' }}>
             <Button onClick={handleStartSetup} fullWidth className="text-xl py-6 shadow-[0_0_30px_-5px_rgba(255,215,0,0.3)] hover:scale-105">Enter the Throne Room</Button>
             <p className="text-xs text-gray-400 mt-2 font-serif italic tracking-wide opacity-70">"It is the glory of God to conceal a matter..."</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. SETUP MODE
  if (gameState === GameState.SETUP_MODE) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-28 md:p-6 relative overflow-hidden">
        <ParticleBackground mode="normal" />
        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
        <div className="absolute top-6 left-6 z-30 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleHome} title="Return Home"><Logo size="sm" /></div>
        <button onClick={() => setShowRules(true)} className="absolute top-6 right-6 z-30 p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20 transition-all" title="Rules"><Info size={20}/></button>

        <div className="z-10 w-full max-w-4xl space-y-6 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-serif font-bold text-gold-300 mb-2 text-glow">Choose Your Path</h2>
            <p className="text-gold-100/50 text-sm tracking-[0.2em] uppercase">How shall you journey?</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl mb-6 max-w-xl mx-auto">
             <div className="text-center mb-4 text-gold-400 font-bold uppercase tracking-widest text-xs">Select Your Spiritual Avatar</div>
             <AvatarSelector selected={session.avatar} onSelect={(id) => setSession({...session, avatar: id})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={() => handleSelectMode(GameMode.SINGLE)} className="glass-panel group p-6 rounded-2xl hover:bg-gold-500/5 transition-all duration-300 text-left hover:-translate-y-2 hover:border-gold-500/40 relative overflow-hidden">
              <div className="bg-gradient-to-br from-gold-500 to-gold-700 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-gold-500/30">
                <User className="w-5 h-5 text-royal-950" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-100 group-hover:text-gold-300 mb-1">Solo Pilgrim</h3>
              <p className="text-xs text-gray-400 leading-relaxed">60s Arcade Mode. Beat your high score.</p>
            </button>

            <button onClick={() => handleSelectMode(GameMode.DAILY)} className="glass-panel group p-6 rounded-2xl hover:bg-gold-500/5 transition-all duration-300 text-left hover:-translate-y-2 hover:border-gold-500/40 relative overflow-hidden">
              <div className="bg-gradient-to-br from-yellow-300 to-orange-400 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-yellow-500/30">
                <Sun className="w-5 h-5 text-royal-950" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-100 group-hover:text-gold-300 mb-1">Daily Manna</h3>
              <p className="text-xs text-gray-400 leading-relaxed">3 Riddles per day. Build your streak.</p>
            </button>

             <button onClick={() => handleSelectMode(GameMode.SUDDEN_DEATH)} className="glass-panel group p-6 rounded-2xl hover:bg-red-500/5 transition-all duration-300 text-left hover:-translate-y-2 hover:border-red-500/40 relative overflow-hidden border-red-900/30">
              <div className="bg-gradient-to-br from-red-500 to-red-800 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-red-500/30">
                <Swords className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-100 group-hover:text-red-300 mb-1">Sword Drill</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Sudden Death. One strike and you're out.</p>
            </button>

            <button onClick={() => handleSelectMode(GameMode.PARTY)} className="glass-panel group p-6 rounded-2xl hover:bg-purple-500/5 transition-all duration-300 text-left hover:-translate-y-2 hover:border-purple-500/40 relative overflow-hidden">
               <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-purple-500/30">
                 <Users className="w-5 h-5 text-white" />
               </div>
               <h3 className="text-lg font-serif font-bold text-gray-100 group-hover:text-gold-300 mb-1">Congregation</h3>
               <p className="text-xs text-gray-400 leading-relaxed">Compete in teams with friends.</p>
            </button>
          </div>
          
          <div className="flex justify-center mt-6">
            <button onClick={handleHome} className="flex items-center gap-2 text-gold-500/50 hover:text-gold-400 transition-colors uppercase text-xs tracking-widest font-bold">
               <ArrowLeft className="w-4 h-4" /> Return to Entrance
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- PARTY SETUP ---
  if (gameState === GameState.SETUP_PARTY) {
    const addTeam = () => {
      if (partyConfig.teams.length >= 4) return;
      const id = Date.now().toString();
      const colors = ['text-blue-400', 'text-red-400', 'text-green-400', 'text-purple-400'];
      const color = colors[partyConfig.teams.length % colors.length];
      const newTeam: Team = { id, name: `Team ${partyConfig.teams.length + 1}`, players: [{id: `${id}-p1`, name: 'Player 1'}], score: 0, color, avatar: 'crown' };
      setPartyConfig(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
    };

    return (
      <div className="min-h-screen flex flex-col p-6 relative overflow-hidden bg-royal-950">
        <ParticleBackground mode="normal" />
        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
        <div className="absolute top-6 right-6 z-30"><button onClick={() => setShowRules(true)} className="p-3 rounded-full bg-royal-800/50 hover:bg-gold-500/20 text-gold-400 border border-gold-500/20"><Info size={20}/></button></div>
        <div className="z-10 w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
          <header className="text-center mb-8">
             <h2 className="text-3xl font-serif text-gold-300">Congregation Assembly</h2>
             <p className="text-gray-400 text-sm">Gather your tribes</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl space-y-6">
               <h3 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-4 border-b border-white/10 pb-2">Game Settings</h3>
               <div>
                 <label className="block text-gray-400 text-sm mb-2">Flow Style</label>
                 <div className="flex gap-2">
                    <button onClick={() => setPartyConfig({...partyConfig, flow: 'TURN_BASED'})} className={`flex-1 py-3 px-4 rounded-lg border text-sm font-bold transition-all ${partyConfig.flow === 'TURN_BASED' ? 'bg-gold-500/20 border-gold-500 text-gold-300' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>Turn-Based</button>
                    <button onClick={() => setPartyConfig({...partyConfig, flow: 'TEAM_BASED'})} className={`flex-1 py-3 px-4 rounded-lg border text-sm font-bold transition-all ${partyConfig.flow === 'TEAM_BASED' ? 'bg-gold-500/20 border-gold-500 text-gold-300' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>Team-Based</button>
                 </div>
               </div>
               <div>
                 <label className="block text-gray-400 text-sm mb-2">Series Length</label>
                 <div className="flex gap-2">
                    {[1, 3, 5, 7, 10].map(num => (
                      <button key={num} onClick={() => setPartyConfig({...partyConfig, seriesLength: num as SeriesLength})} className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${partyConfig.seriesLength === num ? 'bg-gold-500/20 border-gold-500 text-gold-300' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>{num}</button>
                    ))}
                 </div>
               </div>
            </div>
            <div className="space-y-4">
               {partyConfig.teams.map((team, tIdx) => (
                 <div key={team.id} className="glass-panel p-4 rounded-xl border-l-4 relative" style={{ borderLeftColor: team.color.replace('text-', 'bg-') }}>
                    <div className="flex items-center justify-between mb-3">
                       <input value={team.name} onChange={(e) => setPartyConfig(p => ({...p, teams: p.teams.map((t, i) => i === tIdx ? { ...t, name: e.target.value } : t)}))} className="bg-transparent border-b border-white/20 text-gold-200 font-serif font-bold focus:outline-none w-1/2" placeholder="Team Name"/>
                       <div className="flex items-center gap-2">
                          <button onClick={() => {
                             const ids = Object.keys(AVATARS) as AvatarId[];
                             const nextId = ids[(ids.indexOf(team.avatar) + 1) % ids.length];
                             setPartyConfig(p => ({...p, teams: p.teams.map((t, i) => i === tIdx ? { ...t, avatar: nextId } : t)}));
                          }} className="p-1 bg-white/10 rounded-lg hover:bg-white/20" title="Switch Avatar">
                             {React.createElement(AVATARS[team.avatar].icon, { size: 16, className: AVATARS[team.avatar].color })}
                          </button>
                          {partyConfig.teams.length > 2 && (<button onClick={() => setPartyConfig(p => ({...p, teams: p.teams.filter((_, i) => i !== tIdx)}))} className="text-red-500/50 hover:text-red-400"><Trash2 size={16} /></button>)}
                       </div>
                    </div>
                    <div className="text-xs text-gray-400">{team.players.length} Players (Default)</div>
                 </div>
               ))}
               {partyConfig.teams.length < 4 && (<button onClick={addTeam} className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:border-gold-500/30 hover:text-gold-400 transition-all flex items-center justify-center gap-2"><Plus size={16} /> Add Team</button>)}
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-full p-4 bg-royal-950/90 backdrop-blur border-t border-white/10 flex justify-between items-center z-40">
             <button onClick={() => setGameState(GameState.SETUP_MODE)} className="text-sm text-gray-500 hover:text-white uppercase tracking-widest font-bold">Back</button>
             <Button onClick={handlePartyStart} className="px-12">Proceed <ChevronRight className="ml-2 inline" size={16} /></Button>
          </div>
        </div>
      </div>
    );
  }

  // --- TURN TRANSITION ---
  if (gameState === GameState.TURN_TRANSITION && isPartyMode) {
    const turn = turnQueue[currentTurnIndex];
    const AvatarIcon = AVATARS[turn.teamAvatar].icon;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-royal-950 text-center">
         <ParticleBackground mode="normal" />
         <div className="z-10 max-w-lg w-full animate-scale-in">
            <h2 className="text-gold-500 uppercase tracking-[0.3em] text-sm font-bold mb-6">Next Pilgrim</h2>
            <div className={`glass-panel p-10 rounded-3xl border-2 ${turn.teamColor.replace('text-', 'border-')}`}>
               <div className="mb-4 flex justify-center"><div className={`p-4 rounded-full bg-white/10 ${turn.teamColor}`}><AvatarIcon size={48} /></div></div>
               <h3 className={`text-3xl font-serif font-black mb-2 ${turn.teamColor}`}>{turn.teamName}</h3>
               <h1 className="text-5xl font-serif font-bold text-white mb-8">{turn.playerName}</h1>
               <p className="text-gold-500/50 text-xs">Round {turn.round} of {partyConfig.seriesLength}</p>
            </div>
            <Button onClick={startPartyTurn} fullWidth className="mt-10 text-xl"><Play className="mr-2" size={20} fill="currentColor" /> Ready!</Button>
         </div>
      </div>
    );
  }

  // --- GAME SUMMARY ---
  if (gameState === GameState.GAME_SUMMARY) {
     const isKids = session.difficulty === GameDifficulty.KIDS;
     let winner: Team | null = null;
     if (isPartyMode) winner = [...partyConfig.teams].sort((a, b) => b.score - a.score)[0];
     const shouldCelebrate = session.score > 0 || (isPartyMode && winner);
     const AvatarIcon = AVATARS[session.avatar].icon;

     return (
       <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-28 md:p-6 relative overflow-hidden">
         <ParticleBackground mode={isKids ? 'kids' : 'normal'} />
         {shouldCelebrate && <Confetti />}
         {showLeaderboard && <HallOfFaith entries={leaderboard} onClose={() => setShowLeaderboard(false)} />}
         
         <div className="absolute top-6 left-6 z-30 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleHome}><Logo size="sm" className={isKids ? 'grayscale brightness-150 sepia-0 hue-rotate-180' : ''} /></div>

         <div className={`z-10 text-center max-w-md w-full p-8 rounded-3xl backdrop-blur-xl border shadow-2xl animate-scale-in ${isKids ? 'bg-cyan-950/60 border-cyan-500/30' : 'bg-royal-900/80 border-gold-500/30'}`}>
            <div className="flex justify-center -mt-16 mb-6">
                 <div className={`relative p-6 rounded-full border-4 shadow-2xl bg-royal-900 border-gold-500`}>
                    {isPartyMode ? <Trophy className="w-16 h-16 text-gold-400" /> : <AvatarIcon className={`w-16 h-16 ${AVATARS[session.avatar].color}`} />}
                 </div>
            </div>

            <div className="space-y-3 mb-8">
               <h2 className={`text-4xl font-serif font-black ${isKids ? 'text-cyan-100 text-glow-cyan' : 'text-gold-300 text-glow'}`}>
                  {isPartyMode ? (winner ? winner.name + " Wins!" : "It's a Tie!") : (isKids ? "Great Job!" : (isDaily ? "Manna Gathered" : "Time's Up"))}
               </h2>
               <p className={`text-sm ${isKids ? 'text-cyan-200/70' : 'text-gold-100/50'}`}>
                  {isPartyMode ? "Glory to the victors." : `You scored ${session.score} points.`}
               </p>
            </div>

            {/* Wisdom Tree Growth Summary */}
            {growthUpdates.length > 0 && !isPartyMode && (
                <div className="mb-6 space-y-2 text-left">
                    <h3 className="text-center text-gold-400 font-bold uppercase tracking-widest text-xs mb-2">Harvest Summary</h3>
                    {growthUpdates.map((update, idx) => {
                        const isLevelUp = update.newLevel > update.oldLevel;
                        const Icon = CATEGORY_ICONS[update.category] || Star;
                        return (
                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isLevelUp ? 'bg-gold-500/20 border-gold-400 shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'bg-black/20 border-white/5'}`}>
                                <div className={`p-2 rounded-full ${isLevelUp ? 'bg-gold-500 text-royal-950 animate-bounce' : 'bg-white/10 text-gray-400'}`}>
                                    {isLevelUp ? <Sprout size={16} /> : <Icon size={16} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className={`font-bold text-sm ${isLevelUp ? 'text-gold-200' : 'text-gray-300'}`}>{update.category}</span>
                                        <span className="text-xs font-mono text-gold-500">+{update.xpGained} XP</span>
                                    </div>
                                    {isLevelUp && (
                                        <div className="text-[10px] text-gold-300 uppercase tracking-wider flex items-center gap-1 mt-1">
                                            <Leaf size={10} /> Grew to {getWisdomLevelName(update.newLevel)}!
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* High Score Entry Form */}
            {!isPartyMode && !isKidsMode && !isDaily && isHighScore && !hasSubmittedScore && (
               <div className="mb-8 p-4 bg-gold-500/10 rounded-xl border border-gold-500/30 animate-pulse">
                  <p className="text-gold-300 font-bold mb-2 uppercase text-xs tracking-widest">New High Score!</p>
                  <div className="flex gap-2">
                     <input 
                       maxLength={3} 
                       className="bg-black/40 border border-gold-500/30 rounded text-center text-white font-mono uppercase w-full p-2 tracking-widest focus:border-gold-500 outline-none" 
                       placeholder="AAA" 
                       value={initials}
                       onChange={(e) => setInitials(e.target.value.toUpperCase())}
                     />
                     <Button onClick={saveToLeaderboard} disabled={!initials} className="!py-2">Sign</Button>
                  </div>
               </div>
            )}

            {!isPartyMode && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="p-4 rounded-2xl border bg-black/20 border-gold-500/10">
                    <span className="text-[10px] uppercase tracking-widest block mb-1 text-gold-500/50">Score</span>
                    <p className="text-4xl font-serif font-bold text-gold-100">{session.score}</p>
                 </div>
                 <div className="p-4 rounded-2xl border bg-black/20 border-gold-500/10">
                    <span className="text-[10px] uppercase tracking-widest block mb-1 text-gold-500/50">Streak</span>
                    <p className="text-4xl font-serif font-bold text-gold-100">{session.streak}</p>
                 </div>
              </div>
            )}
            
            <div className="space-y-3">
               <Button variant="secondary" onClick={handleShare} fullWidth>{copyFeedback ? "Copied!" : <><Share2 className="mr-2" size={18} /> Share Scroll</>}</Button>
               <Button onClick={() => setGameState(GameState.SETUP_MODE)} fullWidth><Gamepad2 className="mr-2" size={20} /> Play Again</Button>
            </div>
            <button onClick={handleHome} className="block w-full text-center mt-6 text-xs font-bold uppercase tracking-widest text-gold-500/50 hover:text-gold-400">Return Home</button>
         </div>
       </div>
     );
  }

  // Fallback for Difficulty, Category, Loading, Error screens (simplifying for XML length but keeping functionality)
  if (gameState === GameState.SETUP_DIFFICULTY || gameState === GameState.SETUP_CATEGORY || gameState === GameState.LOADING || gameState === GameState.ERROR) {
      if (gameState === GameState.LOADING) return <div className="min-h-screen flex items-center justify-center bg-royal-950 text-gold-400"><Crown className="w-20 h-20 animate-bounce text-gold-500" /></div>;
      if (gameState === GameState.ERROR) return (
         <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-royal-950">
            <div className="glass-panel p-8 rounded-2xl max-w-sm"><AlertCircle className="w-16 h-16 text-red-500 mb-4 mx-auto" /><h2 className="text-2xl font-serif text-gold-400 mb-2">Error</h2><p className="text-gray-400 mb-8">{errorMsg}</p><Button onClick={() => startNewGame(session.difficulty || GameDifficulty.EASY)}>Try Again</Button><button onClick={handleHome} className="mt-4 text-xs text-gray-500 hover:text-gold-400 uppercase tracking-widest">Back</button></div>
         </div>
      );
      
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-28 md:p-6 relative overflow-hidden bg-royal-950">
           <ParticleBackground mode="normal" />
           <div className="absolute top-6 left-6 z-30 cursor-pointer" onClick={handleHome}><Logo size="sm" /></div>
           
           <div className="z-10 w-full max-w-lg space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                 <h2 className="text-4xl font-serif font-bold text-gold-300 mb-2">{gameState === GameState.SETUP_CATEGORY ? 'Choose Subject' : 'Prepare Your Mind'}</h2>
                 <p className="text-gold-100/50 text-sm tracking-widest uppercase">Select {gameState === GameState.SETUP_CATEGORY ? 'Category' : 'Difficulty'}</p>
              </div>

              {gameState === GameState.SETUP_CATEGORY ? (
                 <div className="grid grid-cols-2 gap-3 pb-20">
                    {getUniqueCategories().map(cat => (
                       <button key={cat} onClick={() => handleSelectCategory(cat)} className="glass-panel p-4 rounded-xl text-left hover:bg-gold-500/10 transition-all">
                          <span className="font-serif font-bold text-gray-200 text-sm">{cat}</span>
                       </button>
                    ))}
                    <button onClick={() => setGameState(GameState.SETUP_DIFFICULTY)} className="col-span-2 mt-4 text-xs text-center text-gray-500 hover:text-white uppercase font-bold">Back</button>
                 </div>
              ) : (
                 <div className="space-y-4">
                    <button onClick={() => handleSelectDifficulty(GameDifficulty.KIDS)} className="w-full glass-panel-kids p-4 rounded-xl flex items-center gap-4 hover:scale-[1.02] transition-all">
                        <Smile className="text-cyan-400"/>
                        <div className="text-left">
                            <h3 className="font-bold text-cyan-100">Kids Mode</h3>
                            <p className="text-xs text-cyan-200/70">Infinite time. Friendly riddles. Fun for all!</p>
                        </div>
                    </button>
                    <button onClick={() => handleSelectDifficulty(GameDifficulty.EASY)} className="w-full glass-panel p-4 rounded-xl flex items-center gap-4 hover:translate-x-1 transition-all hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <Star className="text-green-400"/>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-200">Disciple</h3>
                            <p className="text-xs text-gray-400">Standard timer. Classic riddles. Beginner.</p>
                        </div>
                    </button>
                    <button onClick={() => handleSelectDifficulty(GameDifficulty.MEDIUM)} className="w-full glass-panel p-4 rounded-xl flex items-center gap-4 hover:translate-x-1 transition-all hover:border-gold-500/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                        <Shield className="text-gold-400"/>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-200">Teacher</h3>
                            <p className="text-xs text-gray-400">Faster timer. Deeper questions. Intermediate.</p>
                        </div>
                    </button>
                    <button onClick={() => handleSelectDifficulty(GameDifficulty.HARD)} className="w-full glass-panel p-4 rounded-xl flex items-center gap-4 hover:translate-x-1 transition-all hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]">
                        <Flame className="text-red-400"/>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-200">Prophet</h3>
                            <p className="text-xs text-gray-400">Strict timer. Obscure figures. Advanced.</p>
                        </div>
                    </button>
                    <button onClick={() => setGameState(GameState.SETUP_CATEGORY)} className="w-full glass-panel p-4 rounded-xl flex items-center gap-4 hover:translate-x-1 transition-all hover:border-purple-500/50">
                        <BookOpen className="text-purple-400"/>
                        <div className="text-left">
                           <h3 className="font-bold text-gray-200">Select Category</h3>
                           <p className="text-xs text-gray-400">Focus on Prophets, Kings, Parables, etc.</p>
                        </div>
                        <ChevronRight className="ml-auto text-gray-500"/>
                    </button>
                    <button onClick={() => setGameState(GameState.SETUP_MODE)} className="w-full text-center text-xs uppercase font-bold tracking-widest text-gold-500/40 hover:text-gold-400 mt-6">Go Back</button>
                 </div>
              )}
           </div>
        </div>
      );
  }

  // 6. PLAYING
  const PlayerAvatar = AVATARS[session.avatar].icon;
  const PartyAvatar = isPartyMode ? AVATARS[turnQueue[currentTurnIndex]?.teamAvatar].icon : null;
  const CurrentIcon = isPartyMode ? PartyAvatar : PlayerAvatar;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:max-w-4xl mx-auto relative overflow-hidden">
       <ParticleBackground mode={isKidsMode ? 'kids' : 'normal'} />

        {/* Ascension Prompt */}
        {ascensionOffer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-royal-900 border border-gold-500 rounded-2xl p-8 max-w-sm text-center shadow-[0_0_50px_rgba(255,215,0,0.2)]">
                    <Flame className="w-16 h-16 text-gold-500 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-2xl font-serif text-gold-300 mb-2">Ascend Higher?</h2>
                    <p className="text-gray-300 mb-6 text-sm">Your faith is strong. Step up to <span className="text-gold-400 font-bold">Teacher</span> difficulty for the rest of this run to earn <span className="text-gold-400 font-bold">2x Points</span>.</p>
                    <div className="space-y-3">
                        <Button fullWidth onClick={() => handleAscend(true)}>Ascend (+Bonus)</Button>
                        <button onClick={() => handleAscend(false)} className="text-gray-500 hover:text-white text-sm uppercase tracking-widest font-bold">Stay Disciple</button>
                    </div>
                </div>
            </div>
        )}

       <header className={`relative z-20 mb-4 rounded-2xl p-4 border backdrop-blur-md shadow-xl transition-all ${isKidsMode ? 'bg-cyan-950/60 border-cyan-500/20' : 'bg-royal-900/60 border-gold-500/10'}`}>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                 <div onClick={handleHome} className="cursor-pointer hover:scale-105 transition-transform"><Logo size="sm" className={isKidsMode ? 'grayscale brightness-150 sepia-0 hue-rotate-180' : ''} /></div>
                 <button onClick={toggleSound} className={`p-2 rounded-full border transition-all ${isKidsMode ? 'bg-cyan-900/50 border-cyan-500/30 text-cyan-400' : 'bg-royal-800/50 border-gold-500/20 text-gold-400'}`}>
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                 </button>
             </div>

             <div className="flex gap-3 sm:gap-6 items-center">
                 <div className="flex flex-col items-end">
                    <span className={`text-[9px] uppercase tracking-widest font-bold ${isKidsMode ? 'text-cyan-500' : 'text-gold-600'}`}>Score</span>
                    <div className="flex items-center gap-2">
                       <span className={`font-serif font-black text-2xl ${isKidsMode ? 'text-cyan-100 text-glow-cyan' : 'text-gold-100 text-glow'}`}>
                         {isPartyMode ? partyConfig.teams.find(t => t.id === turnQueue[currentTurnIndex]?.teamId)?.score || 0 : session.score}
                       </span>
                    </div>
                 </div>

                 {!isKidsMode && CurrentIcon && (
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10">
                        {/* @ts-ignore */}
                        <CurrentIcon className={`w-5 h-5 ${isPartyMode ? 'text-white' : AVATARS[session.avatar].color}`} />
                    </div>
                 )}

                 {isKidsMode || isSuddenDeath ? (
                     <div className={`w-12 h-12 flex items-center justify-center rounded-full border ${isSuddenDeath ? 'bg-red-900/50 border-red-500/30' : 'bg-cyan-500/20 border-cyan-500/40'}`}>
                         {isSuddenDeath ? <Swords size={20} className="text-red-400"/> : <span className="text-2xl text-cyan-300 mb-1">∞</span>}
                     </div>
                 ) : (
                     <div className="relative w-12 h-12 flex items-center justify-center bg-royal-950/50 rounded-full border border-gold-500/20 shadow-inner">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 48 48">
                           <circle cx="24" cy="24" r="20" stroke="rgba(255,215,0,0.1)" strokeWidth="3" fill="transparent" />
                           <circle cx="24" cy="24" r="20" stroke={globalTimer < 10 ? '#ef4444' : '#eab308'} strokeWidth="3" fill="transparent" strokeDasharray="125.66" strokeDashoffset={125.66 * (1 - (isPartyMode ? 1 : globalTimer / 60))} strokeLinecap="round" className={`transition-[stroke-dashoffset] duration-1000 ease-linear ${isPartyMode ? 'opacity-0' : ''}`} />
                        </svg>
                        <span className={`text-sm font-bold font-mono ${globalTimer < 10 && !isPartyMode ? 'text-red-400 animate-pulse' : 'text-gold-100'}`}>{isPartyMode ? (turnQueue.length - currentTurnIndex) : (isDaily ? (session.dailyIndex! + 1) + "/3" : globalTimer)}</span>
                     </div>
                 )}
                 {isKidsMode && <button onClick={() => setGameState(GameState.GAME_SUMMARY)} className="text-xs font-bold text-red-400 hover:text-red-300 uppercase">Exit</button>}
             </div>
          </div>
          {(!isKidsMode && !isSuddenDeath) && <div className="absolute bottom-0 left-0 w-full h-1 bg-black/50 overflow-hidden rounded-b-2xl"><div className="h-full bg-gradient-to-r from-gold-700 via-gold-500 to-white shadow-[0_0_10px_#FFD700] transition-all duration-1000 ease-linear" style={{ width: `${(questionTimer / (currentRiddle ? getTimerDuration(currentRiddle.difficultyLevel, session.streak) : 15)) * 100}%` }}></div></div>}
       </header>

       <main className="flex-1 flex flex-col justify-center w-full z-10 relative">
          <div className={`relative backdrop-blur-xl rounded-3xl p-5 md:p-8 shadow-2xl overflow-hidden transition-all duration-500 animate-slide-up hover:shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] ${isKidsMode ? 'bg-cyan-950/40 border border-cyan-400/30' : 'bg-royal-900/60 border border-gold-500/30'}`}>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${isKidsMode ? 'bg-cyan-400' : 'bg-gold-500'}`}></div>
            <div className="mb-4 relative z-10">
               <div className="flex justify-between items-start mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-widest bg-white/5 border-white/10 ${isKidsMode ? 'text-cyan-300' : 'text-gold-300'}`}><Sparkles className="w-3 h-3" />{currentRiddle?.difficulty}</div>
                  <div className={`text-[10px] uppercase tracking-widest font-bold opacity-60 ${isKidsMode ? 'text-cyan-200' : 'text-gold-200'}`}>{currentRiddle?.category}</div>
               </div>
               <div className="relative mt-2">
                 <div className={`font-riddle text-2xl md:text-3xl leading-relaxed text-center italic ${isKidsMode ? 'text-cyan-100 drop-shadow-[0_2px_4px_rgba(8,145,178,0.5)]' : 'text-transparent bg-clip-text bg-gradient-to-br from-gold-100 via-gold-300 to-gold-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'}`}>{currentRiddle?.question.split('\n').map((line, i) => (<p key={i} className={`pb-3 ${line.trim() === '' ? 'h-4' : ''}`}>{line}</p>))}</div>
               </div>
               <div className="min-h-[20px] mt-6 space-y-2">
                  {hintLevel > 0 && (<div className="flex items-center justify-center gap-3 animate-scale-in"><div className="p-2 bg-gold-500/20 rounded-lg"><Lightbulb size={14} className="text-gold-400"/></div><span className="text-sm text-gold-200 font-serif"><span className="text-gold-500 font-bold uppercase text-xs mr-2">Category:</span> {currentRiddle?.category}</span></div>)}
                  {hintLevel > 1 && (<div className="flex items-center justify-center gap-3 animate-scale-in" style={{animationDelay: '0.1s'}}><div className="p-2 bg-blue-500/20 rounded-lg"><Book size={14} className="text-blue-400"/></div><span className="text-sm text-blue-200 font-serif"><span className="text-blue-400 font-bold uppercase text-xs mr-2">Book:</span> {currentRiddle?.reference}</span></div>)}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
               {currentRiddle?.options.map((option, idx) => {
                 const isDisabled = disabledOptions.includes(option);
                 let stateStyles = isKidsMode ? "bg-cyan-900/40 border-cyan-500/20 text-cyan-100 hover:bg-cyan-500/20 hover:border-cyan-400/50" : "bg-royal-800/40 border-gold-500/20 text-gray-200 hover:bg-gold-500/10 hover:border-gold-500/50";
                 let icon = null;
                 if (isDisabled) stateStyles = "bg-black/20 border-transparent text-gray-700 opacity-20 cursor-not-allowed grayscale";
                 else if (selectedOption) {
                    if (option === currentRiddle.correctAnswer) { stateStyles = "bg-green-500/20 border-green-400 text-green-100 shadow-[0_0_20px_rgba(34,197,94,0.2)] scale-[1.02]"; icon = <Crown className="w-5 h-5 text-green-400 animate-bounce" />; }
                    else if (option === selectedOption) { stateStyles = "bg-red-500/20 border-red-400 text-red-100 opacity-80"; icon = <AlertCircle className="w-5 h-5 text-red-400" />; }
                    else stateStyles = "opacity-30 grayscale";
                 }
                 return <button key={idx} disabled={selectedOption !== null || isDisabled} onClick={() => handleOptionSelect(option)} className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group backdrop-blur-sm ${stateStyles}`}><span className="font-sans font-medium text-lg">{option}</span>{icon}</button>;
               })}
            </div>

            {selectedOption && (
                <div className={`mt-4 p-4 border rounded-xl text-center animate-fade-in ${isCorrect ? (isKidsMode ? 'bg-green-500/20 border-green-400/30' : 'bg-green-900/40 border-green-500/30') : (isKidsMode ? 'bg-cyan-800/50 border-cyan-400/30' : 'bg-red-900/40 border-red-500/30')}`}>
                    <p className={`font-serif text-lg font-bold flex items-center justify-center gap-2 mb-2 ${isKidsMode ? 'text-cyan-100' : 'text-gold-200'}`}>{isCorrect ? (isKidsMode ? "Splendid!" : "Wisdom is yours.") : (isKidsMode ? "Nice try! Keep going!" : "Not quite, pilgrim.")}</p>
                    <div className={`text-sm opacity-80 ${isKidsMode ? 'text-cyan-200' : 'text-gray-300'}`}><p className="font-bold uppercase text-xs tracking-widest mb-1 opacity-50">Reference</p><p className="font-serif italic">{currentRiddle?.reference}</p></div>
                </div>
            )}

            <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-6">
               <div className="flex gap-2">
                 <button onClick={handleHint} disabled={selectedOption !== null || hintLevel >= 2 || (!isPartyMode && session.score < 5)} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest border border-transparent ${isKidsMode ? 'text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-30' : 'text-gold-400 hover:text-gold-200 hover:bg-gold-500/10 disabled:opacity-30'}`}><Lightbulb size={14} /> {hintLevel >= 2 ? 'Max' : 'Hint (-5)'}</button>
                 <button onClick={handleFiftyFifty} disabled={selectedOption !== null || disabledOptions.length > 0 || (!isPartyMode && session.score < 40)} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest border border-transparent ${isKidsMode ? 'text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-30' : 'text-purple-400 hover:text-purple-200 hover:bg-purple-500/10 disabled:opacity-30'}`} title="Remove 2 wrong answers (Cost: 40 pts)"><Percent size={14} /> 50/50 (-40)</button>
               </div>
               <button onClick={handleSkip} disabled={selectedOption !== null} className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-30">Skip <SkipForward size={14} /></button>
            </div>
          </div>
       </main>
    </div>
  );
}