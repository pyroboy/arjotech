<script lang="ts">
  import RevealOnScroll from '$components/ui/RevealOnScroll.svelte';

  const faqData = [
    { question: 'Do tattoos hurt?', answer: 'Yes, there is some level of discomfort involved. Pain levels vary depending on individual tolerance, tattoo placement, and duration.' },
    { question: 'How much will my tattoo cost?', answer: 'Pricing depends on size, complexity, placement, and whether it\'s color or black & grey. The booking form includes a Tattoo Calculator for an initial estimate.' },
    { question: 'What if I don\'t have a design idea yet?', answer: 'No problem! Many clients come with just a concept. During consultation, I\'ll help shape your idea into a design you\'ll love.' },
    { question: 'What if I change my mind?', answer: 'You\'ll approve every detail before any ink touches skin. We review the design, placement, and size together — I don\'t start until you\'re 100% happy.' },
    { question: 'Is it safe and hygienic?', answer: 'Absolutely. I use single-use needles, hospital-grade sterilization, and premium inks. Your safety is non-negotiable.' },
    { question: 'Do you accept walk-ins?', answer: 'I operate strictly by appointment only to ensure each client receives dedicated time and attention. Please use the online booking form to schedule your consultation and tattoo session.' },
    { question: 'How do I book an appointment?', answer: "You can start the process by filling out the online Booking Form. Provide your details, design ideas, placement, and references. I'll contact you to discuss everything and arrange the deposit." },
    { question: 'Is the consultation separate from the tattoo appointment?', answer: "Often, yes. After you submit your booking request, I'll contact you for an initial consultation to finalize the design, price, and duration. The actual tattoo session is scheduled separately once the deposit is paid." },
    { question: 'How do I book multiple tattoos or placements?', answer: "The online booking form currently provides an estimate for one tattoo placement at a time. If you're interested in multiple tattoos in one session, please mention this clearly in the 'Specific Requirements' section of the form." },
    { question: "Is the price from the 'Tattoo Estimate' step final?", answer: "No, the price shown in the 'Tattoo Estimate' step is an initial estimate based on the information you provide. The final price will be confirmed during the consultation." },
    { question: 'What happens after I submit the booking request?', answer: "I'll review all the details and contact you via your preferred method to discuss the design, confirm the final details, and arrange the 50% deposit payment to secure your booking." },
    { question: 'What is the minimum age to get tattooed?', answer: 'You must be 18 years of age or older to get tattooed at my studio, in accordance with Philippine law. Valid photo ID is required at your appointment.' },
    { question: 'Is a deposit required?', answer: "Yes, a 50% non-refundable deposit is required to secure your appointment slot. This confirms your booking and goes towards the final cost of your tattoo." },
    { question: 'What payment methods do you accept?', answer: 'I typically accept GCash or bank transfer for the deposit. The remaining balance is usually due in cash on the day of your appointment.' },
    { question: 'Can I bring my own design?', answer: 'Yes, you can absolutely bring your own design or reference images! Please upload them using the booking form.' },
    { question: 'Do you do cover-up tattoos?', answer: 'Yes, I do offer cover-up tattoos. Please indicate this on the booking form and provide clear photos of the existing tattoo you wish to cover.' },
    { question: 'How long will my tattoo appointment take?', answer: "The duration depends on the tattoo's size, detail, and placement. The Tattoo Calculator provides an estimate." },
    { question: 'What should I do to prepare for my appointment?', answer: 'Get a good night\'s sleep, eat a proper meal beforehand, and stay hydrated. Avoid alcohol or blood-thinning medication 24 hours prior.' },
    { question: 'What is your rescheduling/cancellation policy?', answer: 'I require at least 48-72 hours notice for rescheduling. Deposits are non-refundable.' },
    { question: 'Do you offer touch-ups?', answer: 'Yes, I typically offer one free touch-up within 2-3 months after the tattoo has fully healed, provided that aftercare instructions were followed correctly.' },
    { question: 'What safety and hygiene measures do you follow?', answer: 'I use single-use needles, hospital-grade sterilization for all reusable equipment, and maintain a clean and sanitized environment.' },
    { question: 'What do I need to do for tattoo aftercare?', answer: 'After your session, I\'ll clean and bandage the tattoo and provide you with detailed instructions on how to clean, moisturize, and protect it during the healing process.' },
  ];

  const INITIAL_FAQ_COUNT = 5;
  let searchTerm = $state('');
  let showAll = $state(false);
  let scrollRef: HTMLDivElement;
  let openItem = $state<string | null>(null);

  const filteredFaqs = $derived.by(() => {
    const base = showAll ? faqData : faqData.slice(0, INITIAL_FAQ_COUNT);
    if (!searchTerm.trim()) return base;
    const lower = searchTerm.toLowerCase();
    return base.filter((faq) => faq.question.toLowerCase().includes(lower) || faq.answer.toLowerCase().includes(lower));
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
        Have questions about getting inked? Find answers below or search for keywords.
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