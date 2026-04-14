<script lang="ts">
  import RevealOnScroll from '$components/ui/RevealOnScroll.svelte';

  const faqData = [
    {
      question: 'Do tattoos hurt?',
      answer: 'Discomfort is part of the process — pain tolerance varies by placement. Ribs, spine, and feet rank high on the sensitivity scale. Hands and forearms are more manageable. I talk clients through every session and take breaks as needed. Most clients describe it as "uncomfortable but bearable."'
    },
    {
      question: 'How much will my tattoo cost?',
      answer: 'Philippine market rates start at ₱1,500 for small fine-line pieces and go up based on size, detail complexity, and whether color is involved. The booking form has a Tattoo Calculator that gives you an initial estimate — final price is confirmed at consultation. No surprises, no hidden fees.'
    },
    {
      question: 'What if I don\'t have a design idea yet?',
      answer: 'Many clients come with just a feeling or a reference photo. That\'s enough. During consultation, we build the design together — you approve every detail before any ink touches skin. Custom work is what I do, not flash-pile copy-paste.'
    },
    {
      question: 'What if I change my mind about the design?',
      answer: 'You review and approve the design mockup before I start. If something doesn\'t feel right, we fix it then. I don\'t put needle to skin until you\'re 100% satisfied with the design and placement. Revisions are part of the process.'
    },
    {
      question: 'What makes ArjoStyle different from a tattoo shop?',
      answer: 'This is a one-person private studio — not a shop floor. You get dedicated, uninterrupted time with me, no rushing between clients. I specialize in fine-line Japanese work, custom Filipino-themed pieces (including Baybayin), and clean bold traditional work. Every design is built for you specifically.'
    },
    {
      question: 'Do you do Baybayin or Filipino-themed tattoos?',
      answer: 'Yes — custom Baybayin scripts, Philippine-inspired designs, and Filipino cultural motifs are some of my favorite work. Upload what you have in mind (names, words, concepts) and we\'ll build something that connects to your heritage.'
    },
    {
      question: 'Is it safe and hygienic?',
      answer: 'Non-negotiable. I use 100% single-use disposable needles and ink caps. All reusable equipment is autoclave-sterilized. Premium vegan-friendly inks. The studio follows strict cross-contamination protocols. Your safety comes before anything else — no exceptions.'
    },
    {
      question: 'Do you accept walk-ins?',
      answer: 'No — I work strictly by appointment so every client gets dedicated, uninterrupted time. This means no rushed sessions and no competing with a full shop. Fill out the booking form and I\'ll get back to you within 24–48 hours.'
    },
    {
      question: 'How do I book an appointment?',
      answer: 'Fill out the online booking form — be as detailed as you can about your idea, placement, and size. I\'ll review it personally and contact you to discuss the design, confirm pricing, and arrange the 50% deposit to secure your slot.'
    },
    {
      question: 'Is the consultation separate from the tattoo session?',
      answer: 'Yes. After you submit your booking request, I\'ll reach out for an initial chat to finalize the design direction. The actual tattoo session is booked separately once the 50% deposit is paid.'
    },
    {
      question: 'Can I book multiple tattoos in one session?',
      answer: 'Yes — if the designs are small to medium and related, we can combine them. Mention this in the Specific Requirements field of the booking form and I\'ll give you a combined quote.'
    },
    {
      question: 'Is the price from the Tattoo Calculator final?',
      answer: 'The calculator gives an initial estimate based on the info you provide. Final pricing is confirmed during consultation — it can go up or down slightly depending on final design complexity and placement.'
    },
    {
      question: 'What happens after I submit the booking form?',
      answer: 'I review every submission personally. Within 24–48 hours, I\'ll reach out via your preferred contact method to discuss the design, answer questions, and send an invoice for the 50% deposit. Your slot is only confirmed once the deposit clears.'
    },
    {
      question: 'What is the minimum age to get tattooed?',
      answer: '18+, no exceptions. Philippine law requires valid government-issued photo ID at the appointment — Passport, Driver\'s License, or National ID accepted.'
    },
    {
      question: 'Is a deposit required?',
      answer: 'Yes — 50% of the estimated total, non-refundable. This secures your appointment slot and covers design time. The remaining 50% is paid in cash on the day of your session.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'Deposit: GCash or bank transfer (BPI/UnionBank). Balance on session day: Cash preferred. GCash also accepted. No card payments — just the methods listed here.'
    },
    {
      question: 'Can I bring my own design or reference images?',
      answer: 'Absolutely. Upload them in the booking form along with any written notes. Reference images help me understand your taste and aesthetic direction — even vague references are useful. Original concepts welcome.'
    },
    {
      question: 'Do you do cover-up tattoos?',
      answer: 'Yes. Cover-ups require an in-person assessment to evaluate the existing tattoo\'s age, ink depth, and scarring. Please upload clear photos of the area you want to cover in the booking form and I\'ll give you honest feedback on what\'s possible.'
    },
    {
      question: 'How long will my tattoo appointment take?',
      answer: 'Small pieces (1–2 hrs), medium pieces (2–4 hrs), large pieces (4–8 hrs). The Tattoo Calculator estimates duration based on size and complexity. Multi-session work is always an option for larger pieces.'
    },
    {
      question: 'How should I prepare for my appointment?',
      answer: 'Get a full night\'s sleep and eat a proper meal beforehand — low blood sugar makes the experience harder. Stay hydrated. Avoid alcohol for 24 hours before and any blood-thinning medication (ibuprofen, aspirin) for at least 48 hours. Wear comfortable clothing that gives access to the placement area.'
    },
    {
      question: 'What is your rescheduling and cancellation policy?',
      answer: 'Rescheduling requires at least 48 hours notice — contact me as soon as you know. Deposits are non-refundable and non-transferable. If you cancel without proper notice, the deposit is forfeited and a new booking is required.'
    },
    {
      question: 'Do you offer touch-ups?',
      answer: 'Yes — one complimentary touch-up within 3 months of the tattoo date, provided healing was normal and aftercare instructions were followed correctly. Touch-ups after 3 months or for aftercare-related issues may incur a small fee.'
    },
    {
      question: 'What hygiene and safety measures do you follow?',
      answer: '100% single-use disposable needles and ink cups. Autoclave sterilization for all non-disposable tools. Hospital-grade disinfectants used between every client. I follow FDA-equivalent standards for ink and supply sourcing. The studio is a clean, private one-person setup — no shared equipment ever.'
    },
    {
      question: 'What aftercare products do you recommend?',
      answer: 'For the first 2 weeks: unscented, dye-free lotion (CetrIM, Lubriderm, or similar) applied thin 2–3x daily. Avoid petroleum-based products like Vaseline. Use fragrance-free antibacterial soap for the first wash only. After 2 weeks: any quality moisturizer. For long-term color preservation: SPF 30+ sunscreen over the area when exposed.'
    },
    {
      question: 'How long does a tattoo take to fully heal?',
      answer: 'Surface healing takes 2–3 weeks. Full internal healing — where the deeper layers of skin have fully regenerated — takes 3–6 months. The tattoo will look its best at the 1-month mark after the surface skin has finished peeling and settling.'
    },
    {
      question: 'Can I get tattooed if I\'m pregnant or breastfeeding?',
      answer: 'No. I do not tattoo clients who are pregnant or breastfeeding. This is standard practice industry-wide due to the risk of infection and the unknown effects of ink substances on developing bodies.'
    },
    {
      question: 'What if I have a medical condition or skin condition?',
      answer: 'Disclose all medical conditions in the booking form. Conditions like keloid scarring, hemophilia, diabetes, active eczema or psoriasis in the placement area, and immunodeficiency conditions may affect whether I can work on you. I reserve the right to decline service if I assess the risk as too high.'
    },
    {
      question: 'Can I see your studio before booking?',
      answer: 'Absolutely. The Studio page has photos of the workspace. Tagbilaran City, Bohol-based — mention your location in the booking form and we can discuss whether an in-person visit before the session makes sense for your situation.'
    },
    {
      question: 'How do I know ArjoStyle is the right artist for me?',
      answer: 'Browse the Tattoo and Flash galleries. Read the testimonials from real clients. If my work resonates with you — especially the fine-line and Japanese work — there\'s a good fit. The booking form is the first step: describe what you want, and I\'ll tell you honestly if I\'m the right person for it.'
    }
  ];

  const INITIAL_FAQ_COUNT = 6;
  let searchTerm = $state('');
  let showAll = $state(false);
  let scrollRef: HTMLDivElement;
  let openItem = $state<string | null>(null);

  const filteredFaqs = $derived.by(() => {
    // Always search the full dataset, then slice for display
    const matched = !searchTerm.trim()
      ? faqData
      : faqData.filter((faq) => {
          const lower = searchTerm.toLowerCase();
          return faq.question.toLowerCase().includes(lower) || faq.answer.toLowerCase().includes(lower);
        });
    return showAll ? matched : matched.slice(0, INITIAL_FAQ_COUNT);
  });

  function handleShowLess() {
    showAll = false;
    scrollRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function toggleItem(id: string) {
    openItem = openItem === id ? null : id;
  }
</script>

<section id="faq" class="py-20 md:py-24 bg-dark transition-colors duration-300 border-b border-border">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <RevealOnScroll>
      <h2 class="text-3xl md:text-4xl font-display font-semibold text-center mb-4 text-white tracking-wide">FREQUENTLY ASKED QUESTIONS</h2>
    </RevealOnScroll>
    <RevealOnScroll delay={100}>
      <p class="text-zinc-500 text-lg text-center max-w-3xl mx-auto mb-10 font-mono text-sm">
        Have questions about getting inked? Find answers below — or search by keyword.
      </p>
    </RevealOnScroll>

    <RevealOnScroll delay={150}>
      <div bind:this={scrollRef} class="max-w-3xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search questions..."
          bind:value={searchTerm}
          class="w-full px-4 py-3 border border-border bg-elevated text-white font-mono text-sm focus:border-ink focus:outline-none"
        />
      </div>
    </RevealOnScroll>

    <div class="max-w-3xl mx-auto">
      {#each filteredFaqs as faq, index}
        {@const itemId = `item-${index}`}
        <RevealOnScroll delay={100}>
          <div class="border-b border-border">
            <button
              class="w-full text-left py-4 text-base md:text-lg font-display text-zinc-200 hover:text-white flex justify-between items-center transition-colors duration-150"
              onclick={() => toggleItem(itemId)}
              aria-expanded={openItem === itemId}
            >
              <span>{faq.question.toUpperCase()}</span>
              <span class="ml-4 flex-shrink-0 transition-transform duration-200 {openItem === itemId ? 'rotate-180' : ''}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </button>
            {#if openItem === itemId}
              <div class="text-zinc-500 text-sm md:text-base leading-relaxed pt-1 pb-4 font-mono">
                {faq.answer}
              </div>
            {/if}
          </div>
        </RevealOnScroll>
      {/each}

      {#if filteredFaqs.length === 0 && searchTerm.trim()}
        <p class="text-center text-zinc-600 mt-6 font-mono text-sm">No questions found matching "{searchTerm}".</p>
      {/if}
    </div>

    <div class="text-center mt-10">
      {#if !showAll && faqData.length > INITIAL_FAQ_COUNT}
        <button onclick={() => (showAll = true)} class="px-6 py-3 border border-border text-zinc-400 text-sm font-mono hover:bg-elevated hover:border-border-light hover:text-white transition-colors">
          SEE ALL FAQS ({faqData.length})
        </button>
      {/if}
      {#if showAll && faqData.length > INITIAL_FAQ_COUNT}
        <button onclick={handleShowLess} class="px-6 py-3 border border-border text-zinc-400 text-sm font-mono hover:bg-elevated hover:border-border-light hover:text-white transition-colors">
          SHOW LESS
        </button>
      {/if}
    </div>
  </div>
</section>
