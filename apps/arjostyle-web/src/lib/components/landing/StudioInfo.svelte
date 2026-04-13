<script lang="ts">
  import { MapPin, Clock, Award, ExternalLink } from 'lucide-svelte';
  import RevealOnScroll from '$components/ui/RevealOnScroll.svelte';

  const googleMapsLinkUrl = 'https://www.google.com/maps/place/D.A.+Tirol+Bldg/@9.6512593,123.8537407,19.75z/data=!4m6!3m5!1s0x33aa4dbb1136b19b:0x59321559759e6b6b!8m2!3d9.6513249!4d123.8539888!16s%2Fg%2F11gbdwz9z9?entry=ttu';
  const googleMapsEmbedSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d982.9484490944885!2d123.85338552840756!3d9.651259341481402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aa4dbb1136b19b%3A0x59321559759e6b6b!2sD.A.%20Tirol%20Bldg!5e0!3m2!1sen!2sph!4v1714321548139!5m2!1sen!2sph';
</script>

<section id="studio" class="py-24 bg-dark border-b border-border">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <RevealOnScroll>
      <h2 class="text-3xl md:text-4xl font-display font-semibold text-center mb-4 text-zinc-100 tracking-wide">MY STUDIO</h2>
    </RevealOnScroll>
    <RevealOnScroll delay={100}>
      <p class="text-zinc-500 text-lg text-center max-w-3xl mx-auto mb-10 font-mono text-sm">
        An elegant space designed for comfort and creativity, where art meets perfection.
      </p>
    </RevealOnScroll>

    <RevealOnScroll delay={200}>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-16">
        <div class="lg:col-span-8 overflow-hidden h-[400px] bg-elevated border border-border">
          {#if googleMapsEmbedSrc}
            <iframe
              src={googleMapsEmbedSrc}
              width="100%"
              height="100%"
              class="border-0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Studio Location on Google Maps"
            ></iframe>
          {:else}
            <div class="w-full h-full flex items-center justify-center text-zinc-600 font-mono">Map loading error...</div>
          {/if}
        </div>
        <div class="lg:col-span-4 grid grid-rows-2 gap-3">
          <div class="overflow-hidden h-[188px] bg-elevated border border-border">
            <img
              src="https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826257/r8h4fpmjdecybf1txnmh.jpg"
              alt="Tattoo station"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="overflow-hidden h-[188px] bg-elevated border border-border">
            <img
              src="https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826252/pzppd1yspyct2yvvdmlx.jpg"
              alt="Tattoo equipment"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </RevealOnScroll>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
      <RevealOnScroll delay={300}>
        <div class="bg-elevated border border-border p-6 h-full flex flex-col">
          <div class="mb-3"><MapPin class="w-8 h-8 text-ink" /></div>
          <h3 class="text-zinc-100 text-lg font-display mb-2 tracking-wide">LOCATION</h3>
          <p class="text-zinc-500 mb-4 font-mono text-sm">Located in the heart of Tagbilaran City, my space is designed for comfort and privacy.</p>
          <div class="mt-4 text-sm space-y-3">
            <div>
              <p class="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Address:</p>
              <address class="not-italic text-zinc-400 leading-relaxed font-mono text-sm">
                043 Maria Clara St.<br />2nd Floor, D.A. Tirol Building<br />Tagbilaran City, 6300<br />Bohol, Philippines
              </address>
            </div>
            <div>
              <p class="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Landmarks:</p>
              <p class="text-zinc-500 leading-relaxed font-mono text-sm">Above Paeng's Fried Chicken<br />Across from University of Bohol</p>
            </div>
            <a href={googleMapsLinkUrl} target="_blank" rel="noopener noreferrer" class="pt-3 inline-flex items-center font-mono text-sm text-ink hover:text-ink-400 transition-colors">
              VIEW ON GOOGLE MAPS <ExternalLink class="w-4 h-4 ml-1.5" />
            </a>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={400}>
        <div class="bg-elevated border border-border p-6 h-full flex flex-col">
          <div class="mb-3"><Clock class="w-8 h-8 text-ink" /></div>
          <h3 class="text-zinc-100 text-lg font-display mb-2 tracking-wide">HOURS</h3>
          <p class="text-zinc-500 mb-4 font-mono text-sm">I operate by appointment only to ensure every client receives my full attention.</p>
          <p class="text-sm font-medium text-zinc-300 italic mb-4 font-mono">BY APPOINTMENT ONLY</p>
          <div class="text-sm space-y-2">
            <div class="flex justify-between text-zinc-400 font-mono text-sm"><span>TUE - FRI:</span><span class="font-medium text-white">11AM - 7PM</span></div>
            <div class="flex justify-between text-zinc-400 font-mono text-sm"><span>SATURDAY:</span><span class="font-medium text-white">10AM - 6PM</span></div>
            <div class="flex justify-between text-zinc-700 font-mono text-sm"><span>SUN - MON:</span><span class="font-medium">CLOSED</span></div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={500}>
        <div class="bg-elevated border border-border p-6 h-full flex flex-col">
          <div class="mb-3"><Award class="w-8 h-8 text-ink" /></div>
          <h3 class="text-zinc-100 text-lg font-display mb-2 tracking-wide">MY STANDARDS</h3>
          <p class="text-zinc-500 mb-4 font-mono text-sm">I prioritize safety, hygiene, and artistic excellence in every tattoo.</p>
          <ul class="space-y-2 text-sm text-zinc-400 font-mono">
            <li class="flex items-center"><span class="w-1.5 h-1.5 bg-ink rounded-sm mr-2.5 flex-shrink-0"></span>Single-use needles</li>
            <li class="flex items-center"><span class="w-1.5 h-1.5 bg-ink rounded-sm mr-2.5 flex-shrink-0"></span>Hospital-grade sterilization</li>
            <li class="flex items-center"><span class="w-1.5 h-1.5 bg-ink rounded-sm mr-2.5 flex-shrink-0"></span>Premium inks and equipment</li>
            <li class="flex items-center"><span class="w-1.5 h-1.5 bg-ink rounded-sm mr-2.5 flex-shrink-0"></span>Certified professional artist</li>
          </ul>
        </div>
      </RevealOnScroll>
    </div>
  </div>
</section>