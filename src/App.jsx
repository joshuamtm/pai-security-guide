import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Home, Key, Eye, Monitor, Smartphone, ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Info, ExternalLink, Lock, Unlock, ShieldAlert, ShieldCheck, ShieldOff, Radio } from 'lucide-react'
import './index.css'

// ─── Animated Section Wrapper ────────────────────────────────
function Section({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
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
          <span className={`text-sm leading-relaxed transition-colors ${checked[i] ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'}`}>
            {item}
          </span>
        </label>
      ))}
      <div className="text-xs text-gray-600 mt-2 font-mono">
        {Object.values(checked).filter(Boolean).length}/{items.length} complete
      </div>
    </div>
  )
}

// ─── Expandable Card ─────────────────────────────────────────
function Expandable({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-surface/60 border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-light/30 transition-colors"
      >
        {icon}
        <span className="text-sm font-semibold text-gray-200 flex-1">{title}</span>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={16} className="text-gray-500" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 border-t border-gray-800/50">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Risk Badge ──────────────────────────────────────────────
function RiskBadge({ level }) {
  const config = {
    low: { bg: 'bg-risk-low/15', text: 'text-risk-low', border: 'border-risk-low/30', label: 'LOW RISK' },
    moderate: { bg: 'bg-risk-moderate/15', text: 'text-risk-moderate', border: 'border-risk-moderate/30', label: 'MODERATE' },
    high: { bg: 'bg-risk-high/15', text: 'text-risk-high', border: 'border-risk-high/30', label: 'HIGH RISK' },
    critical: { bg: 'bg-risk-critical/15', text: 'text-risk-critical', border: 'border-risk-critical/30', label: 'CRITICAL' },
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
    <div className="py-3 border-b border-gray-800/50 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-1">
        <span className="text-sm font-semibold text-gray-200">{feature}</span>
        <RiskBadge level={risk} />
      </div>
      <p className="text-xs text-gray-500 mb-1">{description}</p>
      <p className="text-xs text-gray-400 italic">{detail}</p>
    </div>
  )
}

// ─── Decision Card ───────────────────────────────────────────
function DecisionCard({ situation, recommendation, safe }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${safe ? 'bg-risk-low/5 border border-risk-low/20' : 'bg-risk-critical/5 border border-risk-critical/20'}`}>
      {safe ? <CheckCircle2 size={16} className="text-risk-low mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="text-risk-critical mt-0.5 flex-shrink-0" />}
      <div>
        <p className="text-sm font-medium text-gray-200">{situation}</p>
        <p className="text-xs text-gray-400 mt-1">{recommendation}</p>
      </div>
    </div>
  )
}

// ─── House Visualization ─────────────────────────────────────
function HouseViz() {
  const tiers = [
    { level: 4, label: 'Tier 4', name: 'Remote Control', icon: <Smartphone size={18} />, color: 'border-risk-critical', bg: 'bg-risk-critical/8', text: 'text-risk-critical', desc: 'All of the above, from your phone' },
    { level: 3, label: 'Tier 3', name: 'Over Your Shoulder', icon: <Eye size={18} />, color: 'border-risk-high', bg: 'bg-risk-high/8', text: 'text-risk-high', desc: 'Watching your screen, using your browser' },
    { level: 2, label: 'Tier 2', name: 'Keys to Rooms', icon: <Key size={18} />, color: 'border-risk-moderate', bg: 'bg-risk-moderate/8', text: 'text-risk-moderate', desc: 'Access to email, calendar, projects' },
    { level: 1, label: 'Tier 1', name: 'Living Room', icon: <Home size={18} />, color: 'border-risk-low', bg: 'bg-risk-low/8', text: 'text-risk-low', desc: 'Can see the coffee table, does what you ask' },
  ]

  return (
    <div className="space-y-2">
      {tiers.map((tier, i) => (
        <motion.div
          key={tier.level}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.4 }}
          className={`border-l-2 ${tier.color} ${tier.bg} rounded-r-lg p-4 flex items-center gap-4`}
        >
          <div className={`${tier.text} flex-shrink-0`}>{tier.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-semibold text-gray-500 tracking-wider">{tier.label}</span>
              <span className={`text-sm font-semibold ${tier.text}`}>{tier.name}</span>
            </div>
            <p className="text-xs text-gray-500">{tier.desc}</p>
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
              <p className="text-[10px] font-mono font-semibold text-gray-300 mb-1 leading-tight">{level.label}</p>
              <p className="text-[9px] text-gray-500 leading-tight hidden sm:block">{level.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-surface/80 border border-gray-800 rounded-lg p-3 mt-4">
        <p className="text-xs text-accent font-semibold mb-1">The Golden Rule</p>
        <p className="text-xs text-gray-400">If an action affects other people — sends a message, modifies shared data, accesses someone else's information — it should <span className="text-white font-semibold">never</span> be set to "Allow Always."</p>
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
              <p className="text-sm font-medium text-gray-200">{s.signal}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.meaning}</p>
              <p className="text-xs text-accent mt-1 font-medium">{s.action}</p>
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
        <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-800/50 last:border-0">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
            backgroundColor: item.risk === 'low' ? '#22c55e' : item.risk === 'moderate' ? '#f59e0b' : item.risk === 'high' ? '#f97316' : '#ef4444'
          }} />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-200">{item.component}</span>
            <span className="text-xs text-gray-500 ml-2">{item.setting}</span>
          </div>
          <span className="text-[10px] text-gray-600 font-mono hidden sm:block">{item.rationale}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────
export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-midnight bg-blueprint-grid">
      {/* ── Navigation ──────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Shield size={18} className="text-accent" />
            <span className="font-mono text-xs font-semibold tracking-wider text-gray-400">AI SECURITY GUIDE</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {['House Metaphor', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Permissions', 'Warning Signs'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-gray-500 hover:text-accent transition-colors">
                {label}
              </a>
            ))}
          </div>
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden text-gray-400 hover:text-white">
            <ChevronDown size={18} className={`transition-transform ${navOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {navOpen && (
          <div className="md:hidden bg-surface border-t border-gray-800 px-6 py-3 space-y-2">
            {['House Metaphor', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Permissions', 'Warning Signs', 'Organizations', 'Recommended Setup'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setNavOpen(false)} className="block text-sm text-gray-400 hover:text-accent py-1">
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
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/30" />
              <span className="text-[10px] font-mono text-accent tracking-[0.2em] font-semibold">v1.0 — MARCH 2026</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/30" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-[1.1] tracking-tight mb-6">
              Personal AI<br />
              <span className="text-accent">Security Guide</span>
            </h1>
            <p className="text-center text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              A practical framework for using Claude Code safely.<br className="hidden md:block" />
              No cybersecurity degree required.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <Shield size={12} />
              <span className="font-mono">Joshua Peskay, CISSP | CISM</span>
              <span className="text-gray-700">•</span>
              <span className="font-mono">Meet the Moment</span>
            </div>
          </motion.div>
        </section>

        {/* ── Core Principle ────────────────────── */}
        <Section className="pb-16">
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-8 md:p-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">The Core Principle</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              <span className="text-white font-semibold">Every feature you enable gives Claude more capability AND more access.</span> That's not inherently bad — it's the whole point. But each addition changes your risk profile.
            </p>
            <p className="text-base text-gray-400 leading-relaxed">
              The question isn't <em>"is this safe?"</em> — it's <em className="text-accent">"is this risk appropriate for what I'm doing?"</em>
            </p>
          </div>
        </Section>

        {/* ── House Metaphor ────────────────────── */}
        <Section className="pb-20" id="house-metaphor">
          <div className="flex items-center gap-3 mb-2">
            <Home size={18} className="text-accent" />
            <span className="text-[10px] font-mono text-accent tracking-[0.15em] font-semibold">THE METAPHOR</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">Think of It Like Your House</h2>
          <p className="text-sm text-gray-400 mb-8 max-w-xl">You wouldn't give a house guest keys to every room on day one. Each tier of AI integration is like granting deeper access to your digital home.</p>
          <HouseViz />
        </Section>

        {/* ── Tier 1 ───────────────────────────── */}
        <Section className="pb-20" id="tier-1">
          <div className="tier-border-low pl-6">
            <div className="flex items-center gap-3 mb-2">
              <RiskBadge level="low" />
              <span className="text-[10px] font-mono text-gray-500 tracking-wider">TIER 1</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">The Foundation</h2>
            <p className="text-sm text-gray-400 mb-6">Safe for most users with minimal precautions.</p>

            <div className="space-y-4">
              <Expandable
                title="Features at This Tier"
                icon={<ShieldCheck size={16} className="text-risk-low" />}
                defaultOpen={true}
              >
                <div className="pt-3">
                  <FeatureRow feature="Claude Code CLI" description="AI assistant in your terminal" risk="low" detail="You see every action, approve every command. Nothing happens without your explicit permission." />
                  <FeatureRow feature="Read-only file access" description="Claude reads your code and documents" risk="low" detail="Reading isn't changing. Claude can't modify anything without asking." />
                  <FeatureRow feature="Web search" description="Claude searches the internet for you" risk="low" detail="Same as you Googling something. Claude reports back, doesn't act." />
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
                ]} />
                <p className="text-xs text-gray-600 mt-4 font-mono">Maintenance: None beyond keeping Claude Code updated.</p>
              </Expandable>
            </div>
          </div>
        </Section>

        {/* ── Tier 2 ───────────────────────────── */}
        <Section className="pb-20" id="tier-2">
          <div className="tier-border-moderate pl-6">
            <div className="flex items-center gap-3 mb-2">
              <RiskBadge level="moderate" />
              <span className="text-[10px] font-mono text-gray-500 tracking-wider">TIER 2</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Connecting Your Work Tools</h2>
            <p className="text-sm text-gray-400 mb-6">Each connection gives Claude access to real data and the ability to take real actions.</p>

            <div className="bg-surface/60 rounded-xl p-5 mb-6 border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-2">How Tools Connect to AI</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                AI assistants connect to your work tools in several ways. <strong className="text-gray-300">MCP servers</strong> (Model Context Protocol) are direct, real-time connections that let AI read and write data in apps like your calendar, email, or cloud storage. <strong className="text-gray-300">Plugins and extensions</strong> are pre-built integrations — often installed from a marketplace — that give AI access to specific services. <strong className="text-gray-300">API connections</strong> are custom-built links, typically set up by a developer or IT team, that connect AI to internal systems or databases. Each method varies in complexity, but the security principle is the same: every connection you add expands what AI can see and do. The more tools connected, the more powerful the AI becomes — and the more important it is to understand what you've granted access to.
              </p>
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
                  <p className="text-xs text-gray-500 mt-3 italic">These are common examples — there are hundreds of tool integrations available. The same risk principles apply to any tool you connect.</p>
                </div>
              </Expandable>

              <Expandable
                title="Decision Framework: Should I Connect This?"
                icon={<Info size={16} className="text-risk-moderate" />}
              >
                <div className="pt-3 space-y-4">
                  <div className="bg-surface/80 rounded-lg p-4 space-y-3">
                    <p className="text-sm text-gray-300 font-semibold">Ask yourself three questions:</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-accent font-mono text-sm font-bold">1.</span>
                        <p className="text-sm text-gray-400"><span className="text-gray-200 font-medium">Do I use this service daily with Claude?</span> If yes, connect it. If "maybe sometimes," don't.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-accent font-mono text-sm font-bold">2.</span>
                        <p className="text-sm text-gray-400"><span className="text-gray-200 font-medium">Does this service contain data about other people?</span> Client records, HR data, donor info, health information? If yes, think twice.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-accent font-mono text-sm font-bold">3.</span>
                        <p className="text-sm text-gray-400"><span className="text-gray-200 font-medium">Can Claude take irreversible actions?</span> Send emails, post messages, delete records? If yes, keep approval mode on — never "always allow."</p>
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
                  'For each connection, ask: "What\'s the worst thing Claude could do with this access?"',
                  'If a service has read-only mode available, start there',
                  'Never approve "send email" or "post message" actions without reviewing the content first',
                ]} />
                <div className="mt-4 space-y-1 text-xs text-gray-600 font-mono">
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
            <div className="flex items-center gap-3 mb-2">
              <RiskBadge level="high" />
              <span className="text-[10px] font-mono text-gray-500 tracking-wider">TIER 3</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Browser Integration</h2>
            <p className="text-sm text-gray-400 mb-6">Claude gets access to your live browser sessions — the same websites you're logged into, with the same credentials.</p>

            {/* Anthropic Warning */}
            <div className="bg-risk-high/5 border border-risk-high/20 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-risk-high mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono font-semibold text-risk-high tracking-wider mb-2">FROM ANTHROPIC'S OWN DOCUMENTATION</p>
                  <blockquote className="text-sm text-gray-300 italic leading-relaxed border-l-2 border-risk-high/40 pl-3">
                    "If Claude were ever manipulated through a prompt injection attack, this capability could potentially be used to read your credentials or take actions within your logged-in sessions. <span className="text-white font-semibold not-italic">These filters are NOT a security boundary.</span>"
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
                  <FeatureRow feature="Computer Use" description="Claude controls your mouse and keyboard" risk="critical" detail="Full control of your computer. Claude can navigate anywhere, type anything, click anything." />
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
                <div className="mt-4 space-y-1 text-xs text-gray-600 font-mono">
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
            <div className="flex items-center gap-3 mb-2">
              <RiskBadge level="critical" />
              <span className="text-[10px] font-mono text-gray-500 tracking-wider">TIER 4</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Remote & Autonomous Operation</h2>
            <p className="text-sm text-gray-400 mb-6">Claude operates with reduced oversight or from a remote device.</p>

            {/* Zero-click vulnerability callout */}
            <div className="bg-risk-critical/8 border border-risk-critical/25 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <ShieldAlert size={18} className="text-risk-critical mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono font-semibold text-risk-critical tracking-wider mb-2">KNOWN VULNERABILITY — CVSS 10/10</p>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    Someone sends you a Google Calendar invite. The event title looks normal — "Task Management" or "Q2 Planning." But hidden in the event description are instructions that Claude interprets as commands.
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    When you ask Claude to check your calendar, it reads the event, follows the hidden instructions, and uses your other connected services (email, files) to execute them. <span className="text-white font-semibold">You never see it happening.</span>
                  </p>
                  <p className="text-sm text-risk-critical font-medium">
                    This is not theoretical. Security researchers demonstrated it, and Anthropic declined to patch it.
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
                  <FeatureRow feature="Dispatch (mobile remote)" description="Control Claude Desktop from your phone" risk="critical" detail="Your phone becomes a remote control for everything Claude can access on your desktop. If your phone is compromised, your entire AI setup is compromised." />
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
                <div className="mt-4 space-y-1 text-xs text-gray-600 font-mono">
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
            <Lock size={18} className="text-accent" />
            <span className="text-[10px] font-mono text-accent tracking-[0.15em] font-semibold">UNDERSTANDING PERMISSIONS</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">The Permission Spectrum</h2>
          <p className="text-sm text-gray-400 mb-8">A simple way to think about what you're approving:</p>
          <PermissionSpectrum />
        </Section>

        {/* ── Warning Signs ────────────────────── */}
        <Section className="pb-20" id="warning-signs">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={18} className="text-risk-high" />
            <span className="text-[10px] font-mono text-risk-high tracking-[0.15em] font-semibold">QUICK REFERENCE</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">When Something Feels Wrong</h2>
          <p className="text-sm text-gray-400 mb-8">Trust your instincts. If Claude's behavior surprises you, pause and evaluate.</p>
          <WarningSignals />
        </Section>

        {/* ── For Organizations ─────────────────── */}
        <Section className="pb-20" id="organizations">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={18} className="text-accent" />
            <span className="text-[10px] font-mono text-accent tracking-[0.15em] font-semibold">FOR ORGANIZATIONS</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">Additional Considerations</h2>
          <p className="text-sm text-gray-400 mb-8">If you're recommending Claude to an organization — especially nonprofits handling sensitive data:</p>

          <div className="space-y-3">
            {[
              { num: '01', title: 'Start at Tier 1', desc: 'Let staff get comfortable with the CLI before adding integrations.' },
              { num: '02', title: 'Data classification matters', desc: 'If your org handles PHI, PII, or data about vulnerable populations, Tier 3 and 4 features should require explicit leadership approval.' },
              { num: '03', title: 'Browser integration is not ready for sensitive environments', desc: 'Anthropic\'s own documentation says so. Don\'t deploy it on machines with access to case management, EHR, or donor databases.' },
              { num: '04', title: 'Create an AI Acceptable Use Policy first', desc: 'Staff need clear guidance on what they can and can\'t do before you hand them powerful tools.' },
              { num: '05', title: 'Audit MCP connections quarterly', desc: 'Services get added and forgotten. Each forgotten connection is an unmonitored access point.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 bg-surface/40 border border-gray-800/50 rounded-lg p-4"
              >
                <span className="font-mono text-accent text-sm font-bold flex-shrink-0">{item.num}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-200">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Recommended Setup ────────────────── */}
        <Section className="pb-20" id="recommended-setup">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={18} className="text-accent" />
            <span className="text-[10px] font-mono text-accent tracking-[0.15em] font-semibold">RECOMMENDED CONFIGURATION</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">Security-Conscious Professional Setup</h2>
          <p className="text-sm text-gray-400 mb-8">Balancing productivity with appropriate risk management:</p>
          <div className="bg-surface/60 border border-gray-800 rounded-xl p-5">
            <RecommendedSetup />
          </div>
        </Section>

        {/* ── Footer ───────────────────────────── */}
        <footer className="border-t border-gray-800/50 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield size={16} className="text-accent" />
            <span className="font-mono text-xs text-gray-500 tracking-wider">PERSONAL AI SECURITY GUIDE</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">
            Created by <span className="text-gray-400">Joshua Peskay</span>, CISSP | CISM
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <a href="https://mtm.now" className="text-accent/70 hover:text-accent transition-colors">Meet the Moment</a> — mtm.now
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-700 font-mono">
            <span>v1.0</span>
            <span>•</span>
            <span>Last reviewed: March 25, 2026</span>
            <span>•</span>
            <span>Next review: June 25, 2026</span>
          </div>
          <p className="text-[10px] text-gray-700 mt-4 italic">
            This guide was created with AI assistance and reviewed by a CISSP-certified security professional.
          </p>
        </footer>
      </div>
    </div>
  )
}
