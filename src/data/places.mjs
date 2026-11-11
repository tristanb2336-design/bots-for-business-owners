// Groups use cases by the country where the business is, for /places/ hub pages.
// Only entries whose location is stated in the entry itself (business line) are mapped here; nothing is guessed.
// Entries without a stated location are simply not listed on a country page.
import { useCases } from './usecases.mjs';

export const COUNTRIES = {
  'united-states': { name: 'United States', short: 'the US' },
  'united-kingdom': { name: 'United Kingdom', short: 'the UK' },
  'canada': { name: 'Canada', short: 'Canada' },
  'ireland': { name: 'Ireland', short: 'Ireland' },
  'germany': { name: 'Germany', short: 'Germany' },
  'spain': { name: 'Spain', short: 'Spain' },
  'netherlands': { name: 'Netherlands', short: 'the Netherlands' },
  'brazil': { name: 'Brazil', short: 'Brazil' },
  'uruguay': { name: 'Uruguay', short: 'Uruguay' },
  'mexico': { name: 'Mexico', short: 'Mexico' },
  'japan': { name: 'Japan', short: 'Japan' },
  'indonesia': { name: 'Indonesia', short: 'Indonesia' },
  'france': { name: 'France', short: 'France' },
};

// slug -> [country key, place as stated in the entry]
export const PLACES = {
  'boba-shop-chatgpt-canva-posters-menus-fruitea-boba-haus': ['canada', 'London, Ontario'],
  'bookstore-ai-built-staff-dashboard-special-orders-naughty-dog-books': ['united-states', 'Brown County, Indiana'],
  'hair-salon-ai-photo-stock-take-call-answering-fergal-doyle-hair': ['united-kingdom', 'Bristol, England'],
  'landscaper-claude-estimates-labor-underpricing-qa-landscaping': ['united-states', 'Pittsburgh, Pennsylvania'],
  'bakery-chatgpt-invoicing-forecasting-allergens-bakery-de-stefano': ['spain', 'Las Palmas de Gran Canaria'],
  'quick-service-restaurants-chatgpt-paperwork-pricing': ['united-states', 'New Mexico'],
  'texas-food-business-team-of-ai-agents-blended-salsa': ['united-states', 'Texas'],
  'plumbing-company-ai-virtual-agent-superior-plumbing': ['united-states', 'Atlanta area, Georgia'],
  'hvac-company-ai-voice-agent-bill-joplins': ['united-states', 'Dallas-Fort Worth, Texas'],
  'mobile-truck-repair-ai-receptionist-rite-wrench': ['united-states', 'Fort Lauderdale, Florida'],
  'landlords-24-units-baselane-asana-chatgpt': ['united-states', 'Buffalo, New York'],
  'home-kitchen-thai-restaurant-chatgpt-bangkok-rush': ['united-states', 'Alameda, California'],
  'contractor-chatgpt-seo-invoice-filing-beach-cities-builder': ['united-states', 'Hermosa Beach, California'],
  'family-plumber-ai-receptionist-messages-frankies-plumbing': ['united-states', 'San Diego, California'],
  'salon-ai-receptionist-missed-calls-locd-and-braided': ['united-states', 'Brooklyn, New York'],
  'family-coffee-shop-gemini-sales-forecast-newsletter-henrys-house-of-coffee': ['united-states', 'San Francisco, California'],
  'brunch-restaurant-microsoft-copilot-catering-orders-brunchaholics': ['united-states', 'DeSoto, Texas'],
  'junk-removal-ai-phone-assistant-yelp-leads-bye-junk': ['united-states', 'Pittsburgh, Pennsylvania'],
  'hvac-plumbing-ai-after-hours-agent-air-one': ['united-states', 'Colton, California'],
  'salon-abandoned-booking-recovery-claude-hottie-hair': ['united-states', 'Las Vegas, Nevada'],
  'deli-grocer-gemini-catering-recipe-scaling-edys-grocer': ['united-states', 'Greenpoint, Brooklyn, New York'],
  'lawn-care-chatgpt-pricing-and-customer-texts-shades-of-green': ['united-states', 'Lafayette, Indiana'],
  'vegan-cheese-maker-claude-manus-shipping-invoice-audit-rebel-cheese': ['united-states', 'Austin, Texas'],
  'florist-chatgpt-product-descriptions-handbook-simply-beautiful': ['united-states', 'Gilmer, Texas'],
  'dog-salon-ai-receptionist-google-calendar-paws-48': ['united-states', 'Phoenix, Arizona'],
  'spice-shop-gemini-inquiries-flyers-event-concepts-spice-suite': ['united-states', 'Washington, D.C.'],
  'coffee-roaster-microsoft-copilot-admin-social-shipping-321-coffee': ['united-states', 'Raleigh, North Carolina'],
  'six-cafe-coffee-roaster-claude-weekly-brief-mothership-coffee': ['united-states', 'Las Vegas, Nevada'],
  'cake-studio-claude-code-order-system-bakery-buddy-marin-cake-studio': ['united-states', 'San Rafael, California'],
  'construction-contractor-microsoft-copilot-invoice-coding-agent-perry-contracting': ['united-states', 'Norwood, Ohio'],
  'landlord-ai-voice-leasing-agent-virtual-staging-jennifer-beadles': ['united-states', 'Several US states, including Washington and Idaho'],
  'salon-ai-receptionist-after-hours-booking-meevo-salon-sora': ['united-states', 'Boca Raton, Florida'],
  'florist-gemini-sales-analysis-marketing-spedales': ['united-states', 'South Louisiana'],
  'tile-grout-ai-scheduling-assistant-books-estimates-grout-medic': ['united-states', 'Naperville, Illinois area'],
  'restaurant-ai-host-replaces-only-server-wok-karahi': ['united-states', 'Spring, Texas'],
  'shoe-store-cross-checks-ai-assistants-accounting-inventory-springfield-running-center': ['united-states', 'Springfield, Illinois'],
  'print-shop-builds-pantone-to-thread-color-tool-with-claude-smplfd': ['united-states', 'Detroit, Michigan'],
  'family-social-club-chatgpt-work-grants-liquor-license-the-den': ['united-states', 'Denver, Colorado'],
  'bbq-restaurant-owner-builds-kitchen-operations-app-with-claude-zavalas-barbecue': ['united-states', 'Grand Prairie, Texas'],
  'vietnamese-restaurant-owner-uses-gemini-for-emails-reviews-and-contracts-saigon-sisters': ['united-states', 'Chicago, Illinois'],
  'cafe-custom-gpt-inventory-photo-to-shopping-list-coffee-and-kindness': ['united-states', 'Nashua, New Hampshire'],
  'pizzeria-ai-phone-agent-friday-rush-upsells-dechecos': ['united-states', 'Northeast Ohio'],
  'soap-maker-runs-ai-c-suite-of-claude-projects-mainland-vintage': ['united-states', 'Brooklyn, New York'],
  'restaurant-owner-builds-claude-plate-costing-model-moznerova': ['united-states', 'Brooklyn, New York'],
  'charcuterie-shop-chatgpt-drafts-customer-email-replies-bohemian-picnics': ['united-states', 'New York City'],
  'family-gift-shops-square-ai-forecasts-handmade-candle-batches-comfortably-chic': ['united-states', 'Chester, New Jersey'],
  'hardware-store-chatgpt-plus-supplier-emails-hennessey': ['united-states', 'Cedar Falls, Iowa'],
  'plumbing-company-housecall-pro-ai-voice-quotes-good-guy': ['united-states', 'Torrance, California'],
  'coffee-group-custom-gpts-equipment-hr-recipes-brewpoint': ['united-states', 'Chicago area, Illinois'],
  'cupcake-bakery-claude-order-labels-candys-cupcakes': ['united-kingdom', 'Ashton-under-Lyne, England'],
  'lettings-agency-ai-assistant-qualifies-rental-enquiries-wright-letting': ['united-kingdom', 'Cheshire, England'],
  'plumber-ai-receptionist-emergency-triage-nicholls': ['united-kingdom', 'Stockport, England'],
  'landscaping-ai-voice-receptionist-quote-calculator-taylor-landscaping': ['united-kingdom', 'Newark, Nottinghamshire, England'],
  'landlord-ai-voice-agent-tenant-repair-calls-macosie-properties': ['united-kingdom', 'South Wales'],
  'family-hardware-store-ai-chat-assistant-lenehans': ['ireland', 'Dublin'],
  'afro-hair-salon-gemini-gem-social-media-strategy-hba-studio': ['ireland', 'Dublin'],
  'cleaning-company-ai-receptionist-email-triage-echo-janitorial': ['canada', 'Abbotsford, British Columbia'],
  'craft-brewery-gemini-built-operating-system-red-barn-brewing': ['canada', 'Ontario'],
  'watch-retailer-uses-chatgpt-and-claude-to-rebuild-brand-and-open-store-medium': ['canada', 'Calgary, Alberta'],
  'lawn-care-owner-jobber-ai-receptionist-catches-missed-calls-perfect-pass': ['canada', 'Winnipeg, Manitoba'],
  'vacation-rental-manager-ai-guest-messages-homely-stay': ['germany', 'Germany'],
  'market-food-truck-ai-agent-back-office-holy-fish': ['germany', 'Berlin'],
  'cave-holiday-rental-chatgpt-agent-bookings-press-leonards-lookout': ['spain', 'Rural Spain'],
  'fashion-boutique-shopify-sidekick-returns-workflow-olivia-kate': ['netherlands', 'Haarlem'],
  'upholstery-cleaning-whatsapp-ai-quotes-maribel-clean': ['brazil', 'Brasília'],
  'makeup-studio-whatsapp-ai-booking-deposits-consi-studio': ['uruguay', 'Montevideo'],
  'jewelry-maker-whatsapp-ai-customer-service-piedra-nomada': ['mexico', 'Playa del Carmen'],
  'farm-chatgpt-codex-greenhouse-bot-crop-disease-wfp-dacho-farm': ['japan', 'Hokkaido'],
  'cracker-maker-microsoft-copilot-designer-packaging-takoma': ['indonesia', 'Ternate'],
  'catering-venue-chatgpt-claude-checklists-recipe-scaling-arlingtons': ['united-states', 'Springfield, Illinois'],
  'gift-shop-in-store-ai-assistant-millie-cotton-company': ['united-states', 'Wake Forest, North Carolina'],
  'commercial-electrician-ai-receptionist-job-briefs-hughes': ['united-kingdom', 'Erdington, Birmingham, England'],
  'jewelry-store-chatgpt-social-captions-ads-radiant': ['united-states', 'Plymouth, Michigan'],
  'kids-clothing-brand-shopify-gemini-klaviyo-inventory-guava-jammies': ['united-states', 'Hawaiʻi'],
  'brunch-bakery-yelp-host-ai-phone-waitlist-buttermilk-ranch': ['united-states', 'Nashville, Tennessee'],
  'creperie-toast-ai-online-menu-stock-la-maracucha': ['united-states', 'Gainesville, Florida'],
  'salon-canva-glossgenius-captions-booking-marisol': ['united-states', 'Cedar Falls, Iowa'],
  'caribbean-sushi-chatgpt-marketing-emails-tropirollz': ['united-states', 'Miami, Florida'],
  'engraving-shop-microsoft-copilot-grants-listings-let-it-be-company': ['united-states', 'Farmersville, Texas'],
  'ceramics-studio-gemini-product-descriptions-newsletters-bleu-clementine': ['france', 'Bordeaux, France'],
  'owner-operator-hvac-ai-receptionist-riley-ridgeline': ['united-states', 'Idaho'],
};

export function placeOf(u){ const p = PLACES[u.slug]; return p ? { key: p[0], country: COUNTRIES[p[0]].name, place: p[1] } : null; }

// Countries with at least one entry; most entries first, ties alphabetical.
export function groupByCountry(){
  return Object.entries(COUNTRIES).map(([key, c]) => ({ key, ...c, list: useCases.filter(u => PLACES[u.slug]?.[0] === key) }))
    .filter(g => g.list.length > 0)
    .sort((a, b) => b.list.length - a.list.length || a.name.localeCompare(b.name));
}

// Countries with at least this many entries get their own /places/<country>/ page; the rest are listed on /places/.
export const PAGE_MIN = 2;
