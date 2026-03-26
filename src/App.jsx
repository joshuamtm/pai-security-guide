import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Search, CalendarSync, UserRoundSearch, BotOff, Key, Eye, ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Info, ExternalLink, Lock, Unlock, ShieldAlert, ShieldCheck, ShieldOff, Radio } from 'lucide-react'
import './index.css'

// ─── Animated Section Wrapper ────────────────────────────────
function Section({ children, className = '', delay = 0, id }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Persistent Checklist ────────────────────────────────────
function Checklist({ id, items }) {
  const storageKey = `checklist-${id}`
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {}
    } catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked))
  }, [checked, storageKey])

  return (
    <div className="space-y-3 mt-4">
      {items.map((item, i) => (
        <label key={i} className="checklist-item flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={!!checked[i]}
            onChange={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
          />
          <span className={`text-sm leading-relaxed transition-colors ${checked[i] ? 'text-clay-500 line-through' : 'text-clay-700 group-hover:text-teal-700'}`}>
            {item}
          </span>
        </label>
      ))}
      <div className="text-xs text-clay-400 mt-2 font-mono">
        {Object.values(checked).filter(Boolean).length}/{items.length} complete
      </div>
    </div>
  )
}

// ─── Expandable Card ─────────────────────────────────────────
function Expandable({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white shadow-clay border border-clay-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-clay-50 transition-colors"
      >
        {icon}
        <span className="text-sm font-semibold text-clay-800 flex-1">{title}</span>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={16} className="text-clay-500" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 border-t border-clay-200/60">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Risk Badge ──────────────────────────────────────────────
function RiskBadge({ level }) {
  const config = {
    low: { bg: 'bg-emerald-100', text: 'text-risk-low', border: 'border-emerald-300', label: 'LOW RISK' },
    moderate: { bg: 'bg-amber-100', text: 'text-risk-moderate', border: 'border-amber-300', label: 'MODERATE' },
    high: { bg: 'bg-orange-100', text: 'text-risk-high', border: 'border-orange-300', label: 'HIGH RISK' },
    critical: { bg: 'bg-rose-100', text: 'text-risk-critical', border: 'border-rose-300', label: 'CRITICAL' },
  }
  const c = config[level]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  )
}

// ─── Feature Row ─────────────────────────────────────────────
function FeatureRow({ feature, description, risk, detail }) {
  return (
    <div className="py-3 border-b border-clay-200/60 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-1">
        <span className="text-sm font-semibold text-clay-800">{feature}</span>
        <RiskBadge level={risk} />
      </div>
      <p className="text-xs text-clay-500 mb-1">{description}</p>
      <p className="text-xs text-clay-600 italic">{detail}</p>
    </div>
  )
}

// ─── Decision Card ───────────────────────────────────────────
function DecisionCard({ situation, recommendation, safe }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${safe ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
      {safe ? <CheckCircle2 size={16} className="text-risk-low mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="text-risk-critical mt-0.5 flex-shrink-0" />}
      <div>
        <p className="text-sm font-medium text-clay-800">{situation}</p>
        <p className="text-xs text-clay-600 mt-1">{recommendation}</p>
      </div>
    </div>
  )
}

// ─── Clay Character Illustrations ────────────────────────────
function TierIllustration({ tier, size = 140, hero = false }) {
  const s = hero ? 200 : size
  const id = hero ? `hero${tier}` : `card${tier}`
  const illustrations = {
    1: (
      <svg viewBox="0 0 160 160" width={s} height={s} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="75" fill="#f0fdf4" />
        <circle cx="80" cy="80" r="75" fill={`url(#clay1${id})`} opacity="0.3" />
        {/* Desk */}
        <rect x="20" y="100" width="120" height="10" rx="5" fill="#d4c4a8" />
        <rect x="20" y="100" width="120" height="5" rx="3" fill="#e8ddd0" />
        {/* Documents */}
        <rect x="30" y="92" width="18" height="14" rx="4" fill="#bbf7d0" stroke="#86efac" strokeWidth="1.2" />
        <line x1="34" y1="96" x2="44" y2="96" stroke="#4ade80" strokeWidth="1" opacity="0.5" />
        <line x1="34" y1="99" x2="42" y2="99" stroke="#4ade80" strokeWidth="1" opacity="0.3" />
        <rect x="52" y="94" width="18" height="12" rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="0.8" />
        <rect x="74" y="93" width="18" height="13" rx="4" fill="#d1fae5" stroke="#86efac" strokeWidth="0.8" />
        {/* Coffee mug */}
        <rect x="100" y="92" width="10" height="12" rx="3" fill="#fef3c7" stroke="#d4c4a8" strokeWidth="1" />
        <path d="M110 95 Q115 95 115 100 Q115 104 110 104" stroke="#d4c4a8" strokeWidth="1" fill="none" />
        {/* Steam */}
        <path d="M103 88 Q105 84 103 80" stroke="#d4c4a8" strokeWidth="0.8" opacity="0.4" fill="none" />
        <path d="M107 87 Q109 82 107 78" stroke="#d4c4a8" strokeWidth="0.8" opacity="0.3" fill="none" />
        {/* Character - cute researcher with glasses and messy hair */}
        <circle cx="72" cy="52" r="20" fill="#4ade80" />
        <circle cx="72" cy="52" r="18" fill="#22c55e" />
        {/* Messy hair tufts */}
        <ellipse cx="60" cy="38" rx="5" ry="4" fill="#16a34a" transform="rotate(-20 60 38)" />
        <ellipse cx="72" cy="34" rx="6" ry="5" fill="#16a34a" />
        <ellipse cx="84" cy="38" rx="5" ry="4" fill="#16a34a" transform="rotate(20 84 38)" />
        {/* Big cute eyes */}
        <circle cx="65" cy="50" r="5" fill="white" />
        <circle cx="79" cy="50" r="5" fill="white" />
        <circle cx="66" cy="50" r="2.5" fill="#15803d" />
        <circle cx="80" cy="50" r="2.5" fill="#15803d" />
        <circle cx="66.5" cy="49.5" r="1" fill="white" />
        <circle cx="80.5" cy="49.5" r="1" fill="white" />
        {/* Glasses */}
        <circle cx="65" cy="50" r="7" fill="none" stroke="#15803d" strokeWidth="1.5" />
        <circle cx="79" cy="50" r="7" fill="none" stroke="#15803d" strokeWidth="1.5" />
        <line x1="72" y1="50" x2="72" y2="50" stroke="#15803d" strokeWidth="1.5" />
        <path d="M72 49 L72 51" stroke="#15803d" strokeWidth="1.5" />
        {/* Nose */}
        <ellipse cx="72" cy="55" rx="2" ry="1.5" fill="#16a34a" opacity="0.4" />
        {/* Happy smile */}
        <path d="M66 59 Q72 65 78 59" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="59" cy="56" r="3" fill="#fb923c" opacity="0.15" />
        <circle cx="85" cy="56" r="3" fill="#fb923c" opacity="0.15" />
        {/* Body - sweater vest look */}
        <ellipse cx="72" cy="80" rx="18" ry="16" fill="#22c55e" />
        <ellipse cx="72" cy="80" rx="12" ry="12" fill="#16a34a" opacity="0.3" />
        {/* Arms on desk */}
        <ellipse cx="48" cy="92" rx="8" ry="5" fill="#4ade80" transform="rotate(-10 48 92)" />
        <ellipse cx="96" cy="92" rx="8" ry="5" fill="#4ade80" transform="rotate(10 96 92)" />
        {/* Little hands */}
        <circle cx="42" cy="92" r="4" fill="#4ade80" />
        <circle cx="102" cy="92" r="4" fill="#4ade80" />
        {/* Magnifying glass in hand */}
        <circle cx="40" cy="88" r="6" fill="none" stroke="#15803d" strokeWidth="1.5" />
        <line x1="44" y1="92" x2="48" y2="96" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
        {hero && <text x="80" y="132" textAnchor="middle" fill="#16a34a" fontSize="10" fontFamily="Nunito, sans-serif" fontWeight="700">READS ONLY</text>}
        {!hero && <text x="80" y="148" textAnchor="middle" fill="#16a34a" fontSize="10" fontFamily="Nunito, sans-serif" fontWeight="700">READS ONLY</text>}
        <defs><radialGradient id={`clay1${id}`}><stop offset="0%" stopColor="#22c55e" stopOpacity="0.1"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></radialGradient></defs>
      </svg>
    ),
    2: (
      <svg viewBox="0 0 160 160" width={s} height={s} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="75" fill="#fffbeb" />
        <circle cx="80" cy="80" r="75" fill={`url(#clay2${id})`} opacity="0.3" />
        {/* Filing cabinet */}
        <rect x="10" y="55" width="28" height="50" rx="6" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.2" />
        <rect x="13" y="60" width="22" height="10" rx="4" fill="#fef3c7" />
        <circle cx="24" cy="65" r="1.5" fill="#d97706" />
        <rect x="13" y="73" width="22" height="10" rx="4" fill="#fef3c7" />
        <circle cx="24" cy="78" r="1.5" fill="#d97706" />
        <rect x="13" y="86" width="22" height="10" rx="4" fill="#fef3c7" />
        <circle cx="24" cy="91" r="1.5" fill="#d97706" />
        {/* Screen with calendar */}
        <rect x="90" y="45" width="50" height="35" rx="6" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.2" />
        <rect x="94" y="49" width="42" height="24" rx="4" fill="#fffbeb" />
        <rect x="98" y="53" width="12" height="12" rx="3" fill="#fbbf24" opacity="0.35" />
        <line x1="100" y1="57" x2="108" y2="57" stroke="#92400e" strokeWidth="0.5" opacity="0.3" />
        <line x1="100" y1="60" x2="106" y2="60" stroke="#92400e" strokeWidth="0.5" opacity="0.3" />
        <rect x="114" y="53" width="18" height="5" rx="2" fill="#fbbf24" opacity="0.25" />
        <rect x="114" y="61" width="18" height="5" rx="2" fill="#fbbf24" opacity="0.2" />
        {/* Character - energetic coordinator with headset */}
        <circle cx="60" cy="42" r="20" fill="#fbbf24" />
        <circle cx="60" cy="42" r="18" fill="#f59e0b" />
        {/* Ponytail/bun hair */}
        <ellipse cx="60" cy="28" rx="10" ry="7" fill="#d97706" />
        <circle cx="75" cy="32" r="5" fill="#d97706" />
        {/* Cute eyes */}
        <circle cx="53" cy="40" r="5" fill="white" />
        <circle cx="67" cy="40" r="5" fill="white" />
        <circle cx="54" cy="40" r="2.5" fill="#92400e" />
        <circle cx="68" cy="40" r="2.5" fill="#92400e" />
        <circle cx="54.5" cy="39.5" r="1" fill="white" />
        <circle cx="68.5" cy="39.5" r="1" fill="white" />
        {/* Headset */}
        <path d="M44 36 Q44 26 60 26 Q76 26 76 36" stroke="#92400e" strokeWidth="2" fill="none" />
        <circle cx="44" cy="38" r="3" fill="#92400e" />
        {/* Nose */}
        <ellipse cx="60" cy="45" rx="2" ry="1.5" fill="#d97706" opacity="0.5" />
        {/* Confident smile */}
        <path d="M54 49 Q60 54 66 49" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="47" cy="46" r="3" fill="#fb923c" opacity="0.15" />
        <circle cx="73" cy="46" r="3" fill="#fb923c" opacity="0.15" />
        {/* Body */}
        <ellipse cx="60" cy="72" rx="18" ry="18" fill="#f59e0b" />
        {/* Clipboard/tablet in one hand */}
        <rect x="82" y="58" width="14" height="18" rx="3" fill="white" stroke="#d97706" strokeWidth="1" />
        <line x1="85" y1="63" x2="93" y2="63" stroke="#d97706" strokeWidth="0.8" opacity="0.4" />
        <line x1="85" y1="66" x2="91" y2="66" stroke="#d97706" strokeWidth="0.8" opacity="0.3" />
        <line x1="85" y1="69" x2="92" y2="69" stroke="#d97706" strokeWidth="0.8" opacity="0.3" />
        {/* Arms */}
        <ellipse cx="38" cy="68" rx="8" ry="5" fill="#fbbf24" transform="rotate(-25 38 68)" />
        <ellipse cx="82" cy="66" rx="8" ry="5" fill="#fbbf24" transform="rotate(15 82 66)" />
        {/* Hands */}
        <circle cx="32" cy="66" r="4" fill="#fbbf24" />
        <circle cx="88" cy="63" r="4" fill="#fbbf24" />
        {/* Envelope floating from hand */}
        <rect x="24" y="56" width="16" height="11" rx="3" fill="white" stroke="#f59e0b" strokeWidth="1" />
        <path d="M24 56 L32 63 L40 56" stroke="#f59e0b" strokeWidth="0.8" fill="none" />
        {/* Legs */}
        <ellipse cx="52" cy="92" rx="6" ry="9" fill="#f59e0b" />
        <ellipse cx="68" cy="92" rx="6" ry="9" fill="#f59e0b" />
        {/* Shoes */}
        <ellipse cx="50" cy="100" rx="7" ry="3" fill="#d97706" />
        <ellipse cx="70" cy="100" rx="7" ry="3" fill="#d97706" />
        {!hero && <text x="80" y="148" textAnchor="middle" fill="#d97706" fontSize="10" fontFamily="Nunito, sans-serif" fontWeight="700">READS + WRITES</text>}
        {hero && <text x="80" y="132" textAnchor="middle" fill="#d97706" fontSize="10" fontFamily="Nunito, sans-serif" fontWeight="700">READS + WRITES</text>}
        <defs><radialGradient id={`clay2${id}`}><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></radialGradient></defs>
      </svg>
    ),
    3: (
      <svg viewBox="0 0 160 160" width={s} height={s} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="75" fill="#fff7ed" />
        <circle cx="80" cy="80" r="75" fill={`url(#clay3${id})`} opacity="0.3" />
        {/* Person (smaller, tan) at desk */}
        <circle cx="95" cy="62" r="12" fill="#e8ddd0" />
        <circle cx="95" cy="62" r="10" fill="#d4c4a8" />
        <circle cx="92" cy="61" r="1.5" fill="#9a7d62" />
        <circle cx="98" cy="61" r="1.5" fill="#9a7d62" />
        <ellipse cx="95" cy="82" rx="11" ry="12" fill="#d4c4a8" />
        {/* Person's screen */}
        <rect x="62" y="52" width="48" height="30" rx="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
        <rect x="66" y="56" width="40" height="20" rx="4" fill="#fff7ed" />
        {/* Sensitive data */}
        <rect x="70" y="59" width="22" height="3" rx="1.5" fill="#ea580c" opacity="0.3" />
        <rect x="70" y="64" width="16" height="2.5" rx="1" fill="#ea580c" opacity="0.2" />
        <text x="70" y="73" fill="#ea580c" opacity="0.35" fontSize="6" fontFamily="Nunito">•••••••</text>
        {/* Shadow character - behind, BIG cute eyes peering */}
        <circle cx="48" cy="44" r="22" fill="#fb923c" />
        <circle cx="48" cy="44" r="20" fill="#ea580c" />
        {/* Spiky curious hair */}
        <ellipse cx="36" cy="28" rx="5" ry="6" fill="#c2410c" transform="rotate(-15 36 28)" />
        <ellipse cx="48" cy="24" rx="6" ry="7" fill="#c2410c" />
        <ellipse cx="60" cy="28" rx="5" ry="6" fill="#c2410c" transform="rotate(15 60 28)" />
        {/* Very big curious eyes looking sideways */}
        <circle cx="41" cy="42" r="6" fill="white" />
        <circle cx="55" cy="42" r="6" fill="white" />
        <circle cx="43" cy="42" r="3" fill="#9a3412" />
        <circle cx="57" cy="42" r="3" fill="#9a3412" />
        <circle cx="44" cy="41" r="1.2" fill="white" />
        <circle cx="58" cy="41" r="1.2" fill="white" />
        {/* Raised eyebrows - curious */}
        <path d="M35 35 Q41 32 47 35" stroke="#7c2d12" strokeWidth="1.2" fill="none" />
        <path d="M49 35 Q55 32 61 35" stroke="#7c2d12" strokeWidth="1.2" fill="none" />
        {/* Small 'o' mouth - surprised/curious */}
        <ellipse cx="48" cy="52" rx="3" ry="3.5" fill="#7c2d12" opacity="0.7" />
        <ellipse cx="48" cy="51.5" rx="2" ry="2.5" fill="#c2410c" opacity="0.5" />
        {/* Rosy cheeks */}
        <circle cx="33" cy="48" r="3" fill="#fbbf24" opacity="0.15" />
        <circle cx="63" cy="48" r="3" fill="#fbbf24" opacity="0.15" />
        {/* Body */}
        <ellipse cx="48" cy="72" rx="17" ry="16" fill="#ea580c" />
        {/* Tiptoeing pose - on toes */}
        <ellipse cx="40" cy="92" rx="5" ry="8" fill="#ea580c" />
        <ellipse cx="56" cy="92" rx="5" ry="8" fill="#ea580c" />
        <ellipse cx="38" cy="100" rx="6" ry="2.5" fill="#c2410c" />
        <ellipse cx="58" cy="100" rx="6" ry="2.5" fill="#c2410c" />
        {/* Arms behind back sneaky */}
        <ellipse cx="32" cy="74" rx="5" ry="7" fill="#fb923c" transform="rotate(10 32 74)" />
        <ellipse cx="64" cy="74" rx="5" ry="7" fill="#fb923c" transform="rotate(-10 64 74)" />
        {/* Dashed sight line */}
        <line x1="57" y1="42" x2="68" y2="59" stroke="#ea580c" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="4 3" />
        {!hero && <text x="80" y="148" textAnchor="middle" fill="#ea580c" fontSize="10" fontFamily="Nunito, sans-serif" fontWeight="700">SEES EVERYTHING</text>}
        {hero && <text x="80" y="132" textAnchor="middle" fill="#ea580c" fontSize="10" fontFamily="Nunito, sans-serif" fontWeight="700">SEES EVERYTHING</text>}
        <defs><radialGradient id={`clay3${id}`}><stop offset="0%" stopColor="#ea580c" stopOpacity="0.08"/><stop offset="100%" stopColor="#ea580c" stopOpacity="0"/></radialGradient></defs>
      </svg>
    ),
    4: (
      <svg viewBox="0 0 160 160" width={s} height={s} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="75" fill="#fef2f2" />
        <circle cx="80" cy="80" r="75" fill={`url(#clay4${id})`} opacity="0.4" />
        {/* Clock */}
        <circle cx="120" cy="22" r="12" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.2" />
        <line x1="120" y1="22" x2="120" y2="14" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="22" x2="126" y2="22" stroke="#dc2626" strokeWidth="1" strokeLinecap="round" />
        {/* Three screens */}
        <rect x="5" y="50" width="35" height="24" rx="6" fill="#fecaca" stroke="#dc2626" strokeWidth="1" />
        <rect x="9" y="54" width="27" height="14" rx="3" fill="#fef2f2" />
        <rect x="12" y="57" width="10" height="2" rx="1" fill="#dc2626" opacity="0.2" />
        <rect x="12" y="61" width="14" height="2" rx="1" fill="#dc2626" opacity="0.15" />
        <rect x="55" y="42" width="42" height="30" rx="6" fill="#fecaca" stroke="#dc2626" strokeWidth="1.2" />
        <rect x="59" y="46" width="34" height="20" rx="4" fill="#fef2f2" />
        <rect x="63" y="50" width="12" height="2" rx="1" fill="#dc2626" opacity="0.25" />
        <rect x="63" y="54" width="18" height="2" rx="1" fill="#dc2626" opacity="0.2" />
        <rect x="63" y="58" width="8" height="2" rx="1" fill="#dc2626" opacity="0.15" />
        <rect x="112" y="50" width="35" height="24" rx="6" fill="#fecaca" stroke="#dc2626" strokeWidth="1" />
        <rect x="116" y="54" width="27" height="14" rx="3" fill="#fef2f2" />
        {/* Connection lines */}
        <line x1="40" y1="62" x2="55" y2="57" stroke="#dc2626" strokeWidth="1.2" opacity="0.2" strokeDasharray="4 3" />
        <line x1="97" y1="57" x2="112" y2="62" stroke="#dc2626" strokeWidth="1.2" opacity="0.2" strokeDasharray="4 3" />
        {/* Character ALONE - cape/superhero delusion vibe */}
        <circle cx="76" cy="88" r="20" fill="#f87171" />
        <circle cx="76" cy="88" r="18" fill="#dc2626" />
        {/* Flat top hair */}
        <rect x="62" y="72" width="28" height="8" rx="4" fill="#991b1b" />
        {/* Focused eyes */}
        <circle cx="70" cy="86" r="5" fill="white" />
        <circle cx="82" cy="86" r="5" fill="white" />
        <circle cx="70" cy="86" r="2.5" fill="#7f1d1d" />
        <circle cx="82" cy="86" r="2.5" fill="#7f1d1d" />
        <circle cx="70.5" cy="85.5" r="1" fill="white" />
        <circle cx="82.5" cy="85.5" r="1" fill="white" />
        {/* Determined eyebrows */}
        <line x1="65" y1="80" x2="74" y2="81" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="87" y1="80" x2="78" y2="81" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round" />
        {/* Flat determined mouth */}
        <line x1="72" y1="95" x2="80" y2="95" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx="76" cy="114" rx="16" ry="14" fill="#dc2626" />
        {/* Cape! */}
        <path d="M60 105 Q50 120 45 135 L76 120 L107 135 Q102 120 92 105" fill="#991b1b" opacity="0.4" />
        {/* Arms reaching to screens */}
        <ellipse cx="52" cy="108" rx="10" ry="5" fill="#f87171" transform="rotate(-30 52 108)" />
        <ellipse cx="100" cy="108" rx="10" ry="5" fill="#f87171" transform="rotate(30 100 108)" />
        <circle cx="44" cy="104" r="4" fill="#f87171" />
        <circle cx="108" cy="104" r="4" fill="#f87171" />
        {/* Empty chair */}
        <rect x="10" y="98" width="16" height="18" rx="5" fill="#e2d5c5" opacity="0.35" />
        <rect x="8" y="96" width="20" height="4" rx="2" fill="#e2d5c5" opacity="0.25" />
        {!hero && <text x="80" y="148" textAnchor="middle" fill="#dc2626" fontSize="10" fontFamily="Nunito, sans-serif" fontWeight="700">ACTS ALONE</text>}
        {hero && <text x="80" y="148" textAnchor="middle" fill="#dc2626" fontSize="10" fontFamily="Nunito, sans-serif" fontWeight="700">ACTS ALONE</text>}
        <defs><radialGradient id={`clay4${id}`}><stop offset="0%" stopColor="#dc2626" stopOpacity="0.08"/><stop offset="100%" stopColor="#dc2626" stopOpacity="0"/></radialGradient></defs>
      </svg>
    ),
  }
  return illustrations[tier] || null
}

// ─── Tier Visualization ──────────────────────────────────────
function TierViz() {
  const tiers = [
    { level: 1, label: 'Tier 1', name: 'The Researcher', icon: <Search size={18} />, color: 'border-risk-low', bg: 'bg-risk-low/8', text: 'text-risk-low', desc: 'Reads what you share, answers your questions', benefit: 'A tireless analyst who never loses focus', risk: 'Can only see what you show them' },
    { level: 2, label: 'Tier 2', name: 'The Coordinator', icon: <CalendarSync size={18} />, color: 'border-risk-moderate', bg: 'bg-risk-moderate/8', text: 'text-risk-moderate', desc: 'Has keys to the office — email, calendar, shared drives', benefit: 'Handles the routine work that buries you', risk: 'Can now write under your name' },
    { level: 3, label: 'Tier 3', name: 'The Shadow', icon: <UserRoundSearch size={18} />, color: 'border-risk-high', bg: 'bg-risk-high/8', text: 'text-risk-high', desc: 'Follows you everywhere — sees your screen, your passwords, your open tabs', benefit: 'Moves fluidly across all your systems', risk: 'Sees what you happen to have open, not just what you chose to share' },
    { level: 4, label: 'Tier 4', name: 'The Delegate', icon: <BotOff size={18} />, color: 'border-risk-critical', bg: 'bg-risk-critical/8', text: 'text-risk-critical', desc: 'Works while you sleep — chains tasks, makes judgment calls', benefit: 'Your organization operates beyond your personal capacity', risk: "You've delegated not just access but judgment" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tiers.map((tier, i) => (
        <motion.div
          key={tier.level}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.5 }}
          onClick={() => { window.location.hash = `tier-${tier.level}` }}
          style={{ cursor: 'pointer' }}
          className={`bg-white shadow-clay border-2 ${tier.color} rounded-2xl p-6 flex flex-col items-center text-center clay-card`}
        >
          <div className="mb-3">
            <TierIllustration tier={tier.level} size={100} />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-semibold text-clay-500 tracking-wider">{tier.label}</span>
            <div className={`${tier.text}`}>{tier.icon}</div>
          </div>
          <h3 className={`text-lg font-bold ${tier.text} mb-1`}>{tier.name}</h3>
          <p className="text-xs text-clay-600 mb-3">{tier.desc}</p>
          <div className="w-full space-y-1.5 text-left">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-risk-low mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-clay-600">{tier.benefit}</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle size={12} className={`${tier.text} mt-0.5 flex-shrink-0`} />
              <p className="text-[11px] text-clay-600">{tier.risk}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Permission Spectrum ─────────────────────────────────────
function PermissionSpectrum() {
  const levels = [
    { label: 'Ask Every Time', desc: 'You review everything', safe: 5 },
    { label: 'Allow Once', desc: 'You review once', safe: 4 },
    { label: 'Allow This Session', desc: 'You review once per session', safe: 3 },
    { label: 'Allow Always', desc: 'You never see it again', safe: 2 },
    { label: 'Skip Permissions', desc: 'Claude acts freely', safe: 1 },
  ]

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-risk-low tracking-wider font-semibold">SAFEST</span>
        <span className="text-[10px] font-mono text-risk-critical tracking-wider font-semibold">RISKIEST</span>
      </div>
      <div className="flex gap-1">
        {levels.map((level, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="flex-1 origin-bottom"
          >
            <div
              className="rounded-t-lg p-3 text-center"
              style={{
                background: `rgba(${i === 0 ? '34,197,94' : i === 1 ? '34,197,94' : i === 2 ? '245,158,11' : i === 3 ? '249,115,22' : '239,68,68'}, ${0.1 + i * 0.04})`,
                borderTop: `2px solid rgba(${i === 0 ? '34,197,94' : i === 1 ? '34,197,94' : i === 2 ? '245,158,11' : i === 3 ? '249,115,22' : '239,68,68'}, 0.4)`,
                minHeight: `${60 + i * 16}px`,
              }}
            >
              <p className="text-[10px] font-mono font-semibold text-clay-700 mb-1 leading-tight">{level.label}</p>
              <p className="text-[9px] text-clay-500 leading-tight hidden sm:block">{level.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-warm-50/80 border border-clay-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-teal-700 font-semibold mb-1">The Golden Rule</p>
        <p className="text-xs text-clay-600">If an action affects other people — sends a message, modifies shared data, accesses someone else's information — it should <span className="text-clay-900 font-semibold">never</span> be set to "Allow Always."</p>
      </div>
    </div>
  )
}

// ─── Warning Signals Table ───────────────────────────────────
function WarningSignals() {
  const signals = [
    { signal: 'Claude mentions topics you didn\'t bring up', meaning: 'Possible prompt injection from web content', action: 'Stop the task. Start a new conversation' },
    { signal: 'Claude asks for passwords or tokens directly', meaning: 'Prompt injection or confused context', action: 'Never provide credentials in chat' },
    { signal: 'Claude navigates to unexpected websites', meaning: 'Possible redirect from malicious content', action: 'Stop immediately. Revoke JavaScript permissions' },
    { signal: 'Claude wants to send an email you didn\'t draft', meaning: 'Confused instructions or injection', action: 'Review carefully. When in doubt, don\'t send' },
    { signal: 'Actions happen faster than you can review', meaning: 'Permissions may be too broad', action: 'Tighten to "Ask Every Time"' },
  ]

  return (
    <div className="space-y-2">
      {signals.map((s, i) => (
        <div key={i} className="bg-risk-critical/5 border border-risk-critical/10 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-risk-critical mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-clay-800">{s.signal}</p>
              <p className="text-xs text-clay-500 mt-0.5">{s.meaning}</p>
              <p className="text-xs text-teal-700 mt-1 font-medium">{s.action}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Recommended Setup ───────────────────────────────────────
function RecommendedSetup() {
  const items = [
    { component: 'Claude Code CLI', setting: 'Enabled, standard permissions', risk: 'low', rationale: 'Your primary interface — safe and productive' },
    { component: 'MCP servers (read-focused)', setting: 'Calendar, Drive, Fathom — enabled', risk: 'moderate', rationale: 'High value, moderate risk, review actions' },
    { component: 'MCP servers (write-capable)', setting: 'Gmail, Slack, Asana — with approval', risk: 'moderate', rationale: 'Never auto-approve sends or modifications' },
    { component: 'Chrome side panel', setting: 'Dedicated profile only', risk: 'high', rationale: 'Separate profile prevents accidental exposure' },
    { component: 'Chrome JavaScript', setting: 'Disabled by default', risk: 'high', rationale: 'Enable per-task, revoke after' },
    { component: 'Computer Use', setting: 'Disabled', risk: 'critical', rationale: 'Risk outweighs convenience for most workflows' },
    { component: 'Dispatch (mobile)', setting: 'Read-only tasks only', risk: 'high', rationale: 'Don\'t approve write actions from phone' },
    { component: 'Autonomous mode', setting: 'Never on real data', risk: 'critical', rationale: 'Sandbox / prototype use only' },
  ]

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-clay-200/60 last:border-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
            backgroundColor: item.risk === 'low' ? '#22c55e' : item.risk === 'moderate' ? '#f59e0b' : item.risk === 'high' ? '#f97316' : '#ef4444'
          }} />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-clay-800">{item.component}</span>
            <span className="text-xs text-clay-500 ml-2">{item.setting}</span>
          </div>
          <span className="text-[10px] text-clay-400 font-mono hidden sm:block">{item.rationale}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────
export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream bg-clay-texture">
      {/* ── Navigation ──────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-clay-200/60 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Shield size={18} className="text-teal-700" />
            <span className="font-mono text-xs font-semibold tracking-wider text-clay-600">PAI SAFETY & SECURITY</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {['The Metaphor', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Permissions', 'Warning Signs', 'Response Playbook'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-clay-500 hover:text-teal-700 transition-colors">
                {label}
              </a>
            ))}
          </div>
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden text-clay-600 hover:text-teal-700">
            <ChevronDown size={18} className={`transition-transform ${navOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {navOpen && (
          <div className="md:hidden bg-warm-50 border-t border-clay-200 px-6 py-3 space-y-2">
            {['The Metaphor', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Permissions', 'Warning Signs', 'Response Playbook', 'Organizations', 'Glossary', 'Legal'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setNavOpen(false)} className="block text-sm text-clay-600 hover:text-teal-700 py-1">
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-14">
        {/* ── Hero ──────────────────────────────── */}
        <section id="top" className="py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-teal-300/30" />
              <span className="text-[10px] font-mono text-teal-700 tracking-[0.2em] font-semibold">v1.1 — MARCH 2026</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-teal-300/30" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-clay-900 text-center leading-[1.1] tracking-tight mb-6">
              Personal AI Assistant<br />
              <span className="text-teal-700">Safety &amp; Security Guide</span>
            </h1>
            <p className="text-center text-lg md:text-xl text-clay-600 max-w-2xl mx-auto leading-relaxed mb-8">
              A practical framework for using AI coding assistants safely.<br className="hidden md:block" />
              Written for Claude Code. Principles apply to Cursor, Copilot, and beyond.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-clay-400">
              <Shield size={12} />
              <span className="font-mono">Joshua Peskay, CISSP | CISM</span>
              <span className="text-clay-300">•</span>
              <span className="font-mono">Meet the Moment</span>
            </div>
          </motion.div>
        </section>

        {/* ── Why This Guide Exists ─────────────── */}
        <Section className="pb-10">
          <div className="bg-white shadow-clay border border-clay-100 rounded-2xl p-8 md:p-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-4">Why This Guide Exists</h2>
            <p className="text-base text-clay-700 leading-relaxed mb-4">
              AI tools are already transforming how organizations work. The biggest risk isn't adopting them badly — it's <span className="text-clay-900 font-semibold">not adopting them at all</span> and falling behind while peers move forward. This guide helps you adopt AI confidently, not avoid it entirely.
            </p>
            <p className="text-base text-clay-600 leading-relaxed">
              You don't need to understand every technical detail. You need a mental model for making good decisions — which features to enable, which to skip, and how to tell the difference.
            </p>
          </div>
        </Section>

        {/* ── Core Principle ────────────────────── */}
        <Section className="pb-16">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 rounded-2xl p-8 md:p-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-4">The Core Principle</h2>
            <p className="text-lg text-clay-700 leading-relaxed mb-6">
              <span className="text-clay-900 font-semibold">Every feature you enable gives Claude more capability AND more access.</span> That's not inherently bad — it's the whole point. But each addition changes your risk profile.
            </p>
            <p className="text-base text-clay-600 leading-relaxed">
              The question isn't <em>"is this safe?"</em> — it's <em className="text-teal-700">"is this risk appropriate for what I'm doing?"</em>
            </p>
          </div>
        </Section>

        {/* ── The Metaphor ────────────────────── */}
        <Section className="pb-20" id="the-metaphor">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={18} className="text-teal-700" />
            <span className="text-[10px] font-mono text-teal-700 tracking-[0.15em] font-semibold">THE METAPHOR</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-3">Same Assistant. Different Access. Different Stakes.</h2>
          <p className="text-sm text-clay-600 mb-8 max-w-2xl">Think of your AI assistant as a new team member. Their skill never changes — what changes is which doors you open for them. Each tier grants deeper access to your digital workspace, with more capability <em>and</em> more exposure.</p>
          <TierViz />
        </Section>

        {/* ── Tier 1 ───────────────────────────── */}
        <Section className="pb-20" id="tier-1">
          <div className="tier-border-low pl-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
              <TierIllustration tier={1} hero={true} />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <RiskBadge level="low" />
                  <span className="text-[10px] font-mono text-clay-500 tracking-wider">TIER 1</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-2">The Researcher</h2>
                <p className="text-sm text-clay-600">Safe for most users with minimal precautions.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Expandable
                title="Features at This Tier"
                icon={<ShieldCheck size={16} className="text-risk-low" />}
                defaultOpen={true}
              >
                <div className="pt-3">
                  <FeatureRow feature="Claude Code CLI" description="AI assistant in your terminal" risk="low" detail="You see every action, approve every command. Nothing happens without your explicit permission." />
                  <FeatureRow feature="Read-only file access" description="Claude reads your code and documents" risk="low" detail="Reading isn't changing. Claude can't modify anything without asking. But be aware: Claude can see .env files, config files, and credential stores in your project directory." />
                  <FeatureRow feature="Web search" description="Claude searches the internet for you" risk="low" detail="Low risk alone. Note: when combined with local file access, web search could theoretically be used as an exfiltration channel via crafted URLs." />
                  <FeatureRow feature="Basic slash commands" description="Pre-built workflows (/commit, /review)" risk="low" detail="Scoped to specific, predictable tasks." />
                </div>
              </Expandable>

              <Expandable
                title="Setup Checklist"
                icon={<CheckCircle2 size={16} className="text-risk-low" />}
              >
                <Checklist id="tier1" items={[
                  'Install Claude Code from Anthropic\'s official source',
                  'Review the default permission settings — understand what "Allow" vs "Allow Always" means',
                  'Start with the default permission mode (ask every time) until you\'re comfortable',
                  'Don\'t paste sensitive credentials into chat — use environment variables instead',
                  'Create a .claudeignore file to exclude .env files, credential stores (~/.aws/credentials), and config files with secrets from Claude\'s context',
                  'Keep Claude Code updated — Anthropic\'s October 2025 sandboxing update provides OS-level filesystem and network isolation',
                ]} />
                <p className="text-xs text-clay-400 mt-4 font-mono">Maintenance: None beyond keeping Claude Code updated.</p>
              </Expandable>
            </div>
          </div>
        </Section>

        {/* ── Tier 2 ───────────────────────────── */}
        <Section className="pb-20" id="tier-2">
          <div className="tier-border-moderate pl-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
              <TierIllustration tier={2} hero={true} />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <RiskBadge level="moderate" />
                  <span className="text-[10px] font-mono text-clay-500 tracking-wider">TIER 2</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-2">The Coordinator</h2>
                <p className="text-sm text-clay-600">Each connection gives Claude access to real data and the ability to take real actions.</p>
              </div>
            </div>

            <div className="bg-white shadow-clay rounded-xl p-5 mb-6 border border-clay-100">
              <h3 className="text-sm font-semibold text-clay-900 mb-2">How Tools Connect to AI</h3>
              <p className="text-sm text-clay-600 leading-relaxed">
                AI assistants connect to your work tools in several ways. <strong className="text-clay-700">MCP servers</strong> (Model Context Protocol) are direct, real-time connections that let AI read and write data in apps like your calendar, email, or cloud storage. <strong className="text-clay-700">Plugins and extensions</strong> are pre-built integrations — often installed from a marketplace — that give AI access to specific services. <strong className="text-clay-700">API connections</strong> are custom-built links, typically set up by a developer or IT team, that connect AI to internal systems or databases. Each method varies in complexity, but the security principle is the same: every connection you add expands what AI can see and do. The more tools connected, the more powerful the AI becomes — and the more important it is to understand what you've granted access to.
              </p>
            </div>

            {/* MCP Supply Chain Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-risk-moderate mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono font-semibold text-risk-moderate tracking-wider mb-2">MCP SUPPLY CHAIN RISK</p>
                  <p className="text-sm text-clay-700 leading-relaxed mb-2">
                    MCP servers are <span className="text-clay-900 font-semibold">code running on your machine with your credentials</span>. In January 2026, three CVEs were disclosed in Anthropic's own official Git MCP server — including one that allowed remote code execution. Community-built servers carry additional risk from typosquatting, dependency poisoning, and maintainer compromise.
                  </p>
                  <p className="text-sm text-clay-600 leading-relaxed">
                    <span className="text-clay-800 font-medium">Before installing any MCP server:</span> verify the source (official vs. community), check for recent maintenance, review the permissions it requests, and prefer servers with read-only modes. Only install from trusted package registries.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Expandable
                title="Features at This Tier"
                icon={<Key size={16} className="text-risk-moderate" />}
                defaultOpen={true}
              >
                <div className="pt-3">
                  <FeatureRow feature="Google Calendar / Outlook" description="Read/create/modify calendar events" risk="moderate" detail="Claude sees all your meetings, attendees, and notes. A malicious calendar invite could contain hidden instructions." />
                  <FeatureRow feature="Google Drive / OneDrive" description="Search, read, create documents" risk="moderate" detail="Claude can access any document in your cloud storage, including shared files from others." />
                  <FeatureRow feature="Project Management (Asana, Monday, Trello, etc.)" description="Read/update project tasks" risk="moderate" detail="Claude can modify task status, create items, change assignments." />
                  <FeatureRow feature="Messaging (Slack, Teams, etc.)" description="Read/send messages" risk="high" detail="Claude can read channels and send messages as you. A prompt injection in a message could trigger unintended actions." />
                  <FeatureRow feature="Email (Gmail, Outlook)" description="Read/send/draft emails" risk="high" detail="Claude can read your inbox and send emails on your behalf. Review every outbound message before it sends." />
                  <FeatureRow feature="Meeting Transcripts (Fathom, Otter, Fireflies, etc.)" description="Read meeting recordings and notes" risk="moderate" detail="Transcripts contain everything said in meetings, including sensitive discussions." />
                  <FeatureRow feature="Scheduling (Calendly, Cal.com, etc.)" description="Read/manage scheduling" risk="low" detail="Limited scope — scheduling data is less sensitive." />
                  <p className="text-xs text-clay-500 mt-3 italic">These are common examples — there are hundreds of tool integrations available. The same risk principles apply to any tool you connect.</p>
                </div>
              </Expandable>

              <Expandable
                title="Decision Framework: Should I Connect This?"
                icon={<Info size={16} className="text-risk-moderate" />}
              >
                <div className="pt-3 space-y-4">
                  <div className="bg-clay-50 rounded-xl p-4 space-y-3">
                    <p className="text-sm text-clay-700 font-semibold">Ask yourself three questions:</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-teal-700 font-mono text-sm font-bold">1.</span>
                        <p className="text-sm text-clay-600"><span className="text-clay-800 font-medium">Do I use this service daily with Claude?</span> If yes, connect it. If "maybe sometimes," don't.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-teal-700 font-mono text-sm font-bold">2.</span>
                        <p className="text-sm text-clay-600"><span className="text-clay-800 font-medium">Does this service contain data about other people?</span> Client records, HR data, donor info, health information? If yes, think twice.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-teal-700 font-mono text-sm font-bold">3.</span>
                        <p className="text-sm text-clay-600"><span className="text-clay-800 font-medium">Can Claude take irreversible actions?</span> Send emails, post messages, delete records? If yes, keep approval mode on — never "always allow."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Expandable>

              <Expandable
                title="Setup Checklist"
                icon={<CheckCircle2 size={16} className="text-risk-moderate" />}
              >
                <Checklist id="tier2" items={[
                  'Only connect services you actively need — don\'t enable everything "just in case"',
                  'Review what permissions each MCP server requests (read-only vs. read-write)',
                  'Vet MCP servers before installing: prefer official or well-maintained servers with published source code. Check the package name carefully — typosquatting is common',
                  'For each connection, ask: "What\'s the worst thing Claude could do with this access?"',
                  'If a service has read-only mode available, start there',
                  'Never approve "send email" or "post message" actions without reviewing the content first',
                  'Beware the "Lethal Trifecta": avoid connecting services that give Claude private data access + untrusted content exposure + external communication ability simultaneously',
                ]} />
                <div className="mt-4 space-y-1 text-xs text-clay-400 font-mono">
                  <p>Monthly: Review MCP servers. Disable any unused for 30 days.</p>
                  <p>After incidents: Check if affected services are in your stack.</p>
                  <p>Role changes: Audit all connections for new context.</p>
                </div>
              </Expandable>
            </div>
          </div>
        </Section>

        {/* ── Tier 3 ───────────────────────────── */}
        <Section className="pb-20" id="tier-3">
          <div className="tier-border-high pl-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
              <TierIllustration tier={3} hero={true} />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <RiskBadge level="high" />
                  <span className="text-[10px] font-mono text-clay-500 tracking-wider">TIER 3</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-2">The Shadow</h2>
                <p className="text-sm text-clay-600">Claude gets access to your live browser sessions — the same websites you're logged into, with the same credentials.</p>
              </div>
            </div>

            {/* Anthropic Warning */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-risk-high mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono font-semibold text-risk-high tracking-wider mb-2">FROM ANTHROPIC'S OWN DOCUMENTATION</p>
                  <blockquote className="text-sm text-clay-700 italic leading-relaxed border-l-2 border-orange-300 pl-3">
                    "If Claude were ever manipulated through a prompt injection attack, this capability could potentially be used to read your credentials or take actions within your logged-in sessions. <span className="text-clay-900 font-semibold not-italic">These filters are NOT a security boundary.</span>"
                  </blockquote>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Expandable
                title="Features at This Tier"
                icon={<Eye size={16} className="text-risk-high" />}
                defaultOpen={true}
              >
                <div className="pt-3">
                  <FeatureRow feature="Claude in Chrome (side panel)" description="Takes screenshots of your active browser tab" risk="high" detail="Claude sees everything on screen — bank balances, medical records, client data, personal messages. Whatever is visible, Claude captures." />
                  <FeatureRow feature="JavaScript execution (per-domain)" description="Interact with web pages — click, fill forms, read data" risk="critical" detail="Claude has the same access as you on that website. If manipulated by hidden instructions (prompt injection), it could read your cookies, session tokens, and act as you." />
                  <FeatureRow feature="Computer Use" description="Claude interacts with your screen via screenshots and coordinate-based actions" risk="critical" detail="Claude takes screenshots, identifies elements, and clicks/types on your behalf. While not raw input device control, the effect is the same — Claude can navigate anywhere your screen shows and take any action you could take." />
                </div>
              </Expandable>

              <Expandable
                title="When Is This Okay?"
                icon={<Info size={16} className="text-risk-high" />}
              >
                <div className="pt-3 space-y-2">
                  <DecisionCard situation="Browsing public websites for research" recommendation="Side panel is fine, skip JavaScript" safe={true} />
                  <DecisionCard situation="Filling out forms on trusted sites" recommendation="Enable JavaScript for that domain only, then revoke" safe={true} />
                  <DecisionCard situation="Logged into client systems (CRM, EHR, case management)" recommendation="Do NOT open Claude side panel" safe={false} />
                  <DecisionCard situation="Online banking, healthcare portals, government sites" recommendation="Absolutely not. Use a different Chrome profile entirely" safe={false} />
                  <DecisionCard situation="You handle other people's sensitive data (PII, PHI, financial)" recommendation="Do not enable JavaScript. Period." safe={false} />
                </div>
              </Expandable>

              <Expandable
                title="Setup Checklist"
                icon={<CheckCircle2 size={16} className="text-risk-high" />}
              >
                <Checklist id="tier3" items={[
                  'Create a separate Chrome profile for Claude — no banking, no healthcare, no client systems',
                  'Keep JavaScript execution disabled by default. Enable only per-task, then revoke',
                  'Never open the Claude side panel while viewing sensitive information',
                  'If Claude behaves unexpectedly (unrelated topics, credential requests, unexpected navigation) — stop immediately',
                  'Do not use Claude in Chrome on shared or public computers',
                ]} />
                <div className="mt-4 space-y-1 text-xs text-clay-400 font-mono">
                  <p>Weekly: Review and revoke JavaScript domain permissions.</p>
                  <p>Before each use: Close sensitive tabs before opening side panel.</p>
                  <p>Always: Verify you're in the correct Chrome profile.</p>
                </div>
              </Expandable>
            </div>
          </div>
        </Section>

        {/* ── Tier 4 ───────────────────────────── */}
        <Section className="pb-20" id="tier-4">
          <div className="tier-border-critical pl-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
              <TierIllustration tier={4} hero={true} />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <RiskBadge level="critical" />
                  <span className="text-[10px] font-mono text-clay-500 tracking-wider">TIER 4</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-2">The Delegate</h2>
                <p className="text-sm text-clay-600">Claude operates with reduced oversight or from a remote device.</p>
              </div>
            </div>

            {/* Zero-click vulnerability callout */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <ShieldAlert size={18} className="text-risk-critical mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono font-semibold text-risk-critical tracking-wider mb-2">KNOWN ARCHITECTURAL LIMITATION — CRITICAL SEVERITY</p>
                  <p className="text-sm text-clay-700 leading-relaxed mb-3">
                    Someone sends you a Google Calendar invite. The event title looks normal — "Task Management" or "Q2 Planning." But hidden in the event description are instructions that Claude interprets as commands.
                  </p>
                  <p className="text-sm text-clay-700 leading-relaxed mb-3">
                    When you ask Claude to check your calendar, it reads the event, follows the hidden instructions, and uses your other connected services (email, files) to execute them. <span className="text-clay-900 font-semibold">You never see it happening.</span>
                  </p>
                  <p className="text-sm text-clay-700 leading-relaxed mb-3">
                    This attack has been demonstrated against Google Gemini and Microsoft Copilot. The same vector applies to any AI assistant with simultaneous access to calendar, files, and external communications — what security researcher Simon Willison calls <span className="text-clay-900 font-semibold">"The Lethal Trifecta"</span>: private data access + untrusted content exposure + ability to communicate externally.
                  </p>
                  <p className="text-sm text-clay-600 leading-relaxed mb-2">
                    <span className="text-risk-critical font-medium">This applies when you have Calendar + Email (or Slack) MCP servers connected simultaneously.</span> Users at Tier 1 with no MCP connections are not affected by this specific attack.
                  </p>
                  <p className="text-xs text-clay-500">
                    As of March 2026, Anthropic has characterized this as an inherent limitation of tool-use architectures rather than a patchable vulnerability. OWASP ranks prompt injection as the #1 risk in AI applications. Check <a href="https://modelcontextprotocol.io/specification/draft/basic/security_best_practices" className="text-teal-700/70 hover:text-teal-700">MCP security best practices</a> and <a href="https://www.anthropic.com/research/prompt-injection-defenses" className="text-teal-700/70 hover:text-teal-700">Anthropic's security advisories</a> for current status.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Expandable
                title="Features at This Tier"
                icon={<ShieldOff size={16} className="text-risk-critical" />}
                defaultOpen={true}
              >
                <div className="pt-3">
                  <FeatureRow feature="Dispatch (mobile remote)" description="Control Claude Desktop from your phone" risk="critical" detail="Your phone becomes a remote interface for everything Claude can access on your desktop. If your phone is compromised, your entire AI setup is compromised." />
                  <FeatureRow feature="Autonomous mode (--dangerously-skip-permissions)" description="Claude executes without asking permission" risk="critical" detail="Claude can run any command, modify any file, send any message without your approval. Appropriate for throwaway sandboxes only." />
                  <FeatureRow feature="MCP connector chaining" description="Multiple connected services can trigger each other" risk="critical" detail="A calendar event can trigger email access can trigger file modifications. This is the attack vector for the CVSS 10/10 vulnerability above." />
                </div>
              </Expandable>

              <Expandable
                title="When Is This Okay?"
                icon={<Info size={16} className="text-risk-critical" />}
              >
                <div className="pt-3 space-y-2">
                  <DecisionCard situation="Building a prototype in a sandbox" recommendation="Autonomous mode is fine — nothing real at stake" safe={true} />
                  <DecisionCard situation="Using Dispatch for read-only tasks" recommendation="Acceptable, but don't approve write actions from your phone" safe={true} />
                  <DecisionCard situation="Working on client deliverables" recommendation="Standard permission mode. Review every action" safe={false} />
                  <DecisionCard situation="Sending emails or Slack messages" recommendation="Never autonomous. Always review before send" safe={false} />
                  <DecisionCard situation="Managing multiple MCP servers" recommendation="Audit the chain: what can read → what can write → what's the worst path?" safe={false} />
                </div>
              </Expandable>

              <Expandable
                title="Setup Checklist"
                icon={<CheckCircle2 size={16} className="text-risk-critical" />}
              >
                <Checklist id="tier4" items={[
                  'Dispatch: Only enable when actively needed, disable when not in use',
                  'Never use --dangerously-skip-permissions on any machine with real data or credentials',
                  'Review MCP connector combinations — ask: "If malicious instructions entered service A, could Claude use service B to act on them?"',
                  'Watch for high-risk combos: Calendar + Email, Slack + Email, any read-service + any write-service',
                  'Consider whether you truly need all connected services running simultaneously',
                ]} />
                <div className="mt-4 space-y-1 text-xs text-clay-400 font-mono">
                  <p>Monthly: Audit MCP connections for read-write chains.</p>
                  <p>Quarterly: Review if risk tolerance has changed.</p>
                  <p>After advisories: Check if your setup is affected.</p>
                </div>
              </Expandable>
            </div>
          </div>
        </Section>

        {/* ── Permission Spectrum ───────────────── */}
        <Section className="pb-20" id="permissions">
          <div className="flex items-center gap-3 mb-2">
            <Lock size={18} className="text-teal-700" />
            <span className="text-[10px] font-mono text-teal-700 tracking-[0.15em] font-semibold">UNDERSTANDING PERMISSIONS</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-3">The Permission Spectrum</h2>
          <p className="text-sm text-clay-600 mb-8">A simple way to think about what you're approving:</p>
          <PermissionSpectrum />
        </Section>

        {/* ── Warning Signs ────────────────────── */}
        <Section className="pb-20" id="warning-signs">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={18} className="text-risk-high" />
            <span className="text-[10px] font-mono text-risk-high tracking-[0.15em] font-semibold">QUICK REFERENCE</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-3">When Something Feels Wrong</h2>
          <p className="text-sm text-clay-600 mb-8">Trust your instincts. If Claude's behavior surprises you, pause and evaluate.</p>
          <WarningSignals />
        </Section>

        {/* ── What To Do If ────────────────────── */}
        <Section className="pb-20" id="response-playbook">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert size={18} className="text-teal-700" />
            <span className="text-[10px] font-mono text-teal-700 tracking-[0.15em] font-semibold">RESPONSE PLAYBOOK</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-3">What To Do If Something Goes Wrong</h2>
          <p className="text-sm text-clay-600 mb-8">Quick response protocols for the most common incidents.</p>

          <div className="space-y-4">
            <div className="bg-white shadow-clay border border-clay-100 rounded-xl p-5">
              <p className="text-sm font-semibold text-risk-high mb-3">If you suspect prompt injection</p>
              <div className="space-y-2 text-sm text-clay-600">
                <p><span className="text-clay-900 font-mono text-xs mr-2">1.</span> <span className="text-clay-800 font-medium">Stop immediately.</span> Do not continue the conversation or approve any pending actions.</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">2.</span> <span className="text-clay-800 font-medium">Start a new conversation.</span> The current context may be compromised.</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">3.</span> <span className="text-clay-800 font-medium">Revoke MCP tokens</span> for any write-capable services that were connected during the session.</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">4.</span> Check sent emails, Slack messages, and file changes for anything you didn't authorize.</p>
              </div>
            </div>

            <div className="bg-white shadow-clay border border-clay-100 rounded-xl p-5">
              <p className="text-sm font-semibold text-risk-high mb-3">If Claude sent a message you didn't authorize</p>
              <div className="space-y-2 text-sm text-clay-600">
                <p><span className="text-clay-900 font-mono text-xs mr-2">1.</span> <span className="text-clay-800 font-medium">Revoke all MCP tokens immediately.</span> Password reset alone may not be sufficient.</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">2.</span> Review your sent items across all connected services (email, Slack, etc.).</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">3.</span> Document what happened — screenshots, timestamps, the conversation that triggered it.</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">4.</span> Tighten permissions to "Ask Every Time" before resuming work.</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">5.</span> If organizational data was involved, notify your IT team or security contact.</p>
              </div>
            </div>

            <div className="bg-white shadow-clay border border-clay-100 rounded-xl p-5">
              <p className="text-sm font-semibold text-risk-moderate mb-3">If Claude accessed data it shouldn't have</p>
              <div className="space-y-2 text-sm text-clay-600">
                <p><span className="text-clay-900 font-mono text-xs mr-2">1.</span> <span className="text-clay-800 font-medium">Review your MCP connections.</span> Which services were active? What data could Claude see?</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">2.</span> Disconnect any MCP servers that provided access to sensitive data.</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">3.</span> Update your <code className="text-teal-700/70 text-xs">.claudeignore</code> file to exclude sensitive directories.</p>
                <p><span className="text-clay-900 font-mono text-xs mr-2">4.</span> If regulated data (PHI, PII) was involved, consult your privacy officer or legal counsel.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── For Organizations ─────────────────── */}
        <Section className="pb-20" id="organizations">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={18} className="text-teal-700" />
            <span className="text-[10px] font-mono text-teal-700 tracking-[0.15em] font-semibold">FOR ORGANIZATIONS</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-3">Additional Considerations</h2>
          <p className="text-sm text-clay-600 mb-8">If you're recommending Claude to an organization — especially nonprofits handling sensitive data:</p>

          <div className="space-y-3">
            {[
              { num: '01', title: 'Start at Tier 1', desc: 'Let staff get comfortable with the CLI before adding integrations.' },
              { num: '02', title: 'Data classification matters', desc: 'If your org handles PHI, PII, or data about vulnerable populations, Tier 3 and 4 features should require explicit leadership approval.' },
              { num: '03', title: 'Browser integration is not ready for sensitive environments', desc: 'Anthropic\'s own documentation says so. Don\'t deploy it on machines with access to case management, EHR, or donor databases.' },
              { num: '04', title: 'Create an AI Acceptable Use Policy first', desc: 'Staff need clear guidance on what they can and can\'t do before you hand them powerful tools.' },
              { num: '05', title: 'Audit MCP connections quarterly', desc: 'List all active connections, verify each is still needed, confirm permission levels, check for read-write chains (calendar + email), and document findings.' },
              { num: '06', title: 'Plan for staff transitions', desc: 'When someone leaves, which MCP connections are tied to their personal accounts vs. organizational accounts? Document this before it becomes urgent.' },
              { num: '07', title: 'Know who should be in the room', desc: 'Tier 1: individual decision. Tier 2: IT review. Tier 3: IT + leadership approval. Tier 4: IT + leadership + external security review.' },
              { num: '08', title: 'Have an incident response plan', desc: 'What happens when a staff member reports Claude sent an unauthorized email? Who gets notified, what gets disconnected, and how do you document it?' },
              { num: '09', title: 'Review vendor agreements', desc: 'Review Anthropic\'s Terms of Service and data processing agreement before connecting MCP servers that handle third-party personal data. Understand where data is processed and retained.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 bg-warm-50/40 border border-clay-200/60 rounded-lg p-4"
              >
                <span className="font-mono text-teal-700 text-sm font-bold flex-shrink-0">{item.num}</span>
                <div>
                  <p className="text-sm font-semibold text-clay-800">{item.title}</p>
                  <p className="text-xs text-clay-500 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Recommended Setup ────────────────── */}
        <Section className="pb-20" id="recommended-setup">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={18} className="text-teal-700" />
            <span className="text-[10px] font-mono text-teal-700 tracking-[0.15em] font-semibold">RECOMMENDED CONFIGURATION</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-3">Security-Conscious Professional Setup</h2>
          <p className="text-sm text-clay-600 mb-8">Balancing productivity with appropriate risk management:</p>
          <div className="bg-warm-50/60 border border-clay-200 rounded-xl p-5">
            <RecommendedSetup />
          </div>
        </Section>

        {/* ── Threat Model Glossary ────────────── */}
        <Section className="pb-20" id="glossary">
          <div className="flex items-center gap-3 mb-2">
            <Info size={18} className="text-teal-700" />
            <span className="text-[10px] font-mono text-teal-700 tracking-[0.15em] font-semibold">KEY CONCEPTS</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-clay-900 mb-3">Threat Model Glossary</h2>
          <p className="text-sm text-clay-600 mb-8">Three distinct risk categories with different mitigations.</p>

          <div className="space-y-3">
            <div className="bg-white shadow-clay border border-clay-100 rounded-xl p-5">
              <p className="text-sm font-semibold text-clay-800 mb-2">Prompt Injection</p>
              <p className="text-sm text-clay-600">Hidden instructions embedded in content Claude reads — a calendar invite, email, document, or webpage — that trick Claude into taking actions you didn't request. This is the #1 AI security risk according to OWASP, present in over 73% of production AI deployments assessed during security audits.</p>
            </div>
            <div className="bg-white shadow-clay border border-clay-100 rounded-xl p-5">
              <p className="text-sm font-semibold text-clay-800 mb-2">Data Exfiltration</p>
              <p className="text-sm text-clay-600">When sensitive information leaves your system through an unintended channel. In AI contexts, this could mean Claude encoding private data into a web search URL, including confidential information in an outbound email, or an MCP server observing data flowing through the shared conversation context.</p>
            </div>
            <div className="bg-white shadow-clay border border-clay-100 rounded-xl p-5">
              <p className="text-sm font-semibold text-clay-800 mb-2">Excessive Agency</p>
              <p className="text-sm text-clay-600">When an AI takes actions beyond what the user intended — sending messages, modifying files, or accessing services without explicit approval. Mitigated by keeping permissions tight and never auto-approving write actions that affect other people.</p>
            </div>
          </div>
        </Section>

        {/* ── Legal & Compliance ──────────────────── */}
        <Section className="pb-20" id="legal">
          <div className="bg-white shadow-clay border border-clay-100 rounded-2xl p-8 md:p-10">
            <h2 className="font-display text-xl md:text-2xl font-bold text-clay-900 mb-4">Legal &amp; Compliance Note</h2>
            <p className="text-sm text-clay-600 leading-relaxed mb-4">
              <span className="text-clay-900 font-semibold">This guide provides security guidance, not legal advice.</span> If your organization handles regulated data, consult qualified counsel before processing it through AI tools.
            </p>
            <div className="space-y-3 text-sm text-clay-600">
              <p><span className="text-clay-800 font-medium">HIPAA:</span> Organizations handling protected health information should evaluate whether AI vendors qualify as business associates. Connecting MCP servers to systems containing PHI may trigger specific obligations.</p>
              <p><span className="text-clay-800 font-medium">State Privacy Laws:</span> As of 2026, twenty U.S. states have comprehensive privacy laws in effect. Connecting AI to systems containing constituent data may trigger state-level obligations, including Colorado's AI-specific impact assessment requirements.</p>
              <p><span className="text-clay-800 font-medium">NIST AI Agent Standards:</span> The NIST AI Agent Standards Initiative (launched February 2026) is developing security and interoperability standards for autonomous AI agents. These emerging frameworks will shape enterprise AI governance — aligning your practices now positions your organization ahead of regulatory requirements.</p>
              <p><span className="text-clay-800 font-medium">Vendor Agreements:</span> Review your AI vendor's Terms of Service and data processing agreements before connecting services that handle personal data. Understand where data is processed, how long it is retained, and what happens if the vendor's terms change.</p>
            </div>
          </div>
        </Section>

        {/* ── Footer ───────────────────────────── */}
        <footer className="border-t border-clay-200/60 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield size={16} className="text-teal-700" />
            <span className="font-mono text-xs text-clay-500 tracking-wider">PERSONAL AI ASSISTANT — SAFETY & SECURITY GUIDE</span>
          </div>
          <p className="text-sm text-clay-500 mb-1">
            Created by <span className="text-clay-600">Joshua Peskay</span>, CISSP | CISM
          </p>
          <p className="text-sm text-clay-400 mb-4">
            <a href="https://mtm.now" className="text-teal-700/70 hover:text-teal-700 transition-colors">Meet the Moment</a> — mtm.now
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-clay-300 font-mono">
            <span>v1.1</span>
            <span>•</span>
            <span>Last reviewed: March 26, 2026</span>
            <span>•</span>
            <span>Next review: June 26, 2026</span>
          </div>
          <p className="text-[10px] text-clay-300 mt-4 italic">
            This guide was created with AI assistance and reviewed by a CISSP-certified security professional.
          </p>
        </footer>
      </div>
    </div>
  )
}
