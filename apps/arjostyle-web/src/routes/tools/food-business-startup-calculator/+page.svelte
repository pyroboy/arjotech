<script lang="ts">
  interface CAPEXItem {
    id: string;
    name: string;
    cost: number;
  }

  interface BusinessType {
    name: string;
    capex: Omit<CAPEXItem, 'id'>[];
  }

  const businessTypes: Record<string, BusinessType> = {
    'Silog Stand': {
      name: 'Silog Stand',
      capex: [
        { name: 'Stove', cost: 3500 },
        { name: 'Pans & Cookware', cost: 1500 },
        { name: 'Rice Cooker', cost: 2000 },
        { name: 'Utensils & Accessories', cost: 1000 },
        { name: 'Signage', cost: 2000 },
        { name: 'Initial Inventory', cost: 5000 }
      ]
    },
    'Cookie Bakeshop': {
      name: 'Cookie Bakeshop',
      capex: [
        { name: 'Oven', cost: 8000 },
        { name: 'Mixer', cost: 5000 },
        { name: 'Baking Supplies & Molds', cost: 3000 },
        { name: 'Packaging Equipment', cost: 2000 },
        { name: 'Signage', cost: 2000 },
        { name: 'Initial Inventory', cost: 3000 }
      ]
    },
    'Milk Tea Shop': {
      name: 'Milk Tea Shop',
      capex: [
        { name: 'Espresso Machine', cost: 8000 },
        { name: 'Freezer', cost: 6000 },
        { name: 'POS System', cost: 5000 },
        { name: 'Furniture & Fixtures', cost: 5000 },
        { name: 'Signage & Decor', cost: 3000 },
        { name: 'Initial Inventory', cost: 5000 }
      ]
    },
    'Samgyupsal Restaurant': {
      name: 'Samgyupsal Restaurant',
      capex: [
        { name: 'Korean BBQ Grill Tables (4x)', cost: 16000 },
        { name: 'Kitchen Equipment', cost: 15000 },
        { name: 'Furniture & Fixtures', cost: 12000 },
        { name: 'POS System', cost: 5000 },
        { name: 'Signage & Renovation', cost: 8000 },
        { name: 'Initial Inventory', cost: 10000 }
      ]
    },
    'Food Cart': {
      name: 'Food Cart',
      capex: [
        { name: 'Cart/Unit', cost: 8000 },
        { name: 'Stove & Cooking Equipment', cost: 4000 },
        { name: 'Point of Sale System', cost: 3000 },
        { name: 'Canopy & Signage', cost: 3000 },
        { name: 'Initial Inventory', cost: 3000 }
      ]
    },
    Cafe: {
      name: 'Cafe',
      capex: [
        { name: 'Espresso Machine', cost: 10000 },
        { name: 'Refrigeration Unit', cost: 7000 },
        { name: 'Furniture & Fixtures', cost: 10000 },
        { name: 'POS System', cost: 5000 },
        { name: 'Signage & Renovation', cost: 8000 },
        { name: 'Initial Inventory', cost: 5000 }
      ]
    }
  };

  let selectedBusinessType = $state<keyof typeof businessTypes>('Silog Stand');
  let capexItems = $state<CAPEXItem[]>([
    { id: '0', name: 'Stove', cost: 3500 },
    { id: '1', name: 'Pans & Cookware', cost: 1500 },
    { id: '2', name: 'Rice Cooker', cost: 2000 },
    { id: '3', name: 'Utensils & Accessories', cost: 1000 },
    { id: '4', name: 'Signage', cost: 2000 },
    { id: '5', name: 'Initial Inventory', cost: 5000 }
  ]);

  let monthlyRent = $state(5000);
  let monthlyUtilities = $state(2000);
  let monthlyLabor = $state(15000);
  let monthlyIngredients = $state(8000);
  let monthlyPackaging = $state(2000);
  let monthlyMisc = $state(1000);
  let monthlyRevenue = $state(30000);

  let nextCapexId = $state(6);

  function changeBusinessType(type: keyof typeof businessTypes) {
    selectedBusinessType = type;
    const typeData = businessTypes[type];
    capexItems = typeData.capex.map((item, i) => ({
      id: String(i),
      ...item
    }));
    nextCapexId = capexItems.length;
  }

  function addCapexItem() {
    capexItems.push({
      id: String(nextCapexId++),
      name: '',
      cost: 0
    });
    capexItems = capexItems;
  }

  function removeCapexItem(id: string) {
    capexItems = capexItems.filter((item) => item.id !== id);
  }

  let totalCapex = $derived.by(() => {
    return capexItems.reduce((sum, item) => sum + item.cost, 0);
  });

  let totalMonthlyOpex = $derived(
    monthlyRent + monthlyUtilities + monthlyLabor + monthlyIngredients + monthlyPackaging + monthlyMisc
  );

  let monthlyGrossProfit = $derived(monthlyRevenue - monthlyIngredients - monthlyPackaging);

  let monthlyNetProfit = $derived(monthlyGrossProfit - monthlyRent - monthlyUtilities - monthlyLabor - monthlyMisc);

  let breakEvenMonths = $derived.by(() => {
    if (monthlyNetProfit <= 0) return Infinity;
    return Math.ceil(totalCapex / monthlyNetProfit);
  });

  let roiProjection = $derived.by(() => {
    const projection: Array<{ month: number; cumulative: number; status: string }> = [];
    let cumulative = -totalCapex;

    for (let month = 1; month <= 60; month++) {
      cumulative += monthlyNetProfit;
      let status = 'Still investing';
      if (cumulative >= 0 && projection.every((p) => p.cumulative < 0)) {
        status = 'Break-even!';
      } else if (cumulative >= 0) {
        status = 'Profitable';
      }

      if (month <= 12 || month % 6 === 0) {
        projection.push({ month, cumulative, status });
      }
    }
    return projection;
  });

  function formatPrice(price: number): string {
    return price.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('en-PH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
</script>

<svelte:head>
  <title>Food Business Startup Calculator — ArjoStyle Free Tools</title>
  <meta
    name="description"
    content="Free food business startup cost calculator. Calculate CAPEX, OPEX, break-even timeline, and ROI projections."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 pt-20 pb-16 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">Food Business Startup Calculator</h1>
      <p class="text-zinc-400 text-lg">
        Calculate startup costs, operating expenses, and ROI projections for your food business
      </p>
    </div>

    <!-- Business Type Selector -->
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 mb-12">
      <h2 class="text-white font-semibold text-lg mb-4">Business Type</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {#each Object.keys(businessTypes) as type}
          <button
            onclick={() => changeBusinessType(type as keyof typeof businessTypes)}
            class="py-2 px-3 rounded-lg text-sm font-medium transition-all text-center {selectedBusinessType === type
              ? 'bg-orange-500 text-white'
              : 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700'}"
          >
            {type}
          </button>
        {/each}
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8 mb-12">
      <!-- CAPEX Section -->
      <div class="lg:col-span-2">
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-white font-semibold text-lg">Capital Expenditure (CAPEX)</h2>
            <button
              onclick={addCapexItem}
              class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all"
            >
              + Add Item
            </button>
          </div>

          <div class="space-y-3 max-h-96 overflow-y-auto">
            {#each capexItems as item (item.id)}
              <div class="flex gap-3 items-end">
                <input
                  type="text"
                  placeholder="Item name"
                  bind:value={item.name}
                  class="flex-1 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                />
                <input
                  type="number"
                  placeholder="Cost"
                  bind:value={item.cost}
                  min="0"
                  step="500"
                  class="w-32 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                />
                <span class="text-zinc-400 text-sm whitespace-nowrap">
                  {formatPrice(item.cost)}
                </span>
                <button
                  onclick={() => removeCapexItem(item.id)}
                  class="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-all"
                >
                  Remove
                </button>
              </div>
            {/each}
          </div>

          <div class="mt-6 pt-6 border-t border-zinc-700/50">
            <div class="flex justify-between items-end">
              <span class="text-zinc-400 text-sm uppercase font-semibold tracking-wider">Total CAPEX</span>
              <span class="text-3xl font-bold text-orange-400">{formatPrice(totalCapex)}</span>
            </div>
          </div>
        </div>

        <!-- OPEX Section -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <h2 class="text-white font-semibold text-lg mb-6">Operating Expenditure (OPEX) - Monthly</h2>

          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
                Rent/Space
              
              <input
                type="number"
                bind:value={monthlyRent}
                min="0"
                step="500"
                class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
</label>
            </div>
            <div>
              <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
                Utilities
              
              <input
                type="number"
                bind:value={monthlyUtilities}
                min="0"
                step="500"
                class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
</label>
            </div>
            <div>
              <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
                Labor
              
              <input
                type="number"
                bind:value={monthlyLabor}
                min="0"
                step="500"
                class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
</label>
            </div>
            <div>
              <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
                Ingredients
              
              <input
                type="number"
                bind:value={monthlyIngredients}
                min="0"
                step="500"
                class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
</label>
            </div>
            <div>
              <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
                Packaging
              
              <input
                type="number"
                bind:value={monthlyPackaging}
                min="0"
                step="500"
                class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
</label>
            </div>
            <div>
              <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
                Misc
              
              <input
                type="number"
                bind:value={monthlyMisc}
                min="0"
                step="500"
                class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
</label>
            </div>
          </div>

          <div class="flex justify-between items-end p-4 bg-zinc-700/30 rounded-lg">
            <span class="text-zinc-400 text-sm uppercase font-semibold tracking-wider">Total Monthly OPEX</span>
            <span class="text-3xl font-bold text-orange-400">{formatPrice(totalMonthlyOpex)}</span>
          </div>
        </div>
      </div>

      <!-- Monthly Revenue & Summary -->
      <div class="space-y-6">
        <!-- Revenue Input -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <label class="block text-white font-semibold text-lg mb-4">Projected Monthly Revenue
          <input
            type="number"
            bind:value={monthlyRevenue}
            min="0"
            step="5000"
            class="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-lg focus:outline-none focus:border-orange-500 font-semibold"
          />
</label>
          <p class="text-zinc-400 text-sm mt-2">{formatPrice(monthlyRevenue)}</p>
        </div>

        <!-- CAPEX Summary -->
        <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-6">
          <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Total CAPEX</p>
          <p class="text-3xl font-bold text-blue-400">{formatPrice(totalCapex)}</p>
        </div>

        <!-- Monthly Summary -->
        <div class="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-6">
          <div class="mb-4">
            <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-1">Gross Profit</p>
            <p class="text-2xl font-bold text-green-400">{formatPrice(monthlyGrossProfit)}</p>
            <p class="text-zinc-500 text-xs mt-1">Revenue - Ingredients - Packaging</p>
          </div>
          <div class="pt-4 border-t border-green-500/30">
            <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-1">Net Profit</p>
            <p class={`text-2xl font-bold ${monthlyNetProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPrice(monthlyNetProfit)}
            </p>
            <p class="text-zinc-500 text-xs mt-1">After all OPEX</p>
          </div>
        </div>

        <!-- Break-Even -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Break-Even Timeline</p>
          <p class={`text-3xl font-bold ${breakEvenMonths !== Infinity ? 'text-orange-400' : 'text-red-400'}`}>
            {breakEvenMonths === Infinity ? '∞' : `${breakEvenMonths} months`}
          </p>
          {#if breakEvenMonths !== Infinity}
            <p class="text-zinc-500 text-sm mt-2">
              @ {formatPrice(monthlyNetProfit)}/month profit
            </p>
          {:else}
            <p class="text-zinc-500 text-sm mt-2">Not profitable at current rates</p>
          {/if}
        </div>

        <!-- Key Metrics -->
        <div class="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4 text-sm space-y-2">
          <div class="flex justify-between text-zinc-300">
            <span>Monthly Revenue:</span>
            <span class="text-white font-medium">{formatPrice(monthlyRevenue)}</span>
          </div>
          <div class="flex justify-between text-zinc-300">
            <span>Monthly OPEX:</span>
            <span class="text-white font-medium">{formatPrice(totalMonthlyOpex)}</span>
          </div>
          <div class="flex justify-between text-zinc-300">
            <span>Monthly Net:</span>
            <span class={monthlyNetProfit >= 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
              {formatPrice(monthlyNetProfit)}
            </span>
          </div>
          <div class="flex justify-between text-zinc-300 pt-2 border-t border-zinc-700/50">
            <span>ROI Period:</span>
            <span class="text-white font-medium">
              {breakEvenMonths === Infinity ? '∞' : `${breakEvenMonths} months`}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROI Projection -->
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 mb-12">
      <h2 class="text-white font-semibold text-lg mb-6">ROI Projection (60 months)</h2>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-zinc-700/50">
              <th class="text-left py-2 px-3 text-zinc-400 font-semibold">Month</th>
              <th class="text-right py-2 px-3 text-zinc-400 font-semibold">Cumulative</th>
              <th class="text-left py-2 px-3 text-zinc-400 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {#each roiProjection as row}
              <tr class="border-b border-zinc-700/30 hover:bg-zinc-700/20 transition-colors">
                <td class="py-2 px-3 text-white">{row.month}</td>
                <td class={`py-2 px-3 text-right font-semibold ${row.cumulative >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPrice(row.cumulative)}
                </td>
                <td class="py-2 px-3">
                  <span class={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    row.status === 'Break-even!'
                      ? 'bg-orange-500/30 text-orange-300'
                      : row.status === 'Profitable'
                        ? 'bg-green-500/30 text-green-300'
                        : 'bg-zinc-700/50 text-zinc-300'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-8 border-t border-zinc-700/50 text-center text-xs text-zinc-500">
      <a href="/tools" class="hover:text-zinc-400 transition-colors"
        >Part of ArjoStyle Free Tools →</a
      >
    </div>
  </div>
</div>
