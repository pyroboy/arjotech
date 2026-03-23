<script lang="ts">
  interface RoomRent {
    id: string;
    monthlyRent: number;
  }

  interface Expenses {
    utilities: number;
    maintenance: number;
    propertyTax: number;
    insurance: number;
    misc: number;
  }

  interface ProjectionYear {
    year: number;
    grossIncome: number;
    netIncome: number;
    cumulativeIncome: number;
  }

  let propertyPrice = $state(5000000);
  let numRooms = $state(4);
  let monthlyRentUniform = $state(15000);
  let useUniformRent = $state(true);

  let rooms = $state<RoomRent[]>([
    { id: '1', monthlyRent: 15000 },
    { id: '2', monthlyRent: 15000 },
    { id: '3', monthlyRent: 15000 },
    { id: '4', monthlyRent: 15000 }
  ]);

  let expenses = $state<Expenses>({
    utilities: 3500,
    maintenance: 2000,
    propertyTax: 500,
    insurance: 300,
    misc: 1000
  });

  let occupancyRate = $state(85);
  let vacancyMonths = $state(1);

  let grossMonthlyIncome = $derived.by(() => {
    if (useUniformRent) {
      return numRooms * monthlyRentUniform;
    }
    return rooms.reduce((sum, room) => sum + room.monthlyRent, 0);
  });

  let monthlyExpenses = $derived.by(() => {
    return (
      expenses.utilities +
      expenses.maintenance +
      expenses.propertyTax +
      expenses.insurance +
      expenses.misc
    );
  });

  let occupiedMonths = $derived(12 - vacancyMonths);
  let adjustedGrossMonthly = $derived(
    (grossMonthlyIncome * occupancyRate) / 100
  );
  let netMonthlyIncome = $derived(adjustedGrossMonthly - monthlyExpenses);
  let annualNetIncome = $derived(netMonthlyIncome * occupiedMonths);
  let annualRoiPercent = $derived((annualNetIncome / propertyPrice) * 100);

  let breakEvenMonths = $derived.by(() => {
    if (netMonthlyIncome <= 0) return null;
    return Math.ceil(propertyPrice / netMonthlyIncome);
  });

  let breakEvenYears = $derived.by(() => {
    if (!breakEvenMonths) return null;
    return (breakEvenMonths / 12).toFixed(1);
  });

  let cashOnCashReturn = $derived(
    ((netMonthlyIncome * 12) / propertyPrice) * 100
  );

  let projectionTable = $derived.by(() => {
    const table: ProjectionYear[] = [];
    let cumulative = 0;
    for (let year = 1; year <= 5; year++) {
      cumulative += annualNetIncome;
      table.push({
        year,
        grossIncome: adjustedGrossMonthly * occupiedMonths,
        netIncome: annualNetIncome,
        cumulativeIncome: cumulative
      });
    }
    return table;
  });

  function updateNumRooms(newNum: number) {
    numRooms = newNum;
    const diff = newNum - rooms.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        rooms.push({
          id: String(rooms.length + 1),
          monthlyRent: monthlyRentUniform
        });
      }
    } else if (diff < 0) {
      rooms = rooms.slice(0, newNum);
    }
  }

  function formatPeso(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatPesoDecimal(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
</script>

<svelte:head>
  <title>Rental Property ROI Calculator — ArjoStyle Free Tools</title>
  <meta
    name="description"
    content="Calculate rental property ROI, analyze monthly expenses, and project 5-year earnings. Free online tool for Philippine property investors."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-400">
  <div class="max-w-6xl mx-auto px-4 py-12 md:py-16">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">
        Rental Property ROI Calculator
      </h1>
      <p class="text-zinc-400 text-lg max-w-2xl">
        Calculate your rental property returns, analyze expenses, and project long-term earnings.
      </p>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <!-- Input Section -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Property Details -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Property Details</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Property Purchase Price (₱)
              </label>
              <input
                type="number"
                bind:value={propertyPrice}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
              <p class="text-xs text-zinc-500 mt-1">{formatPeso(propertyPrice)}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Number of Rooms/Units
              </label>
              <input
                type="number"
                min="1"
                bind:value={numRooms}
                onchange={() => updateNumRooms(numRooms)}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>
        </div>

        <!-- Monthly Rent -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-white">Monthly Rent per Room</h2>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={useUniformRent}
                class="w-4 h-4 rounded border-zinc-600 bg-surface-800 text-orange-500 focus:ring-orange-500"
              />
              <span class="text-sm text-zinc-400">Use Uniform Rate</span>
            </label>
          </div>

          {#if useUniformRent}
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Monthly Rent per Room (₱)
              </label>
              <input
                type="number"
                bind:value={monthlyRentUniform}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
              <p class="text-xs text-zinc-500 mt-1">
                {numRooms} rooms × {formatPeso(monthlyRentUniform)} = {formatPeso(grossMonthlyIncome)}/month
              </p>
            </div>
          {:else}
            <div class="space-y-3">
              {#each rooms as room, index (room.id)}
                <div>
                  <label class="block text-sm font-medium text-white mb-1">
                    Room {index + 1} Monthly Rent (₱)
                  </label>
                  <input
                    type="number"
                    bind:value={room.monthlyRent}
                    class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Monthly Expenses -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Monthly Expenses</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Utilities (₱)
              </label>
              <input
                type="number"
                bind:value={expenses.utilities}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Maintenance (₱)
              </label>
              <input
                type="number"
                bind:value={expenses.maintenance}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Property Tax/Month (₱)
              </label>
              <input
                type="number"
                bind:value={expenses.propertyTax}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Insurance (₱)
              </label>
              <input
                type="number"
                bind:value={expenses.insurance}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Miscellaneous (₱)
              </label>
              <input
                type="number"
                bind:value={expenses.misc}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div class="pt-2 border-t border-zinc-700">
              <p class="flex justify-between items-center text-white">
                <span class="font-semibold">Total Monthly Expenses:</span>
                <span>{formatPeso(monthlyExpenses)}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Occupancy Settings -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Occupancy & Vacancy</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Occupancy Rate: {occupancyRate}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                bind:value={occupancyRate}
                class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
              <p class="text-xs text-zinc-500 mt-1">
                Expected occupancy percentage per month
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-2">
                Vacancy Months per Year
              </label>
              <input
                type="number"
                min="0"
                max="12"
                bind:value={vacancyMonths}
                class="w-full px-4 py-2 bg-surface-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
              />
              <p class="text-xs text-zinc-500 mt-1">
                Months with no rental income ({occupiedMonths} months operating)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="space-y-6">
        <!-- Key Metrics -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Key Metrics</h2>
          <div class="space-y-4">
            <div>
              <p class="text-xs text-zinc-500 uppercase tracking-wider">
                Gross Monthly Income
              </p>
              <p class="text-2xl font-bold text-orange-500">
                {formatPeso(adjustedGrossMonthly)}
              </p>
              <p class="text-xs text-zinc-500 mt-1">
                @ {occupancyRate}% occupancy
              </p>
            </div>

            <div class="border-t border-zinc-700 pt-4">
              <p class="text-xs text-zinc-500 uppercase tracking-wider">
                Net Monthly Income
              </p>
              <p class="text-2xl font-bold {netMonthlyIncome > 0 ? 'text-green-400' : 'text-red-400'}">
                {formatPeso(netMonthlyIncome)}
              </p>
              <p class="text-xs text-zinc-500 mt-1">
                After all expenses
              </p>
            </div>

            <div class="border-t border-zinc-700 pt-4">
              <p class="text-xs text-zinc-500 uppercase tracking-wider">
                Annual Net Income
              </p>
              <p class="text-2xl font-bold text-white">
                {formatPeso(annualNetIncome)}
              </p>
              <p class="text-xs text-zinc-500 mt-1">
                {occupiedMonths} months
              </p>
            </div>

            <div class="border-t border-zinc-700 pt-4">
              <p class="text-xs text-zinc-500 uppercase tracking-wider">
                Annual ROI
              </p>
              <p class="text-2xl font-bold {annualRoiPercent > 0 ? 'text-green-400' : 'text-red-400'}">
                {annualRoiPercent.toFixed(2)}%
              </p>
            </div>

            <div class="border-t border-zinc-700 pt-4">
              <p class="text-xs text-zinc-500 uppercase tracking-wider">
                Cash-on-Cash Return
              </p>
              <p class="text-2xl font-bold text-white">
                {cashOnCashReturn.toFixed(2)}%
              </p>
            </div>

            {#if breakEvenMonths !== null}
              <div class="border-t border-zinc-700 pt-4">
                <p class="text-xs text-zinc-500 uppercase tracking-wider">
                  Break-Even Period
                </p>
                <p class="text-2xl font-bold text-white">
                  {breakEvenMonths} months
                </p>
                <p class="text-xs text-zinc-500 mt-1">
                  (~{breakEvenYears} years)
                </p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- 5-Year Projection Table -->
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 mb-12">
      <h2 class="text-xl font-bold text-white mb-4">5-Year Projection</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-zinc-700">
              <th class="text-left py-3 px-4 text-zinc-400 font-semibold">Year</th>
              <th class="text-right py-3 px-4 text-zinc-400 font-semibold">
                Gross Income
              </th>
              <th class="text-right py-3 px-4 text-zinc-400 font-semibold">
                Net Income
              </th>
              <th class="text-right py-3 px-4 text-zinc-400 font-semibold">
                Cumulative Income
              </th>
            </tr>
          </thead>
          <tbody>
            {#each projectionTable as row (row.year)}
              <tr class="border-b border-zinc-700/50 hover:bg-zinc-700/20 transition">
                <td class="py-3 px-4 text-white font-semibold">Year {row.year}</td>
                <td class="py-3 px-4 text-right text-zinc-300">
                  {formatPeso(row.grossIncome)}
                </td>
                <td class="py-3 px-4 text-right text-white font-semibold">
                  {formatPeso(row.netIncome)}
                </td>
                <td class="py-3 px-4 text-right text-orange-400">
                  {formatPeso(row.cumulativeIncome)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center text-zinc-500 text-sm border-t border-zinc-800 pt-8">
      <p>
        Part of <a href="/tools" class="text-orange-500 hover:text-orange-400 transition">
          ArjoStyle Free Tools
        </a>
      </p>
    </div>
  </div>
</div>
