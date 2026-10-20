// Groups use cases by the AI tool (and its maker) named in each entry's `tools` list.
// A use case can appear under more than one tool. Order is alphabetical by group name; no vendor is favored.
import { useCases } from './usecases.mjs';

export const TOOL_GROUPS = [
  { key: 'phone-agents', name: 'AI phone agents and receptionists', maker: 'Various startups and field-service software makers',
    blurb: 'Answer calls, take orders or messages and book jobs when nobody can get to the phone.',
    match: /phone|receptionist|voice agent|virtual agent|ServiceTitan AI|AI Employee|Goodcall/i },
  { key: 'chat-messaging-agents', name: 'AI chat, leasing and guest-messaging agents', maker: 'Various startups',
    blurb: 'Reply to website chats, rental enquiries and guest messages, qualify leads and book viewings.',
    match: /EliseAI|Lightwork|Frontline|YepAI|Enso Connect|chat assistant/i },
  { key: 'chatgpt', name: 'ChatGPT', maker: 'OpenAI', blurb: 'General-purpose AI assistant used for drafting, research, pricing and back-office work.', match: /ChatGPT|Custom GPTs/ },
  { key: 'claude', name: 'Claude', maker: 'Anthropic', blurb: 'General-purpose AI assistant, also used by owners to build their own simple tools.', match: /\bClaude\b/ },
  { key: 'gemini', name: 'Gemini', maker: 'Google', blurb: 'AI assistant on its own and inside Google Workspace (Gmail, Docs, Sheets).', match: /Gemini/ },
  { key: 'meta-business-agent', name: 'Meta Business Agent on WhatsApp', maker: 'Meta', blurb: 'Answers customer chats and quotes on WhatsApp.', match: /Meta Business Agent/ },
  { key: 'copilot', name: 'Microsoft Copilot', maker: 'Microsoft', blurb: 'AI assistant inside Microsoft 365 and on its own.', match: /Copilot/ },
  { key: 'shopify-sidekick', name: 'Shopify Sidekick', maker: 'Shopify', blurb: 'AI assistant built into the Shopify admin.', match: /Shopify Sidekick/ },
  { key: 'square-ai', name: 'Square AI', maker: 'Square', blurb: 'AI assistant built into the Square point-of-sale dashboard.', match: /Square AI/ },
];

export function groupByTool() {
  const groups = TOOL_GROUPS.map(g => ({ ...g, list: useCases.filter(u => u.tools.some(t => g.match.test(t))) }))
    .filter(g => g.list.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
  const matched = new Set(groups.flatMap(g => g.list.map(u => u.slug)));
  const other = useCases.filter(u => !matched.has(u.slug));
  if (other.length) groups.push({ key: 'other', name: 'Other AI agents and custom setups', maker: 'Various', blurb: 'Setups that combine several tools or don\'t fit one product.', list: other });
  return groups;
}
