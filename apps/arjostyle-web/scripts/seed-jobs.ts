import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}
const sql = neon(DATABASE_URL);

async function main() {
  console.log('Creating job_opportunities table...');

  await sql`
    CREATE TABLE IF NOT EXISTS job_opportunities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      url TEXT NOT NULL,
      source TEXT DEFAULT 'other' NOT NULL,
      fit TEXT DEFAULT 'good',
      pay_range TEXT,
      location TEXT,
      remote TEXT,
      job_type TEXT,
      status TEXT DEFAULT 'new' NOT NULL,
      notes TEXT,
      fit_summary TEXT,
      your_tags TEXT,
      jd_snippet TEXT,
      found_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      applied_at TIMESTAMPTZ
    )
  `;

  console.log('Table created.');

  const jobs = [
    { id: 'seed-1', title: 'Founding Product Engineer', company: 'Bild AI', url: 'https://www.ycombinator.com/companies/bild-ai/jobs/dDMaxVN-founding-product-engineer', source: 'hackernews', fit: 'strong', payRange: null, location: 'YC W25', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Founding team at YC W25 AI company. Full-stack + AI API integration experience maps directly to Claw Agent, ArjoStyle AI, and Tattoo Tide AI tools.', fitSummary: 'Founding AI product, end-to-end ownership, SvelteKit/React + AI APIs, YC W25', yourTags: 'AI Integration, SvelteKit, Founding Role, TypeScript, End-to-End Ownership', jdSnippet: 'Build AI products from scratch at a YC W25 AI startup' },
    { id: 'seed-2', title: 'Product Engineer — AI Agents for Growth', company: 'Lago', url: 'https://getlago.notion.site/Lago-Product-Engineer-AI-Agents-for-Growth-327ef63110d280cdb030ccf429d3e4d7', source: 'hackernews', fit: 'strong', payRange: null, location: 'YC S23', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Open-source billing SaaS. AI Agents focus for growth. Your SaaS multi-tenant work (Kanaya) and AI agent pipelines (ArjoStyle AI) are directly relevant.', fitSummary: 'SaaS billing platform, AI agents, Node.js, open-source, multi-tenant', yourTags: 'SaaS, AI Agents, Node.js, Open Source, Multi-tenant, TypeScript', jdSnippet: 'Lead AI agent initiatives for growth at an open-source billing startup' },
    { id: 'seed-3', title: 'AI Agent Engineer', company: 'CollectWise', url: 'https://www.ycombinator.com/companies/collectwise/jobs/Ktc6m6o-ai-agent-engineer', source: 'hackernews', fit: 'strong', payRange: null, location: 'YC F24', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Your ArjoStyle AI chatbot (Meta Graph API + Groq/Llama + Inngest + Google Calendar) is a near-direct match for building AI agents for debt collection automation.', fitSummary: 'AI agents, chatbot/automation, LLM integration, Messenger/webhook pipelines, YC F24', yourTags: 'AI Agents, Chatbots, LLMs, Groq/Llama, Meta Graph API, Inngest, Automation', jdSnippet: 'Build AI agents for debt collection automation at YC F24' },
    { id: 'seed-4', title: "Database Internal Engineer (Rust)", company: 'ParadeDB', url: 'https://paradedb.notion.site/', source: 'hackernews', fit: 'stretch', payRange: null, location: 'YC S23', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Rust + databases — niche match. Your Claw Agent (Rust/Tauri v2) shows you can write production Rust. Stretch but worth noting.', fitSummary: 'Rust, databases, YC S23 — Claw Agent proves Rust capability', yourTags: 'Rust, Databases, Postgres, DuckDB, YC', jdSnippet: 'Work on ParadeDB internal systems and database infrastructure in Rust' },
    { id: 'seed-5', title: "Software Engineer — Build the World's Best AI Plan Checker", company: 'InspectMind AI', url: 'https://www.ycombinator.com/companies/inspectmind-ai/jobs/jQNra64-software-engineer-build-the-world-s-best-ai-plan-checker', source: 'hackernews', fit: 'good', payRange: null, location: 'YC W24', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'AI evaluation/product. Generalist full-stack engineer — your breadth across 9 shipped SaaS products is the pitch.', fitSummary: 'AI product engineering, full-stack generalist, shipped SaaS products', yourTags: 'AI, Full-Stack, Product Engineering, Generalist, TypeScript', jdSnippet: "Build the world's best AI plan checker at YC W24" },
    { id: 'seed-6', title: 'Agent Context Layer Engineer', company: 'Zep AI', url: 'https://www.ycombinator.com/companies/zep-ai/jobs', source: 'hackernews', fit: 'good', payRange: null, location: 'YC W24', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Memory/context layer for AI agents — your SecondBrain (FTS5, semantic search) and DuckDB intelligence layer in Claw Agent show relevant background.', fitSummary: 'AI agent infrastructure, memory/embedding systems, RAG, YC W24', yourTags: 'AI Agents, RAG, Embeddings, Ollama, DuckDB, Memory Systems', jdSnippet: 'Build the context and memory layer powering AI agents at YC W24' },
    { id: 'seed-7', title: 'Senior/Staff Software Engineer — AI Automotive Coworkers', company: 'Toma', url: 'https://www.ycombinator.com/companies/toma/jobs/2lrQI7S-sr-staff-software-engineer', source: 'hackernews', fit: 'stretch', payRange: null, location: 'YC W24', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Senior/staff IC at YC W24. Stretch on seniority but your shipping track record (9 production SaaS products) speaks. Domain (automotive) is new.', fitSummary: 'Senior IC, AI/robotics, strong shipping track record, domain stretch', yourTags: 'Senior IC, AI, Full-Stack, Shipping, YC W24', jdSnippet: 'Build AI automotive coworkers at YC W24' },
    { id: 'seed-8', title: 'Founding Engineering Lead', company: 'AnswerThis', url: 'https://www.ycombinator.com/companies/answerthis/jobs/CNdatw5-founding-engineering-lead', source: 'hackernews', fit: 'strong', payRange: null, location: 'YC F25', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Founding engineer at a fresh YC F25 startup. End-to-end ownership and execution speed — exactly how you built Tattoo Tide, ArjoStyle AI, and Kanaya.', fitSummary: 'Founding engineer, full-stack, product ownership, YC F25, fast execution', yourTags: 'Founding Engineer, Full-Stack, Product, YC F25, End-to-End Ownership, Execution', jdSnippet: 'Lead engineering at YC F25 startup — question-answering product' },
    { id: 'seed-9', title: 'Rust and DevRel Positions', company: 'Wasmer', url: 'https://www.workatastartup.com/companies/wasmer', source: 'hackernews', fit: 'stretch', payRange: null, location: 'YC S19', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Rust + WebAssembly. Your Claw Agent Rust code is real but DevRel is a different career move. Consider only if Rust focus is a priority.', fitSummary: 'Rust, WebAssembly, DevRel — Claw Agent proves Rust but career shift', yourTags: 'Rust, WebAssembly, DevRel, Wasm', jdSnippet: 'Work on Wasmer runtime in Rust or lead developer relations' },
    { id: 'seed-10', title: 'Backend Engineers — GoGoGrandparent', company: 'GoGoGrandparent', url: 'https://www.ycombinator.com/companies/gogograndparent/jobs/2vbzAw8-backend-engineer', source: 'hackernews', fit: 'good', payRange: null, location: 'YC S16', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Backend at a rides/transportation startup. Good full-stack match — your Node.js, SvelteKit, and API integration work transfers.', fitSummary: 'Backend engineering, Node.js, API integrations, YC S16', yourTags: 'Backend, Node.js, API, Full-Stack, YC', jdSnippet: 'Build backend systems at GoGoGrandparent (YC S16)' },
    { id: 'seed-11', title: 'Engineering, GTM, Cos — Automate BPOs', company: 'Kaizen', url: 'https://www.kaizenautomation.com/careers', source: 'hackernews', fit: 'good', payRange: null, location: 'YC P25', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'BPO automation. Your WTFPOS (restaurant POS), FlowWork (workforce mgmt), and systems-building for PH businesses gives genuine domain credibility.', fitSummary: 'BPO automation, systems integration, Philippine/PH market insight', yourTags: 'Automation, BPO, Systems, POS, Workforce, Philippines Market', jdSnippet: 'Automate BPOs at YC P25 startup' },
    { id: 'seed-12', title: 'API Access for Agents and Apps', company: 'Nango', url: 'https://jobs.ashbyhq.com/Nango', source: 'hackernews', fit: 'strong', payRange: null, location: 'YC W23', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: "API integration platform for AI agents. Your entire AI integration stack (Meta Graph API, Google Calendar, Groq, Discord) at ArjoStyle AI is the product they're building.", fitSummary: 'API integrations for AI agents, third-party API work, AI agent platforms', yourTags: 'API Integrations, AI Agents, Third-party APIs, Webhooks, Node.js', jdSnippet: 'Build API integrations powering AI agents and apps at Nango (YC W23)' },
    { id: 'seed-13', title: 'Founding Platform Engineer (NYC, Onsite)', company: 'Converge', url: 'https://www.runconverge.com/careers/founding-platform-engineer', source: 'hackernews', fit: 'good', payRange: null, location: 'NYC (Onsite)', remote: 'On-site', jobType: 'Full-time', status: 'new', notes: 'NYC onsite is a hard constraint. Founding platform role is high-impact — full-stack + systems thinking fits. Note: only apply if NYC relocation is viable.', fitSummary: 'Founding platform engineer, systems architecture, NYC on-site', yourTags: 'Founding Engineer, Platform, Systems, NYC, Architecture', jdSnippet: 'Build platform infrastructure at Converge (YC S23) — NYC onsite' },
    { id: 'seed-14', title: 'Senior Ruby on Rails Developer', company: 'InpharmD', url: 'https://inpharmd.com/jobs/senior-ruby-on-rails-engineer', source: 'hackernews', fit: 'weak', payRange: null, location: 'YC W21', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Ruby on Rails is not in your stack. Full stretch — would need a significant pivot. Only consider if Rails is a deliberate move.', fitSummary: 'Ruby on Rails, pharma/healthcare domain — not in current stack', yourTags: 'Ruby on Rails, Healthcare, Senior', jdSnippet: 'Senior Ruby on Rails engineer at InpharmD (YC W21)' },
    { id: 'seed-15', title: 'Scrappy Product Managers and Product/Data Engineers', company: 'Hive', url: 'https://jobs.ashbyhq.com/hive.co', source: 'hackernews', fit: 'stretch', payRange: null, location: 'YC S14', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'YC S14 is old. Product/data engineering focus. Stretch on seniority but your 9 shipped products and data work (SQLite FTS5, DuckDB) is relevant.', fitSummary: 'Product engineering, data, shipping track record — YC S14 is old', yourTags: 'Product Engineering, Data, Shipping, SaaS', jdSnippet: 'Product and data engineering at Hive (YC S14)' },
    { id: 'seed-16', title: 'Full-Stack Developer, AI Applications', company: 'Titan AI', url: 'https://weworkremotely.com/remote-jobs/titan-ai-full-stack-developer-ai-applications', source: 'weworkremotely', fit: 'strong', payRange: '$100,000 - $150,000 USD', location: 'United States', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'AI applications full-stack. Found on WWR live scrape. Your AI integration work (Groq, Claude, Inngest, Discord, Meta API) is the exact skill set.', fitSummary: 'Full-stack AI applications, LLM/AI APIs, $100-150K USD, Remote', yourTags: 'Full-Stack, AI Integration, LLM APIs, Claude/Groq, TypeScript, Remote', jdSnippet: 'Build AI-powered applications as a full-stack developer at Titan AI' },
    { id: 'seed-17', title: 'Full-Stack Developer (Junior)', company: 'LeadUp AI', url: 'https://weworkremotely.com/remote-jobs/leadup-ai-full-stack-developer-junior', source: 'weworkremotely', fit: 'stretch', payRange: '$50,000 - $74,999 USD', location: 'United States', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: "Marked \"Junior\" — you're overqualified on experience. But if the AI focus is strong and it's a path to a senior role, consider. Otherwise skip.", fitSummary: 'Junior level — overqualified, but AI focus could be a path', yourTags: 'Junior, AI, Full-Stack — overqualified', jdSnippet: 'Junior full-stack developer with AI focus at LeadUp AI' },
    { id: 'seed-18', title: 'Full Stack Developer / Senior Full Stack / Lead', company: 'CRUX', url: 'https://weworkremotely.com/remote-jobs/crux-full-stack-developer-senior-full-stack-lead', source: 'weworkremotely', fit: 'strong', payRange: '$75,000 - $99,999 USD', location: null, remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Multiple levels in one posting (mid/senior/lead). Your 9 shipped SaaS products and founding experience covers all three. AI experience is a plus.', fitSummary: 'Full-stack, multiple levels, AI-adjacent, $75-100K USD, remote', yourTags: 'Full-Stack, Senior/Lead, AI-adjacent, SaaS, $75-100K USD, Remote', jdSnippet: 'Full-stack developer (mid/senior/lead) at CRUX' },
    { id: 'seed-19', title: 'Senior Full-Stack Developer (AI-Assisted Development) — Remote', company: 'Creatunity', url: 'https://weworkremotely.com/remote-jobs/creatunity-llc-senior-full-stack-developer-ai-assisted-development-remote', source: 'weworkremotely', fit: 'strong', payRange: '$75,000 - $99,999 USD', location: 'Warsaw, Poland (Remote)', remote: 'Remote', jobType: 'Full-time', status: 'new', notes: '"AI-Assisted Development" is literally your specialty — ArjoStyle AI, Claw Agent, Career-Ops. Warsaw-based but remote-friendly. $75-100K USD.', fitSummary: 'AI-assisted development, full-stack senior, $75-100K USD, remote, Warsaw', yourTags: 'AI-Assisted Dev, Full-Stack Senior, Claude/Groq, SvelteKit, $75-100K USD', jdSnippet: 'Senior full-stack developer specializing in AI-assisted development at Creatunity' },
    { id: 'seed-20', title: 'LLM Full-stack/Backend Developer', company: 'CloudDevs', url: 'https://weworkremotely.com/remote-jobs/clouddevs-full-stack-backend-developers-llm-focused', source: 'weworkremotely', fit: 'strong', payRange: '$50,000 - $74,999 USD', location: 'San Francisco', remote: 'Worldwide', jobType: 'Contract', status: 'new', notes: 'Contract W-2 role. LLM integration focus. Your ArjoStyle AI chatbot pipeline (Groq + Inngest + Meta API + Google Calendar) is a direct match. USD pay is excellent for PH market.', fitSummary: 'LLM integration, full-stack contract, $50-75K USD, Groq/Llama, Inngest', yourTags: 'LLM, AI APIs, Groq/Llama, Inngest, Node.js, Contract, USD, Remote', jdSnippet: 'Build LLM-powered features for enterprise clients at CloudDevs' },
    { id: 'seed-21', title: 'Senior Software Engineer', company: 'WALTER', url: 'https://weworkremotely.com/remote-jobs/walter-senior-software-engineer', source: 'weworkremotely', fit: 'good', payRange: '$50,000 - $74,999 USD', location: null, remote: 'Remote', jobType: 'Full-time', status: 'new', notes: 'Remote-first fintech/healthtech. Senior level. Your diverse project portfolio (9 SaaS products, POS, workforce mgmt, property management) demonstrates breadth.', fitSummary: 'Senior full-stack, fintech/healthtech, remote, $50-75K USD', yourTags: 'Senior, Full-Stack, Fintech, Healthtech, Remote, SaaS', jdSnippet: 'Senior software engineer at WALTER (remote-first fintech/healthtech)' },
    { id: 'seed-22', title: 'Software Engineer', company: 'Sticker Mule', url: 'https://weworkremotely.com/remote-jobs/sticker-mule-software-engineer-2', source: 'weworkremotely', fit: 'good', payRange: '$145,000 USD', location: 'New York, NY', remote: 'Worldwide', jobType: 'Full-time', status: 'new', notes: 'CONFIRMED $145K from live page scrape. Top 100 company, legendary engineering culture. Full-stack fit — your breadth across 9 products is exactly what they value.', fitSummary: 'Full-stack, product company, $145K USD confirmed, Top 100 company', yourTags: 'Full-Stack, Product Company, $145K USD, NYC/US, Top Brand', jdSnippet: "Build Sticker Mule's printing and infrastructure platform — $145K confirmed" },
    { id: 'seed-23', title: 'Full-Stack Engineering Lead', company: 'Rare Days', url: 'https://weworkremotely.com/remote-jobs/rare-days-full-stack-engineering-lead', source: 'weworkremotely', fit: 'strong', payRange: '$75,000 - $99,999 USD', location: 'Vancouver, BC', remote: 'Worldwide', jobType: 'Full-time', status: 'new', notes: 'Engineering Lead — your 9 shipped SaaS products and founding-level execution is exactly what they want. $75-100K USD, Vancouver-based but remote OK.', fitSummary: 'Engineering lead, full-stack, $75-100K USD, founding/execution track record', yourTags: 'Engineering Lead, Full-Stack, $75-100K USD, Founding Experience, SaaS', jdSnippet: 'Lead full-stack engineering at Rare Days (Vancouver, remote OK)' },
    { id: 'seed-24', title: 'Vibe Coder Wanted', company: 'Wonder Dog', url: 'https://weworkremotely.com/remote-jobs/wonder-dog-vibe-coder-wanted', source: 'weworkremotely', fit: 'good', payRange: '$100,000+ USD', location: 'Los Angeles, CA', remote: 'Worldwide', jobType: 'Full-time', status: 'new', notes: '"Vibe coder" = autonomous, fast shipping, no process overhead. Creative/meme culture. Your Career-Ops pipeline and 9 shipped products fit the vibe perfectly.', fitSummary: 'Fast shipping, creative culture, full-stack, $100K+ USD, meme/creative brand', yourTags: 'Fast Shipping, Creative, Full-Stack, $100K+, USD, Autonomous', jdSnippet: 'Ship fast, think different, build cool stuff — Wonder Dog' },
  ];

  console.log(`Inserting ${jobs.length} jobs...`);

  // Clear existing seed jobs first
  await sql`DELETE FROM job_opportunities WHERE id LIKE 'seed-%'`;

  for (const job of jobs) {
    await sql`
      INSERT INTO job_opportunities (
        id, title, company, url, source, fit, pay_range,
        location, remote, job_type, status, notes,
        fit_summary, your_tags, jd_snippet
      ) VALUES (
        ${job.id},
        ${job.title},
        ${job.company},
        ${job.url},
        ${job.source},
        ${job.fit},
        ${job.payRange},
        ${job.location},
        ${job.remote},
        ${job.jobType},
        ${job.status},
        ${job.notes},
        ${job.fitSummary},
        ${job.yourTags},
        ${job.jdSnippet}
      )
    `;
    console.log(`  Inserted: ${job.id} — ${job.title} @ ${job.company}`);
  }

  console.log(`\nDone! ${jobs.length} jobs seeded.`);
}

main().catch(console.error);
