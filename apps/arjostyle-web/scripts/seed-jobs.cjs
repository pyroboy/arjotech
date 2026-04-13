const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://neondb_owner:npg_oXnP1Hsy6xKM@ep-purple-bar-a12dkcdc-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);

const jobs = [
  // Strong fit
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Founding Product Engineer',
    company: 'Bild AI',
    url: 'https://wellfound.com/jobs/bild-ai-founding-product-engineer',
    source: 'hackernews',
    fit: 'strong',
    pay_range: '$120K–$180K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Svelte/Rust/Tauri + early AI startup equity — direct match for ArjoTech pillar. Bild AI builds AI coding agents, culturally aligned.'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'AI Agent Engineer',
    company: 'CollectWise',
    url: 'https://wellfound.com/jobs/collectwise-ai-agent-engineer',
    source: 'hackernews',
    fit: 'strong',
    pay_range: '$150K–$200K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Rust/AI orch + multi-agent systems — exactly what Claw Agent does. CollectWise automates B2B data collection with AI agents.'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Founding Engineer',
    company: 'AnswerThis',
    url: 'https://wellfound.com/jobs/answerthis-co-found',
    source: 'hackernews',
    fit: 'strong',
    pay_range: '$100K–$160K',
    location: 'Remote (US)',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Early founding engineer at AI oral exam startup. Full-stack + AI + founding — perfect ArjoTech/ArjoMagno blend.'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Senior/Staff Full-Stack Engineer',
    company: 'Zep',
    url: 'https://wellfound.com/jobs/zep-llm-apps-senior-full-stack',
    source: 'hackernews',
    fit: 'strong',
    pay_range: '$160K–$220K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Svelte + Node + PostgreSQL + LLM/RAG — near-perfect stack match. Zep does long-term memory for AI apps.'
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Full Stack Engineer',
    company: 'Kaizen',
    url: 'https://wellfound.com/jobs/kaizen-llm-apps-full-stack',
    source: 'hackernews',
    fit: 'strong',
    pay_range: '$130K–$170K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Svelte/React + Node + PostgreSQL — solid stack match. Kaizen is an LLM observability startup (Series A).'
  },
  {
    id: '66666622-2222-2222-2222-222222222222',
    title: 'Founding Engineer',
    company: 'Wonder Dog',
    url: 'https://wellfound.com/jobs/wonderdog-ai-found',
    source: 'hackernews',
    fit: 'strong',
    pay_range: '$100K–$150K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Founding engineer at AI pet tech startup. Full-stack + AI + founding equity — matches ArjoTech/ArjoStyle creative side.'
  },
  {
    id: '77777777-7777-7777-7777-777777777771',
    title: 'Database Internal Engineer',
    company: 'ParadeDB',
    url: 'https://paradedb.com/careers',
    source: 'hackernews',
    fit: 'strong',
    pay_range: '$140K–$180K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Rust + PostgreSQL extensibility — ParadeDB is the Elasticsearch replacement built on Postgres. YC S23, 12-person team.'
  },
  // Good fit
  {
    id: '88888888-8888-8888-8888-888888888881',
    title: 'Senior Full-Stack Engineer',
    company: 'Toma',
    url: 'https://wellfound.com/jobs/toma-senior-full-stack',
    source: 'hackernews',
    fit: 'good',
    pay_range: '$120K–$160K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'TypeScript + React + Node + Postgres — solid full-stack match. Toma is a B2B payments startup.'
  },
  {
    id: '88888888-8888-8888-8888-888888888882',
    title: 'Senior Full-Stack (LLM)',
    company: 'Converge',
    url: 'https://wellfound.com/jobs/converge-ai-senior-full-stack',
    source: 'hackernews',
    fit: 'good',
    pay_range: '$130K–$170K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'TypeScript + Python + LLMs — Converge automates enterprise compliance with AI agents.'
  },
  {
    id: '88888888-8888-8888-8888-888888888883',
    title: 'Senior Full-Stack',
    company: 'CloudDevs',
    url: 'https://wellfound.com/jobs/clouddevs-senior-full-stack',
    source: 'hackernews',
    fit: 'good',
    pay_range: '$100K–$140K',
    location: 'Remote',
    remote: true,
    job_type: 'contract',
    status: 'new',
    fit_summary: 'Full-stack JS/TS + cloud infra. Remote-first dev staffing firm — solid match.'
  },
  {
    id: '99999999-9999-9999-9999-999999999991',
    title: 'Rust and Developer Relations',
    company: 'Wasmer',
    url: 'https://wellfound.com/jobs/wasmer-rust-and-devrel',
    source: 'hackernews',
    fit: 'good',
    pay_range: '$80K–$120K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Rust + WebAssembly + DevRel — Wasmer is the leading Wasm runtime. Perfect for ArjoTech Rust pillar.'
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Senior Full-Stack',
    company: 'WALTER',
    url: 'https://wellfound.com/jobs/walter-ai-senior-full-stack',
    source: 'hackernews',
    fit: 'good',
    pay_range: '$140K–$180K',
    location: 'Remote (US)',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'TypeScript + Node + PostgreSQL + AI. WALTER is a B2B sales automation startup.'
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb0',
    title: 'Full-Stack Engineer',
    company: 'Sticker Mule',
    url: 'https://wellfound.com/jobs/sticker-mule-full-stack',
    source: 'hackernews',
    fit: 'good',
    pay_range: '$110K–$140K',
    location: 'Remote (US)',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Full-stack JS + Ruby + PostgreSQL. Sticker Mule is a profitable custom printing startup.'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccc00',
    title: 'Senior Full-Stack Engineer',
    company: 'Lago',
    url: 'https://wellfound.com/jobs/lago-ai-senior-full-stack',
    source: 'hackernews',
    fit: 'good',
    pay_range: '$130K–$160K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'TypeScript + React + Node + PostgreSQL. Lago is an open-source usage-based billing platform.'
  },
  // Stretch
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddd0000',
    title: 'Founding Engineer',
    company: 'Rare Days',
    url: 'https://wellfound.com/jobs/rare-days-found',
    source: 'hackernews',
    fit: 'stretch',
    pay_range: '$80K–$120K',
    location: 'Remote',
    remote: true,
    job_type: 'full_time',
    status: 'new',
    fit_summary: 'Early founding engineer — equity-heavy, no proven product. Good for ArjoMagno founding mindset but risky. Stretch fit.'
  }
];

