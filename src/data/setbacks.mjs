// "What went wrong": sentences, quoted verbatim from each entry's own story and results, that describe a problem,
// limit or failure the business ran into with AI. Shared by /what-went-wrong/ and /what-went-wrong.md.
// Nothing is written or summarized here: every line shown is copied from the entry, which cites its public source.
import { useCases } from './usecases.mjs';

const BAD = /(didn'?t work|did not work|went wrong|downside|trade-off|rough edges|backlash|criticis|push(ed)? back|pushback|bugs?\b|guardrail failure|got stuck|unable to reach|couldn'?t (keep|get|reach|handle|tell)|can'?t get|failed|looked like oats|was off\b|got (names|addresses|things|it) wrong|sometimes got|mishandled|too robotic|sounded (too )?robotic|unreliable|still being tuned|stopped shopping|cost (them|him|her) customers|hallucinat|negative (reviews|feedback)|reactions were mixed|mixed reactions|made (things|it) up|invented)/i;
// The sentence must be about the AI itself, not a problem the business had before it.
const AI = /\b(AI|agent|assistant|bot|chatbot|ChatGPT|Claude|Gemini|Copilot|Sidekick|Muse|automated system|tools?|it)\b/i;
// These phrases are about the AI setup even when the sentence doesn't name the tool.
const STRONG = /reactions were mixed|mixed reactions|guardrail failure|rough edges/i;
const NOT = /^Note:|recipes didn'?t work|not independent|vendor-published|case study|freelancer/i;

function sentences(text) {
  return String(text || '').replace(/\s+/g, ' ').match(/[^.!?]+(?:[.!?]+["'”)]*|$)/g)?.map(s => s.trim()).filter(Boolean) || [];
}

export function setbackRows() {
  return useCases.map(u => {
    const seen = new Set();
    const lines = [u.story, ...(u.results || [])].flatMap(sentences)
      .filter(s => BAD.test(s) && (AI.test(s) || STRONG.test(s)) && !NOT.test(s) && s.length > 25)
      .filter(s => (seen.has(s) ? false : seen.add(s)));
    return { u, lines };
  }).filter(r => r.lines.length)
    .sort((a, b) => (b.u.added).localeCompare(a.u.added) || a.u.slug.localeCompare(b.u.slug));
}
