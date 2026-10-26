// Marketplace picks: a recurring, vendor-neutral feature on ready-made bots and templates small business owners can use.
// Rules: every pick links its official listing (checked to resolve when the edition is published); picks are judged only on
// usefulness to owners; no vendor is favored (including any AI tools used by the people behind this site).
// Within an edition, picks are listed alphabetically by marketplace name, not ranked.
// price: null, or { value, basis: 'list-price', url } = exactly what the official page states. Never an estimate.
// Newest edition first. `date` = YYYY-MM-DD (America/Chicago).
export const editions = [
{
  number: 1,
  date: "2026-10-26",
  theme: "Answering customers and drafting replies",
  intro: "Six ready-made bots and templates that answer customer questions, draft replies for you to approve, or turn an idea into a finished post.",
  picks: [
    {
      id: "canva-in-chatgpt",
      name: "Canva app in ChatGPT",
      marketplace: "ChatGPT apps",
      platformMaker: "OpenAI",
      maker: "Canva",
      url: "https://chatgpt.com/apps/canva/",
      does: "Connect your Canva account inside ChatGPT, then ask in plain words for a social post, flyer or slide deck. You preview and edit the design in the chat, then open it in Canva to finish or share it.",
      goodFor: "Weekly sale posts, event flyers and menu or price-list graphics when you have no designer.",
      watch: "You need a ChatGPT login and a Canva account. Check every price, date and claim in the design before you post it.",
      price: null,
    },
    {
      id: "grok-bot-outbound-prospecting",
      name: "Outbound Prospecting template",
      marketplace: "Grok Bot Marketplace",
      platformMaker: "xAI",
      maker: "Krista Letz (Grok Bot team)",
      url: "https://x.ai/bot/marketplace",
      does: "Finds prospects that match the kind of customer you describe, then drafts a first message to each one. The listing says every name is researched on the public web and nothing sends without your yes.",
      goodFor: "Businesses that sell to other businesses, like caterers, cleaners and trades looking for commercial accounts.",
      watch: "Read each draft before it goes out, and follow the cold-email and messaging rules where you operate.",
      price: null,
    },
    {
      id: "make-google-review-replies",
      name: "Respond to Google Business Profile reviews using OpenAI",
      marketplace: "Make templates",
      platformMaker: "Make",
      maker: "Make",
      url: "https://www.make.com/en/templates/15259-respond-to-google-my-business-reviews-using-openai-gpt-3-completions",
      does: "Watches your Google Business Profile and uses ChatGPT (OpenAI) to write a personal reply to each new review.",
      goodFor: "Restaurants, salons and trades that get more Google reviews than they have time to answer.",
      watch: "The template is built to post replies. Add a step where you approve each reply first, especially for 1- and 2-star reviews. You need Make and OpenAI accounts.",
      price: null,
    },
    {
      id: "copilot-studio-website-qa",
      name: "Website Q&A agent template",
      marketplace: "Microsoft Copilot Studio templates",
      platformMaker: "Microsoft",
      maker: "Microsoft",
      url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/template-website-q-and-a",
      does: "Starts an agent that answers questions using the content on your website. You point it at your site's address, test its answers, then publish it.",
      goodFor: "A quick helper for staff who keep asking about hours, services and policies.",
      watch: "Microsoft says agent templates are English-only for now and should be limited to internal use within your organization, so treat it as a staff helper, not a customer-facing bot. You need access to Copilot Studio.",
      price: null,
    },
    {
      id: "shopify-inbox",
      name: "Shopify Inbox",
      marketplace: "Shopify App Store",
      platformMaker: "Shopify",
      maker: "Shopify",
      url: "https://apps.shopify.com/inbox",
      moreUrl: "https://help.shopify.com/en/manual/inbox/assigning-your-ai-staff-member",
      does: "Chat for your Shopify store. Its optional AI agent answers shopper questions from your catalog, policies and pages, suggests products, adds them to the cart and helps with order lookups. Staff also get AI-suggested replies to edit and send.",
      goodFor: "Online shops that get the same product, shipping and returns questions every day.",
      watch: "Shopify's help center says the AI agent needs the Basic, Grow, Advanced or Shopify Plus plan and new customer accounts. Suggested replies are English-only. You can run Inbox with or without the agent.",
      price: { value: "Free", basis: "list-price", url: "https://apps.shopify.com/inbox" },
    },
    {
      id: "zapier-form-reply-drafts",
      name: "Create Gmail drafts with ChatGPT-generated replies for new Google Forms submissions",
      marketplace: "Zapier templates",
      platformMaker: "Zapier",
      maker: "Zapier",
      url: "https://zapier.com/apps/gmail/integrations/google-forms/255722884/create-gmail-drafts-with-chatgpt-generated-replies-for-new-google-forms-submissions",
      does: "When someone fills in your Google Form, such as a quote or booking request, ChatGPT drafts a tailored reply and saves it in Gmail as a draft. You review it and hit send.",
      goodFor: "Any business with a contact or quote form that wants faster replies without letting AI send on its own.",
      watch: "You connect Google Forms, ChatGPT (OpenAI) and Gmail inside Zapier. Read each draft before sending.",
      price: { value: "Zapier: \"Free forever for core features\" and a 14-day trial for premium features and apps (as stated on the template page)", basis: "list-price", url: "https://zapier.com/apps/gmail/integrations/google-forms/255722884/create-gmail-drafts-with-chatgpt-generated-replies-for-new-google-forms-submissions" },
    },
  ],
},
];
export const latestEdition = editions[0];
export const fmtDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