async function seed() {
  console.log('Creating job_opportunities table...');
  await sql`
    CREATE TABLE IF NOT EXISTS job_opportunities (
      id UUID PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      url TEXT NOT NULL,
      source TEXT NOT NULL,
      fit TEXT NOT NULL,
      pay_range TEXT,
      location TEXT,
      remote BOOLEAN DEFAULT true,
      job_type TEXT,
      status TEXT DEFAULT 'new',
      notes TEXT,
      fit_summary TEXT,
      your_tags TEXT[],
      jd_snippet TEXT,
      found_at TIMESTAMPTZ,
      applied_at TIMESTAMPTZ
    )
  `;
  console.log('Table created.');

  console.log(`Inserting ${jobs.length} jobs...`);
  for (const job of jobs) {
    await sql`
      INSERT INTO job_opportunities (
        id, title, company, url, source, fit, pay_range,
        location, remote, job_type, status, fit_summary, found_at
      ) VALUES (
        ${job.id}, ${job.title}, ${job.company}, ${job.url}, ${job.source},
        ${job.fit}, ${job.pay_range}, ${job.location}, ${job.remote},
        ${job.job_type}, ${job.status}, ${job.fit_summary}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        company = EXCLUDED.company,
        url = EXCLUDED.url,
        source = EXCLUDED.source,
        fit = EXCLUDED.fit,
        pay_range = EXCLUDED.pay_range,
        location = EXCLUDED.location,
        remote = EXCLUDED.remote,
        job_type = EXCLUDED.job_type,
        status = EXCLUDED.status,
        fit_summary = EXCLUDED.fit_summary,
        updated_at = NOW()
    `;
    console.log(`  ✓ ${job.company} — ${job.title} (${job.fit})`);
  }

  const count = await sql`SELECT COUNT(*) as c FROM job_opportunities`;
  console.log(`\nDone! ${count[0].c} jobs in database.`);
}

seed().catch(e => { console.error('Error:', e.message); process.exit(1); });
