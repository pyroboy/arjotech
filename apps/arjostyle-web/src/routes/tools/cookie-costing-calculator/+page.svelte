<script lang="ts">
  interface Ingredient {
    id: string;
    name: string;
    qty: number;
    unit: 'g' | 'kg' | 'ml' | 'l' | 'pcs';
    pricePerUnit: number;
  }

  interface Margin {
    percent: number;
    sellingPrice: number;
    profitPerPiece: number;
  }

  let ingredients = $state<Ingredient[]>([
    {
      id: '1',
      name: 'Flour',
      qty: 250,
      unit: 'g',
      pricePerUnit: 45 / 1000 // ₱45/kg
    },
    {
      id: '2',
      name: 'Butter',
      qty: 125,
      unit: 'g',
      pricePerUnit: 180 / 250
    },
    {
      id: '3',
      name: 'Sugar',
      qty: 150,
      unit: 'g',
      pricePerUnit: 55 / 1000 // ₱55/kg
    },
    {
      id: '4',
      name: 'Ube Powder',
      qty: 50,
      unit: 'g',
      pricePerUnit: 120 / 100
    },
    {
      id: '5',
      name: 'White Chocolate',
      qty: 100,
      unit: 'g',
      pricePerUnit: 85 / 100
    },
    {
      id: '6',
      name: 'Eggs',
      qty: 2,
      unit: 'pcs',
      pricePerUnit: 8
    }
  ]);

  let batchYield = $state(24);
  let packagingCostPerUnit = $state(5);
  let overheadPercent = $state(10);
  let piecesPerDay = $state(50);

  let nextId = $state(7);

  let totalIngredientCost = $derived.by(() => {
    return ingredients.reduce((sum, ing) => sum + ing.qty * ing.pricePerUnit, 0);
  });

  let costPerPiece = $derived(totalIngredientCost / batchYield);

  let costPerPieceWithPackaging = $derived(costPerPiece + packagingCostPerUnit);

  let overheadCost = $derived(totalIngredientCost * (overheadPercent / 100));

  let costPerPieceWithOverhead = $derived(
    (totalIngredientCost + overheadCost) / batchYield + packagingCostPerUnit
  );

  let margins = $derived.by((): Margin[] => {
    const baseMargins = [30, 50, 70];
    return baseMargins.map((percent) => {
      const sellingPrice = costPerPieceWithOverhead / (1 - percent / 100);
      const profitPerPiece = sellingPrice - costPerPieceWithOverhead;
      return { percent, sellingPrice: Math.round(sellingPrice * 100) / 100, profitPerPiece };
    });
  });

  let monthlyProjection = $derived.by(() => {
    const dailyCost = costPerPieceWithOverhead * piecesPerDay;
    const monthlyCost = dailyCost * 30;

    return margins.map((margin) => {
      const dailyRevenue = margin.sellingPrice * piecesPerDay;
      const monthlyRevenue = dailyRevenue * 30;
      const monthlyProfit = monthlyRevenue - monthlyCost;

      return {
        margin: margin.percent,
        monthlyRevenue,
        monthlyCost,
        monthlyProfit
      };
    });
  });

  function addIngredient() {
    ingredients.push({
      id: String(nextId++),
      name: '',
      qty: 0,
      unit: 'g',
      pricePerUnit: 0
    });
    ingredients = ingredients;
  }

  function removeIngredient(id: string) {
    ingredients = ingredients.filter((ing) => ing.id !== id);
  }

  function formatPrice(price: number): string {
    return price.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
</script>

<svelte:head>
  <title>Cookie Costing Calculator — ArjoStyle Free Tools</title>
  <meta
    name="description"
    content="Free cookie and baked goods costing calculator. Calculate ingredient costs, pricing, profit margins, and monthly projections."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 pt-20 pb-16 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">Cookie Costing Calculator</h1>
      <p class="text-zinc-400 text-lg">Calculate costs, pricing, and profit margins for your baked goods</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8 mb-12">
      <!-- Ingredients Input -->
      <div class="lg:col-span-2">
        <!-- Ingredients Section -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-white font-semibold text-lg">Ingredients</h2>
            <button
              onclick={addIngredient}
              class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all"
            >
              + Add Ingredient
            </button>
          </div>

          <div class="space-y-3 max-h-96 overflow-y-auto">
            {#each ingredients as ingredient (ingredient.id)}
              <div class="flex gap-3 items-end">
                <input
                  type="text"
                  placeholder="Name"
                  bind:value={ingredient.name}
                  class="flex-1 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  bind:value={ingredient.qty}
                  class="w-20 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                />
                <select
                  bind:value={ingredient.unit}
                  class="w-20 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="pcs">pcs</option>
                </select>
                <input
                  type="number"
                  placeholder="Price/unit"
                  bind:value={ingredient.pricePerUnit}
                  class="w-24 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500"
                />
                <span class="text-zinc-400 text-sm">
                  {formatPrice(ingredient.qty * ingredient.pricePerUnit)}
                </span>
                <button
                  onclick={() => removeIngredient(ingredient.id)}
                  class="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-all"
                >
                  Remove
                </button>
              </div>
            {/each}
          </div>
        </div>

        <!-- Recipe Parameters -->
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
            <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
              Batch Yield
            
            <input
              type="number"
              bind:value={batchYield}
              min="1"
              class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
</label>
            <p class="text-zinc-500 text-xs mt-2">pieces per batch</p>
          </div>

          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
            <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
              Packaging Cost/Unit
            
            <input
              type="number"
              bind:value={packagingCostPerUnit}
              min="0"
              step="0.5"
              class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
</label>
            <p class="text-zinc-500 text-xs mt-2">{formatPrice(packagingCostPerUnit)}</p>
          </div>

          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
            <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
              Overhead %
            
            <input
              type="number"
              bind:value={overheadPercent}
              min="0"
              max="100"
              class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
</label>
            <p class="text-zinc-500 text-xs mt-2">{overheadPercent}%</p>
          </div>
        </div>
      </div>

      <!-- Cost Summary -->
      <div class="space-y-4">
        <div class="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
          <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
            Total Ingredient Cost
          </p>
          <p class="text-3xl font-bold text-orange-400 mb-4">{formatPrice(totalIngredientCost)}</p>
          <p class="text-zinc-400 text-sm">for {batchYield} pieces</p>
        </div>

        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <div class="mb-4">
            <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-1">Cost/Piece</p>
            <p class="text-2xl font-bold text-white">{formatPrice(costPerPiece)}</p>
          </div>
          <div class="pt-4 border-t border-zinc-700/50">
            <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-1">
              Cost/Piece + Packaging + OH
            </p>
            <p class="text-2xl font-bold text-white">{formatPrice(costPerPieceWithOverhead)}</p>
          </div>
        </div>

        <div class="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4 text-sm space-y-2">
          <div class="flex justify-between text-zinc-300">
            <span>Batch Yield:</span>
            <span class="text-white font-medium">{batchYield} pcs</span>
          </div>
          <div class="flex justify-between text-zinc-300">
            <span>Packaging:</span>
            <span class="text-white font-medium">{formatPrice(packagingCostPerUnit)}</span>
          </div>
          <div class="flex justify-between text-zinc-300">
            <span>Overhead:</span>
            <span class="text-white font-medium">{overheadPercent}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Margin Analysis -->
    <div class="mb-12">
      <h2 class="text-white font-semibold text-2xl mb-6">Margin Analysis</h2>
      <div class="grid md:grid-cols-3 gap-6">
        {#each margins as margin}
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
            <div class="mb-4">
              <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
                {margin.percent}% Margin
              </p>
              <p class="text-2xl font-bold text-orange-400">{formatPrice(margin.sellingPrice)}</p>
              <p class="text-zinc-500 text-sm mt-1">selling price per piece</p>
            </div>
            <div class="pt-4 border-t border-zinc-700/50">
              <p class="text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-1">Profit</p>
              <p class="text-xl font-bold text-white">{formatPrice(margin.profitPerPiece)}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Daily Sales Input -->
    <div class="mb-12">
      <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 max-w-md">
        <label class="block text-white font-semibold text-lg mb-4">Monthly Projection
        <input
          type="number"
          placeholder="pieces per day"
          bind:value={piecesPerDay}
          min="1"
          class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500 mb-2"
        />
</label>
        <p class="text-zinc-400 text-sm">Calculating for {piecesPerDay} pieces/day</p>
      </div>
    </div>

    <!-- Monthly Projections -->
    <div>
      <h2 class="text-white font-semibold text-2xl mb-6">Monthly Projections ({piecesPerDay} pcs/day)</h2>
      <div class="grid md:grid-cols-3 gap-6">
        {#each monthlyProjection as proj}
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
            <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-4">
              {proj.margin}% Margin
            </p>
            <div class="space-y-3">
              <div>
                <p class="text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-1">Monthly Revenue</p>
                <p class="text-xl font-bold text-green-400">{formatPrice(proj.monthlyRevenue)}</p>
              </div>
              <div>
                <p class="text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-1">Monthly Cost</p>
                <p class="text-xl font-bold text-red-400">{formatPrice(proj.monthlyCost)}</p>
              </div>
              <div class="pt-3 border-t border-zinc-700/50">
                <p class="text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-1">Monthly Profit</p>
                <p class="text-2xl font-bold text-orange-400">{formatPrice(proj.monthlyProfit)}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 pt-8 border-t border-zinc-700/50 text-center text-xs text-zinc-500">
      <a href="/tools" class="hover:text-zinc-400 transition-colors"
        >Part of ArjoStyle Free Tools →</a
      >
    </div>
  </div>
</div>
