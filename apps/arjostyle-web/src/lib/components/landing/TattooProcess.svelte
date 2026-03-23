<script lang="ts">
  import { CalendarCheck, SprayCan, PenTool, ShieldCheck, Clock } from 'lucide-svelte';
  import type { Component } from 'svelte';

  interface ProcessStep {
    id: string;
    icon: Component;
    title: string;
    duration: string;
    items: { heading: string; text: string }[];
    tip: { title: string; text: string };
  }

  const processSteps: ProcessStep[] = [
    {
      id: '1', icon: CalendarCheck, title: 'Online Booking & Consultation', duration: 'Online + 30-60 min',
      items: [
        { heading: 'Book Online', text: 'Select your preferred artist, service, date, and time through our secure online portal.' },
        { heading: 'Deposit', text: 'A deposit may be required to secure your appointment slot.' },
        { heading: 'Consultation', text: 'Discuss your ideas, references, placement, and sizing with your chosen artist.' },
        { heading: 'Design Refinement', text: 'We provide expert advice to ensure your design is perfect for tattooing.' },
      ],
      tip: { title: "What you'll need:", text: 'Have your ideas, reference images, and preferred placement ready.' },
    },
    {
      id: '2', icon: SprayCan, title: 'Preparation & Stencil', duration: '30-45 minutes',
      items: [
        { heading: 'Sterile Setup', text: 'Your artist prepares a fully sterilized workstation with single-use needles and equipment.' },
        { heading: 'Skin Prep', text: 'The tattoo area is carefully cleaned, disinfected, and shaved if necessary.' },
        { heading: 'Stencil Placement', text: 'Your approved design is applied as a stencil for final placement checks.' },
      ],
      tip: { title: 'Final Check:', text: "This is your last chance to confirm you're 100% happy with the size and placement!" },
    },
    {
      id: '3', icon: PenTool, title: 'Tattoo Creation', duration: '1-8+ hours',
      items: [
        { heading: 'Linework', text: 'The foundational outlines are applied with precision.' },
        { heading: 'Shading & Detail', text: 'Depth, texture, and gradients are skillfully added.' },
        { heading: 'Color/Fill', text: 'Pigments are carefully packed for vibrant, lasting results.' },
        { heading: 'Breaks', text: 'Regular breaks are taken for longer sessions to ensure comfort.' },
      ],
      tip: { title: 'Session Comfort:', text: 'Eat well, stay hydrated, wear comfy clothes, and communicate with your artist.' },
    },
    {
      id: '4', icon: ShieldCheck, title: 'Aftercare & Healing', duration: '2-4 weeks+',
      items: [
        { heading: 'Initial Wrap', text: 'Your tattoo is cleaned and covered with a protective bandage.' },
        { heading: 'Cleaning Routine', text: 'Follow specific instructions for gentle washing and drying.' },
        { heading: 'Moisturizing', text: 'Apply recommended aftercare lotion sparingly to keep skin hydrated.' },
        { heading: 'Protection', text: 'Avoid sun exposure, soaking, and tight clothing over the healing tattoo.' },
      ],
      tip: { title: 'Follow Up:', text: 'Contact us with any healing concerns. A complimentary touch-up may be offered.' },
    },
  ];

  let activeStepId = $state(processSteps[0].id);
  let isAutoToggling = $state(true);
  let autoplayTimer: ReturnType<typeof setInterval> | null = null;
  let isVisible = $state(false);
  let sectionEl: HTMLElement;

  const activeStep = $derived(processSteps.find((s) => s.id === activeStepId) || processSteps[0]);

  function advanceStep() {
    const idx = processSteps.findIndex((s) => s.id === activeStepId);
    activeStepId = processSteps[(idx + 1) % processSteps.length].id;
  }

  function pauseAutoplay() {
    isAutoToggling = false;
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  function handleStepClick(stepId: string) {
    activeStepId = stepId;
    pauseAutoplay();
  }

  function handleCardClick() {
    advanceStep();
    pauseAutoplay();
  }

  $effect(() => {
    if (isAutoToggling) {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(advanceStep, 5000);
    }
    return () => { if (autoplayTimer) clearInterval(autoplayTimer); };
  });

  $effect(() => {
    if (!sectionEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { isVisible = true; observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} id="process" class="py-24 md:py-32 bg-gradient-to-b from-surface-900 to-surface-950 relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <h2
      class="text-4xl md:text-5xl font-bold text-center mb-4 text-white transition-all duration-600
        {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}"
    >
      Your <span class="text-zinc-400">Tattoo Journey</span> Explained
    </h2>

    <div
      class="h-px w-full bg-zinc-600 mx-auto mb-6 transition-transform duration-1000 origin-left
        {isVisible ? 'scale-x-100' : 'scale-x-0'}"
    ></div>

    {#if isVisible}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        onclick={handleCardClick}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
        class="bg-surface-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-700/50 overflow-hidden max-w-3xl mx-auto cursor-pointer"
      >
        <!-- Step Header -->
        <div class="flex justify-around items-center p-4 bg-surface-900/50 border-b border-zinc-700/50 relative">
          {#each processSteps as step}
            <div class="text-center relative">
              <button
                onclick={(e) => { e.stopPropagation(); handleStepClick(step.id); }}
                class="relative z-10 text-xl md:text-2xl font-bold transition-colors duration-300
                  {activeStepId === step.id ? 'text-zinc-400' : 'text-zinc-500 hover:text-zinc-300'}"
                aria-label="Go to step {step.id}: {step.title}"
              >
                {step.id}
              </button>
              {#if activeStepId === step.id}
                <div class="absolute -bottom-4 left-0 right-0 h-1 bg-zinc-500 rounded-full transition-all duration-300"></div>
              {/if}
              <span class="mt-1 text-xs block transition-colors duration-300
                {activeStepId === step.id ? 'text-zinc-300' : 'text-zinc-500'}" aria-hidden="true">
                Step {step.id}
              </span>
            </div>
          {/each}
        </div>

        <!-- Content Area -->
        <div class="p-6 md:p-8 min-h-[400px] md:min-h-[450px] flex flex-col md:flex-row md:items-start gap-6 pointer-events-none">
          <div class="flex-shrink-0 mx-auto md:mx-0 mb-4 md:mb-0 md:mr-6 text-zinc-400">
            <svelte:component this={activeStep.icon} class="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.5} />
          </div>
          <div class="flex-grow space-y-4">
            <h3 class="text-2xl font-bold text-white">{activeStep.title}</h3>
            <div class="flex items-center gap-2 text-sm bg-zinc-700/50 rounded-full px-3 py-1 text-zinc-300 w-fit">
              <Clock size={14} class="mr-1 flex-shrink-0" />
              <span>{activeStep.duration}</span>
            </div>
            <div class="text-zinc-300 text-base leading-relaxed">
              <ul class="list-none space-y-3 pl-0">
                {#each activeStep.items as item}
                  <li>
                    <span class="block text-zinc-300 font-medium mb-1">{item.heading}</span>
                    <span class="text-zinc-300">{item.text}</span>
                  </li>
                {/each}
              </ul>
              <div class="mt-4 p-3 bg-zinc-700/40 rounded-lg border border-zinc-700">
                <p class="text-sm text-zinc-300 font-medium mb-2">{activeStep.tip.title}</p>
                <p class="text-xs text-zinc-300">{activeStep.tip.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>
