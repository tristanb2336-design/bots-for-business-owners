// Plain-English glossary of AI terms small business owners run into, for /glossary/.
// Definitions are general and vendor-neutral. Example links are found by matching each term against the
// text of the entries on this site (job, tools, story), so counts only say how many entries mention it.
import { useCases } from './usecases.mjs';

export const TERMS = [
  { key: 'ai-agent', term: 'AI agent', also: ['agentic AI', 'AI bot'],
    def: 'Software that uses an AI model to carry out a task for you, not just answer a question: it can take steps such as reading your files, filling in a form, booking a slot or drafting a reply, usually within limits you set. On this site, "AI agent" covers phone and chat agents, assistants that work inside your business software, and tools owners build for themselves.',
    links: [['/jobs/', 'Use cases by job']], match: /\bagents?\b/i },
  { key: 'ai-assistant', term: 'General AI assistant', also: ['chatbot', 'AI chat app'],
    def: 'A general-purpose AI you talk to in plain language, such as ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google) or Microsoft Copilot. Owners use them to draft emails and posts, sort spreadsheets, price jobs and answer questions. They only act inside your other apps if you connect them.',
    links: [['/compare/', 'Compare AI assistants'], ['/tools/', 'Use cases by AI tool']], match: /ChatGPT|\bClaude\b|Gemini|Copilot/ },
  { key: 'ai-phone-agent', term: 'AI phone agent', also: ['AI receptionist', 'voice agent', 'virtual agent'],
    def: 'An AI that answers your business phone in a spoken voice, so calls are answered when nobody can pick up. Depending on the setup it can take orders or messages, answer common questions, book jobs into your calendar or scheduling software, and pass urgent calls to a person. It should say it is an AI when asked and let callers reach a human.',
    links: [['/tools/phone-agents/', 'AI phone agents and receptionists'], ['/jobs/', 'Use cases by job']], match: /phone agent|receptionist|voice agent|virtual agent|answers? (every|the|its) (phone|call)/i },
  { key: 'ai-chat-agent', term: 'AI chat agent', also: ['website chatbot', 'messaging agent', 'leasing agent'],
    def: 'An AI that replies to written messages: website chat, text, WhatsApp, Instagram or Facebook Messenger, guest messages or rental enquiries. It answers routine questions from information you give it and hands anything it cannot handle to a person.',
    links: [['/tools/chat-messaging-agents/', 'AI chat, leasing and guest-messaging agents']], match: /chatbot|chat agent|AI chat|guest messag|Meta Business Agent|leasing agent|chat assistant/i },
  { key: 'custom-gpt', term: 'Custom GPT, Gem or Project', also: ['saved assistant', 'custom instructions'],
    def: 'A saved version of a general assistant that already knows your business: you give it standing instructions, your tone of voice and reference files (menu, price list, policies) once, and reuse it instead of re-explaining every time. ChatGPT calls these GPTs and Projects, Gemini calls them Gems, and Claude calls them Projects.',
    links: [['/tools/chatgpt/', 'ChatGPT use cases'], ['/tools/gemini/', 'Gemini use cases']], match: /Custom GPT|\bGPTs?\b(?![-‑])|\bGems?\b|Projects? in Claude|Claude Projects?/ },
  { key: 'ai-coding-agent', term: 'AI coding agent', also: ['vibe coding', 'Claude Code', 'build your own tool'],
    def: 'An AI that writes and runs small programs from plain-English requests, so an owner without coding experience can build a simple dashboard, calculator or internal tool. The results still need checking, and you should be careful what customer or business data you give it.',
    links: [['/tools/claude/', 'Claude use cases']], match: /coding agent|Claude Code|vibe cod|Antigravity|Codex|built (his|her|their) own/i },
  { key: 'mcp', term: 'MCP (Model Context Protocol)', also: ['MCP server', 'MCP connector'],
    def: 'An open standard that lets an AI assistant connect to another app or data source (for example a point-of-sale system, accounting software or a directory like this one) so it can look things up or take actions there. The app decides what the AI is allowed to see and do. This site has its own read-only MCP server at /mcp/.',
    links: [['/about/', 'About this site (MCP server)']], match: /\bMCP\b|Model Context Protocol/ },
  { key: 'connector', term: 'Connector or integration', also: ['app connection', 'plug-in'],
    def: 'A link between an AI tool and software you already use (email, calendar, POS, accounting, booking, property management), so the AI can read or update it directly instead of you copying information back and forth. Most connectors ask you to sign in and approve what they can access.',
    links: [['/tools/', 'Use cases by AI tool']], match: /connector|integrat|connected to|connects to/i },
  { key: 'prompt', term: 'Prompt', also: ['instructions'],
    def: 'What you type or say to an AI to tell it what you want. Clear prompts name the task, give the facts it should use (prices, dates, your hours), describe the tone, and say what to do when it is unsure. Many entries on this site end with simple steps you can turn into a prompt.',
    links: [['/', 'All use cases']], match: /\bprompt/i },
  { key: 'hallucination', term: 'Hallucination', also: ['AI mistakes', 'made-up answers'],
    def: 'When an AI states something false with confidence, such as an invented price, policy, date or fact. It is the main reason to check AI output before it reaches customers, keep humans able to step in, and limit an agent to information you have given it.',
    links: [['/about/', 'How this site checks sources']], match: /hallucinat|got (it|things|something) wrong|gets? (basic )?(facts|things) wrong|never invent|confidently wrong/i },
  { key: 'human-in-the-loop', term: 'Human in the loop', also: ['approval step', 'review before sending'],
    def: 'A setup where the AI drafts or proposes and a person approves before anything is sent, posted, booked, paid or changed. Owners often start this way and only let the AI act on its own for simple, low-risk tasks once they trust it.',
    links: [['/human-in-the-loop/', 'What owners still approve, quoted from entries'], ['/jobs/', 'Use cases by job']], match: /approv|confirm|review(s|ed)? (it|the|each|every)|before (it|anything) (posts|sends|goes)/i },
  { key: 'llm', term: 'Large language model (LLM)', also: ['AI model', 'foundation model'],
    def: 'The underlying AI system trained on large amounts of text that powers chat assistants and agents. Products such as ChatGPT, Claude, Gemini and Copilot are built on these models; many phone, chat and business-software agents license one from a model maker.',
    links: [['/compare/', 'Compare AI assistants']], match: /language model|\bLLM\b|Gemini \d|GPT-\d/i },
  { key: 'usage-based-pricing', term: 'Seat, usage and per-unit pricing', also: ['per-call pricing', 'tokens', 'credits'],
    def: 'The common ways AI tools charge: a monthly fee per user (seat), a fee per call, message or minute (usage), a fee per location or rental unit, or a pool of credits or tokens. Check what counts toward the limit and what overage costs before you sign up.',
    links: [['/costs/', 'Costs and setup time']], match: /per (extra )?(call|unit|seat|user|minute|location|month per location)|\/unit|per-call|tokens|credits/i, field: 'cost' },
];

const text = (u, field) => field === 'cost' ? [u.cost?.value, u.cost?.note].join(' ') : [u.title, u.job, u.story, u.tools.join(' ')].join(' ');
export function glossary(){
  return TERMS.map(t => {
    const list = t.match ? useCases.filter(u => t.match.test(text(u, t.field))).sort((a, b) => b.added.localeCompare(a.added) || a.slug.localeCompare(b.slug)) : [];
    return { ...t, list };
  });
}
export const GLOSSARY_EXAMPLES = 4;
