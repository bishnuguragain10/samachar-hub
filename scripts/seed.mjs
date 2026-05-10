import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

// ─── Categories ─────────────────────────────────────────────────────────────
const categories = [
  {
    name: "Politics",
    nameNe: "राजनीति",
    slug: "politics",
    color: "#dc2626",
    description: "Latest political news from Nepal",
    sortOrder: 1,
  },
  {
    name: "Business",
    nameNe: "व्यापार",
    slug: "business",
    color: "#2563eb",
    description: "Business and economy news",
    sortOrder: 2,
  },
  {
    name: "Technology",
    nameNe: "प्रविधि",
    slug: "technology",
    color: "#7c3aed",
    description: "Tech news and innovation",
    sortOrder: 3,
  },
  {
    name: "Sports",
    nameNe: "खेलकुद",
    slug: "sports",
    color: "#16a34a",
    description: "Sports news and updates",
    sortOrder: 4,
  },
  {
    name: "Entertainment",
    nameNe: "मनोरञ्जन",
    slug: "entertainment",
    color: "#d97706",
    description: "Entertainment and culture",
    sortOrder: 5,
  },
  {
    name: "International",
    nameNe: "अन्तर्राष्ट्रिय",
    slug: "international",
    color: "#0891b2",
    description: "World news",
    sortOrder: 6,
  },
  {
    name: "Nepal",
    nameNe: "नेपाल",
    slug: "nepal",
    color: "#be185d",
    description: "Local Nepal news",
    sortOrder: 7,
  },
  {
    name: "Opinion",
    nameNe: "विचार",
    slug: "opinion",
    color: "#78716c",
    description: "Opinions and editorials",
    sortOrder: 8,
  },
];

console.log("Seeding categories...");
for (const cat of categories) {
  await connection.execute(
    `INSERT IGNORE INTO categories (name, nameNe, slug, color, description, sortOrder, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [
      cat.name,
      cat.nameNe ?? null,
      cat.slug,
      cat.color ?? null,
      cat.description ?? null,
      cat.sortOrder ?? null,
    ]
  );
}

// Get category IDs
const [catRows] = await connection.execute("SELECT id, slug FROM categories");
const catMap = {};
for (const row of catRows) catMap[row.slug] = row.id;

// ─── Articles ────────────────────────────────────────────────────────────────
const articles = [
  {
    title: "Nepal Government Announces Major Infrastructure Development Plan",
    titleNe: "नेपाल सरकारले ठूलो पूर्वाधार विकास योजना घोषणा गर्यो",
    slug: "nepal-government-infrastructure-plan-2024",
    excerpt:
      "The government has unveiled a comprehensive five-year infrastructure development plan worth NPR 500 billion, focusing on roads, bridges, and hydropower.",
    excerptNe:
      "सरकारले सडक, पुल र जलविद्युतमा केन्द्रित ५०० अर्ब रुपैयाँ मूल्यको व्यापक पाँच वर्षीय पूर्वाधार विकास योजना सार्वजनिक गरेको छ।",
    content: `<p>The Nepali government has announced an ambitious infrastructure development plan that aims to transform the country's connectivity and energy sector over the next five years.</p>
<h2>Key Highlights</h2>
<p>The plan, valued at NPR 500 billion, focuses on three major areas: road construction, bridge development, and hydropower expansion. Prime Minister stated that this initiative will create over 200,000 jobs and significantly boost GDP growth.</p>
<h2>Road Network Expansion</h2>
<p>A total of 5,000 kilometers of new roads will be constructed across all seven provinces, with special emphasis on connecting remote hill districts to the national highway network. This will reduce travel time between major cities by up to 40%.</p>
<h2>Hydropower Development</h2>
<p>Nepal aims to add 5,000 MW of hydropower capacity by 2030, with 15 new projects already in the pipeline. The government has also announced special incentives for private sector investment in the energy sector.</p>
<blockquote>This is the most ambitious infrastructure plan in Nepal's history. We are committed to transforming our nation's connectivity and energy landscape. — Prime Minister</blockquote>
<p>International development partners including the World Bank, Asian Development Bank, and bilateral donors have pledged support for the initiative.</p>`,
    contentNe: `<p>नेपाल सरकारले अर्को पाँच वर्षमा देशको सम्पर्क र ऊर्जा क्षेत्रलाई रूपान्तरण गर्ने लक्ष्यसहित महत्त्वाकांक्षी पूर्वाधार विकास योजना घोषणा गरेको छ।</p>
<h2>मुख्य बुँदाहरू</h2>
<p>५०० अर्ब रुपैयाँ मूल्यको यो योजनाले तीन प्रमुख क्षेत्रमा ध्यान केन्द्रित गर्दछ: सडक निर्माण, पुल विकास र जलविद्युत विस्तार।</p>`,
    categorySlug: "politics",
    isBreaking: true,
    isFeatured: true,
    isSponsored: false,
    status: "published",
    tags: "nepal,infrastructure,government,development",
    aiSummary:
      "Nepal's government unveiled a NPR 500 billion five-year infrastructure plan focusing on 5,000 km of new roads, bridge construction, and adding 5,000 MW of hydropower capacity by 2030, expected to create 200,000 jobs.",
    viewCount: 4521,
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    title: "Nepal Stock Exchange Hits Record High Amid Economic Recovery",
    titleNe: "आर्थिक पुनरुत्थानबीच नेपाल स्टक एक्सचेन्ज रेकर्ड उचाइमा",
    slug: "nepal-stock-exchange-record-high-2024",
    excerpt:
      "NEPSE index surged to an all-time high of 2,850 points, driven by strong performance in banking and hydropower sectors.",
    excerptNe:
      "बैंकिङ र जलविद्युत क्षेत्रको बलियो प्रदर्शनले नेप्से सूचकांक सर्वकालीन उच्च २,८५० बिन्दुमा पुग्यो।",
    content: `<p>The Nepal Stock Exchange (NEPSE) reached a historic milestone today as the index surged to 2,850 points, marking an all-time high driven by strong investor confidence and positive economic indicators.</p>
<h2>Market Performance</h2>
<p>Banking stocks led the rally with a 12% average gain over the past month, followed by hydropower companies which saw a 15% increase. The total market capitalization now stands at NPR 3.2 trillion.</p>
<h2>Economic Indicators</h2>
<p>Nepal's GDP growth is projected at 5.8% for the current fiscal year, supported by strong remittance inflows, tourism recovery, and agricultural output. Inflation has also eased to 6.2% from a peak of 8.5% last year.</p>
<p>Foreign institutional investors have increased their holdings in Nepali equities by 23% year-over-year, signaling growing international confidence in Nepal's economic prospects.</p>`,
    categorySlug: "business",
    isBreaking: false,
    isFeatured: true,
    isSponsored: false,
    status: "published",
    tags: "nepse,stock market,economy,finance",
    aiSummary:
      "NEPSE hit an all-time high of 2,850 points with banking stocks up 12% and hydropower up 15%. Nepal's GDP growth is projected at 5.8% with market cap reaching NPR 3.2 trillion.",
    viewCount: 3102,
    coverImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  },
  {
    title: "Nepal Launches National Digital Identity System",
    titleNe: "नेपालले राष्ट्रिय डिजिटल पहिचान प्रणाली सुरू गर्यो",
    slug: "nepal-digital-identity-system-launch",
    excerpt:
      "The government has officially launched the National Digital Identity (NDI) system, enabling citizens to access government services online with a single digital ID.",
    excerptNe:
      "सरकारले राष्ट्रिय डिजिटल पहिचान (NDI) प्रणाली आधिकारिक रूपमा सुरू गरेको छ।",
    content: `<p>Nepal has taken a significant step toward digital governance with the official launch of the National Digital Identity (NDI) system. This initiative will allow all Nepali citizens to have a unique digital identity for accessing government services.</p>
<h2>Features of the NDI System</h2>
<p>The system integrates biometric data, citizenship information, and digital signatures into a single platform. Citizens can use their NDI to access over 200 government services online, including passport renewal, tax filing, and property registration.</p>
<h2>Implementation Timeline</h2>
<p>The rollout will be phased over 18 months, starting with urban areas and gradually expanding to rural districts. The government has partnered with international technology firms to ensure robust security and scalability.</p>`,
    categorySlug: "technology",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "technology,digital,government,identity",
    aiSummary:
      "Nepal launched its National Digital Identity system allowing citizens to access 200+ government services with a single digital ID, with an 18-month phased rollout starting in urban areas.",
    viewCount: 2847,
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    title: "Nepal Cricket Team Qualifies for ICC Cricket World Cup 2027",
    titleNe: "नेपाल क्रिकेट टोली ICC क्रिकेट विश्वकप २०२७ को लागि योग्य",
    slug: "nepal-cricket-world-cup-2027-qualification",
    excerpt:
      "In a historic achievement, Nepal's cricket team has qualified for the ICC Cricket World Cup 2027, defeating UAE in the final qualifier match.",
    excerptNe:
      "ऐतिहासिक उपलब्धिमा, नेपाल क्रिकेट टोलीले UAE लाई अन्तिम क्वालिफायर खेलमा हराउँदै ICC क्रिकेट विश्वकप २०२७ को लागि योग्यता हासिल गरेको छ।",
    content: `<p>Nepal's cricket team has achieved a historic milestone by qualifying for the ICC Cricket World Cup 2027, defeating UAE by 45 runs in the final qualifier match held in Oman.</p>
<h2>Match Summary</h2>
<p>Nepal posted a competitive total of 287/6 in 50 overs, led by a brilliant century from opener Rohit Paudel (112 off 98 balls). The bowling attack then restricted UAE to 242 all out, securing Nepal's historic qualification.</p>
<h2>National Celebration</h2>
<p>The news sparked massive celebrations across Nepal, with thousands taking to the streets in Kathmandu and other cities. The government has announced a special reception for the team upon their return.</p>
<blockquote>This is the proudest moment in Nepal cricket history. We dedicate this achievement to every Nepali fan. — Captain Rohit Paudel</blockquote>`,
    categorySlug: "sports",
    isBreaking: true,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "cricket,nepal,world cup,sports",
    aiSummary:
      "Nepal's cricket team qualified for ICC Cricket World Cup 2027 by defeating UAE by 45 runs, with Rohit Paudel scoring 112 runs. The achievement sparked nationwide celebrations.",
    viewCount: 8934,
    coverImage:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
  },
  {
    title: "Bollywood Star Visits Nepal, Promotes Tourism",
    titleNe: "बलिउड स्टारले नेपाल भ्रमण गरी पर्यटन प्रवर्द्धन गरे",
    slug: "bollywood-star-nepal-tourism-promotion",
    excerpt:
      "Popular Bollywood actor Ranveer Singh visited Nepal as a tourism ambassador, shooting promotional content at iconic locations including Pashupatinath and Pokhara.",
    excerptNe:
      "लोकप्रिय बलिउड अभिनेता रणवीर सिंहले पर्यटन राजदूतको रूपमा नेपाल भ्रमण गरे।",
    content: `<p>Bollywood superstar Ranveer Singh arrived in Nepal on a three-day visit as part of the government's 'Visit Nepal' tourism campaign, creating a buzz across social media and entertainment circles.</p>
<h2>Filming Locations</h2>
<p>The actor visited Pashupatinath Temple, Boudhanath Stupa, Pokhara's lakeside, and the Annapurna base camp trail. The promotional video, expected to reach over 100 million viewers on social media, will be released next month.</p>
<h2>Tourism Impact</h2>
<p>Nepal's tourism ministry expects the campaign to attract an additional 200,000 Indian tourists annually. The country received 1.2 million tourists in the previous year, with Indians comprising the largest segment.</p>`,
    categorySlug: "entertainment",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "bollywood,tourism,nepal,entertainment",
    aiSummary:
      "Bollywood actor Ranveer Singh visited Nepal as tourism ambassador, filming at Pashupatinath, Boudhanath, and Pokhara. The campaign aims to attract 200,000 additional Indian tourists annually.",
    viewCount: 5621,
    coverImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  },
  {
    title: "India-Nepal Relations Strengthen with New Trade Agreement",
    titleNe: "नयाँ व्यापार सम्झौतासँगै भारत-नेपाल सम्बन्ध मजबुत",
    slug: "india-nepal-trade-agreement-2024",
    excerpt:
      "India and Nepal have signed a comprehensive trade and transit agreement that will reduce trade barriers and boost bilateral commerce to USD 10 billion by 2030.",
    excerptNe:
      "भारत र नेपालले व्यापक व्यापार र पारवहन सम्झौतामा हस्ताक्षर गरेका छन्।",
    content: `<p>India and Nepal have signed a landmark comprehensive trade and transit agreement that is expected to significantly boost bilateral trade and strengthen economic ties between the two neighboring countries.</p>
<h2>Agreement Highlights</h2>
<p>The agreement includes provisions for reduced tariffs on 500 Nepali products entering India, simplified customs procedures at border crossing points, and enhanced transit facilities for Nepal's trade with third countries.</p>
<h2>Economic Impact</h2>
<p>Bilateral trade currently stands at USD 7.8 billion annually. The new agreement is expected to push this figure to USD 10 billion by 2030, creating significant economic opportunities for both countries.</p>`,
    categorySlug: "international",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "india,nepal,trade,international",
    aiSummary:
      "India and Nepal signed a comprehensive trade agreement reducing tariffs on 500 Nepali products and simplifying customs procedures, aiming to boost bilateral trade from USD 7.8B to USD 10B by 2030.",
    viewCount: 3456,
    coverImage:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
  },
  {
    title: "Kathmandu Valley Gets New Metro Rail Feasibility Study Approved",
    titleNe: "काठमाडौं उपत्यकाको नयाँ मेट्रो रेल सम्भाव्यता अध्ययन स्वीकृत",
    slug: "kathmandu-metro-rail-feasibility-2024",
    excerpt:
      "The government has approved a comprehensive feasibility study for a metro rail system in Kathmandu Valley, with Japanese technical assistance.",
    excerptNe:
      "सरकारले जापानी प्राविधिक सहयोगमा काठमाडौं उपत्यकामा मेट्रो रेल प्रणालीको व्यापक सम्भाव्यता अध्ययन स्वीकृत गरेको छ।",
    content: `<p>The Nepali government has approved a comprehensive feasibility study for a metro rail system in Kathmandu Valley, marking a significant step toward addressing the capital's chronic traffic congestion problem.</p>
<h2>Project Overview</h2>
<p>The proposed metro system would cover four lines spanning 72 kilometers, connecting major areas including Ratnapark, Kalanki, Bouddha, and Lalitpur. The project is estimated to cost NPR 800 billion.</p>
<h2>Japanese Partnership</h2>
<p>Japan International Cooperation Agency (JICA) will lead the technical feasibility study, drawing on its extensive experience with urban rail systems in Asia. The study is expected to be completed within 18 months.</p>`,
    categorySlug: "nepal",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "kathmandu,metro,transport,infrastructure",
    aiSummary:
      "Nepal approved a feasibility study for a 72km metro rail system in Kathmandu Valley covering 4 lines, estimated at NPR 800 billion, with JICA leading the technical study expected in 18 months.",
    viewCount: 6789,
    coverImage:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80",
  },
  {
    title: "Nepal Must Embrace Renewable Energy to Achieve Economic Goals",
    titleNe: "आर्थिक लक्ष्य हासिल गर्न नेपालले नवीकरणीय ऊर्जा अँगाल्नुपर्छ",
    slug: "nepal-renewable-energy-economic-goals-opinion",
    excerpt:
      "Nepal's abundant water resources position it perfectly to become a regional energy hub, but policy reforms and investment are urgently needed.",
    excerptNe:
      "नेपालको प्रचुर जलस्रोतले यसलाई क्षेत्रीय ऊर्जा केन्द्र बन्न उत्तम स्थितिमा राख्छ।",
    content: `<p>Nepal stands at a critical juncture in its economic development. With abundant water resources capable of generating over 83,000 MW of hydropower, the country has the potential to transform itself into a regional energy powerhouse.</p>
<h2>The Opportunity</h2>
<p>Currently, Nepal exports only about 500 MW of electricity to India, a fraction of its potential. By developing even 10% of its hydropower potential, Nepal could generate annual export revenues of USD 2-3 billion, fundamentally transforming its economy.</p>
<h2>Policy Reforms Needed</h2>
<p>To realize this potential, Nepal needs streamlined investment approval processes, transparent power purchase agreements, and improved grid connectivity with India and Bangladesh. The current bureaucratic hurdles have deterred many potential investors.</p>
<blockquote>Nepal's rivers are its greatest natural asset. We must treat them as such and develop them responsibly for the benefit of all Nepalis. — Dr. Bikash Pandey, Energy Expert</blockquote>`,
    categorySlug: "opinion",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "opinion,energy,hydropower,economy",
    aiSummary:
      "An opinion piece arguing Nepal should develop its 83,000 MW hydropower potential to become a regional energy hub, potentially earning USD 2-3 billion annually from exports, but requiring urgent policy reforms.",
    viewCount: 2134,
    coverImage:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
  },
  {
    title: "Nepal Tourism Revenue Surpasses Pre-Pandemic Levels",
    titleNe: "नेपाल पर्यटन राजस्व महामारी-पूर्व स्तर नाघ्यो",
    slug: "nepal-tourism-revenue-record-2024",
    excerpt:
      "Nepal's tourism sector has fully recovered, with revenue reaching USD 800 million in the current fiscal year, surpassing the pre-COVID high of USD 750 million.",
    excerptNe: "नेपालको पर्यटन क्षेत्र पूर्ण रूपमा पुनरुत्थान भएको छ।",
    content: `<p>Nepal's tourism industry has achieved a remarkable recovery, with revenue reaching USD 800 million in the current fiscal year — surpassing the pre-pandemic record of USD 750 million set in 2019.</p>
<h2>Visitor Statistics</h2>
<p>A total of 1.4 million tourists visited Nepal this year, with trekking and mountaineering accounting for 35% of total revenue. The number of Everest summits also reached a record 800 this spring season.</p>
<h2>New Tourism Products</h2>
<p>Nepal has been diversifying its tourism offerings beyond trekking, with cultural tourism, adventure sports, and wellness retreats gaining popularity. The government has also launched a 'Luxury Nepal' campaign targeting high-spending tourists.</p>`,
    categorySlug: "business",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "tourism,nepal,economy,travel",
    aiSummary:
      "Nepal's tourism revenue hit a record USD 800 million with 1.4 million visitors, surpassing pre-pandemic levels. Everest summits also reached a record 800 this spring season.",
    viewCount: 4231,
    coverImage:
      "https://images.unsplash.com/photo-1585016495481-91613b441f5e?w=800&q=80",
  },
  {
    title: "Nepal Startup Ecosystem Grows with 500 New Tech Companies",
    titleNe: "नेपाल स्टार्टअप इकोसिस्टम ५०० नयाँ टेक कम्पनीसँग बढ्दैछ",
    slug: "nepal-startup-ecosystem-500-companies",
    excerpt:
      "Nepal's tech startup ecosystem has seen explosive growth with over 500 new technology companies registered in the past year, attracting USD 50 million in venture capital.",
    excerptNe:
      "नेपालको टेक स्टार्टअप इकोसिस्टमले गत वर्ष ५०० भन्दा बढी नयाँ प्रविधि कम्पनी दर्तासँगै विस्फोटक वृद्धि देखेको छ।",
    content: `<p>Nepal's technology startup ecosystem is experiencing unprecedented growth, with over 500 new tech companies registered in the past year and venture capital investments reaching USD 50 million.</p>
<h2>Key Sectors</h2>
<p>Fintech leads the startup boom with 150 companies, followed by agritech (80), edtech (70), and healthtech (60). Several Nepali startups have already expanded to international markets.</p>
<h2>Government Support</h2>
<p>The government's Startup Nepal initiative has provided seed funding to 200 early-stage companies and established five innovation hubs across the country. Tax incentives for tech startups have also attracted diaspora entrepreneurs back to Nepal.</p>`,
    categorySlug: "technology",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "startup,technology,nepal,venture capital",
    aiSummary:
      "Nepal's tech startup ecosystem grew with 500+ new companies and USD 50M in VC investment. Fintech leads with 150 companies, supported by the government's Startup Nepal initiative funding 200 early-stage companies.",
    viewCount: 3567,
    coverImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  },
  {
    title: "Nepal National Football Team Qualifies for SAFF Championship Final",
    titleNe: "नेपाल राष्ट्रिय फुटबल टोली SAFF च्याम्पियनसिप फाइनलमा",
    slug: "nepal-football-saff-championship-final",
    excerpt:
      "Nepal's football team has reached the SAFF Championship final for the first time in 12 years, defeating India 2-1 in a thrilling semifinal.",
    excerptNe:
      "नेपाल फुटबल टोली १२ वर्षमा पहिलो पटक SAFF च्याम्पियनसिप फाइनलमा पुगेको छ।",
    content: `<p>Nepal's national football team has created history by reaching the SAFF Championship final for the first time in 12 years, defeating arch-rivals India 2-1 in a nail-biting semifinal match.</p>
<h2>Match Highlights</h2>
<p>Nepal took an early lead through Anjan Bista in the 23rd minute, with India equalizing in the 67th minute. The decisive goal came from Bimal Gharti Magar in the 89th minute, sending Nepal fans into raptures.</p>
<h2>Road to the Final</h2>
<p>Nepal topped their group with three wins from three matches, defeating Bhutan, Bangladesh, and Sri Lanka. The team has been praised for their disciplined defensive organization and quick counter-attacking play.</p>`,
    categorySlug: "sports",
    isBreaking: true,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "football,nepal,saff,sports",
    aiSummary:
      "Nepal's football team reached the SAFF Championship final for the first time in 12 years, defeating India 2-1 with a 89th-minute winner from Bimal Gharti Magar.",
    viewCount: 7823,
    coverImage:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
  },
  {
    title: "Everest Region Gets High-Speed Internet Connectivity",
    titleNe: "एभरेस्ट क्षेत्रमा हाई-स्पीड इन्टरनेट सम्पर्क",
    slug: "everest-region-high-speed-internet",
    excerpt:
      "Nepal Telecom has successfully installed fiber optic cables up to Everest Base Camp, providing high-speed internet to trekkers and researchers.",
    excerptNe:
      "नेपाल टेलिकमले एभरेस्ट बेस क्याम्पसम्म फाइबर अप्टिक केबल सफलतापूर्वक स्थापना गरेको छ।",
    content: `<p>Nepal Telecom has achieved a remarkable engineering feat by installing fiber optic cables up to Everest Base Camp at 5,364 meters, providing reliable high-speed internet connectivity to the world's highest mountain region.</p>
<h2>Technical Achievement</h2>
<p>The project involved laying 120 kilometers of fiber optic cable through some of the world's most challenging terrain. The connection provides speeds of up to 1 Gbps, enabling live streaming, video conferencing, and real-time data transmission from Base Camp.</p>
<h2>Benefits for Climbers and Researchers</h2>
<p>Mountaineers can now maintain better communication with their support teams and families. Researchers studying climate change in the Himalayas will have unprecedented access to real-time data connectivity.</p>`,
    categorySlug: "nepal",
    isBreaking: false,
    isFeatured: false,
    isSponsored: false,
    status: "published",
    tags: "everest,internet,technology,nepal",
    aiSummary:
      "Nepal Telecom installed fiber optic cables to Everest Base Camp (5,364m), providing 1 Gbps internet speeds to mountaineers and climate researchers through 120km of cable in challenging terrain.",
    viewCount: 5432,
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
];

console.log("Seeding articles...");
for (const article of articles) {
  const catId = catMap[article.categorySlug];
  await connection.execute(
    `INSERT IGNORE INTO articles 
     (title, titleNe, slug, excerpt, excerptNe, content, contentNe, coverImage, categoryId, status, 
      isBreaking, isFeatured, isSponsored, tags, aiSummary, viewCount, publishedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
    [
      article.title,
      article.titleNe ?? null,
      article.slug,
      article.excerpt ?? null,
      article.excerptNe ?? null,
      article.content,
      article.contentNe ?? null,
      article.coverImage ?? null,
      catId ?? null,
      article.status,
      article.isBreaking ? 1 : 0,
      article.isFeatured ? 1 : 0,
      article.isSponsored ? 1 : 0,
      article.tags ?? null,
      article.aiSummary ?? null,
      article.viewCount ?? 0,
    ]
  );
}

console.log("✅ Seed complete!");
await connection.end();
