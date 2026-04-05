<script lang="ts">
  interface Ingredient {
    id: string;
    name: string;
    qty: number;
    cost: number;
  }

  interface SilogVariant {
    name: string;
    ingredients: Omit<Ingredient, 'id'>[];
    defaultPrice: number;
  }

  const variants: Record<string, SilogVariant> = {
    Tapsilog: {
      name: 'Tapsilog',
      ingredients: [
        { name: 'Beef Tapa', qty: 100, cost: 15 },
        { name: 'Garlic', qty: 10, cost: 1 },
        { name: 'Oil for cooking', qty: 15, cost: 2 }
      ],
      defaultPrice: 55
    },
    Longsilog: {
      name: 'Longsilog',
      ingredients: [
        { name: 'Longganisa', qty: 80, cost: 12 },
        { name: 'Garlic', qty: 10, cost: 1 },
        { name: 'Oil for cooking', qty: 15, cost: 2 }
      ],
      defaultPrice: 50
    },
    Chicksilog: {
      name: 'Chicksilog',
      ingredients: [
        { name: 'Chicken (cooked)', qty: 100, cost: 10 },
        { name: 'Garlic', qty: 10, cost: 1 },
        { name: 'Oil for cooking', qty: 15, cost: 2 }
      ],
      defaultPrice: 50
    },
    Sisigsilog: {
      name: 'Sisigsilog',
      ingredients: [
        { name: 'Pork Sisig', qty: 150, cost: 18 },
        { name: 'Liver spread', qty: 30, cost: 3 },
        { name: 'Oil for cooking', qty: 15, cost: 2 }
      ],
      defaultPrice: 60
    },
    Burgersilog: {
      name: 'Burgersilog',
      ingredients: [
        { name: 'Beef patty', qty: 100, cost: 14 },
        { name: 'Burger bun', qty: 60, cost: 5 },
        { name: 'Condiments', qty: 20, cost: 2 }
      ],
      defaultPrice: 55
    },
    Bagnetsilog: {
      name: 'Bagnetsilog',
      ingredients: [
        { name: 'Bagnet', qty: 120, cost: 18 },
        { name: 'Garlic', qty: 10, cost: 1 },
        { name: 'Oil for cooking', qty: 15, cost: 2 }
      ],
      defaultPrice: 65
    },
    Custom: {
      name: 'Custom',
      ingredients: [],
      defaultPrice: 50
    }
  };

  // Base silog cost (rice + egg + oil + seasoning)
  const baseSilogCost = 21;

  let selectedVariant = $state<keyof typeof variants>('Tapsilog');
  let sellingPrice = $state(55);
  let servingsPerDay = $state(30);
  let monthlyRent = $state(5000);
  let monthlyUtilities = $state(2000);
  let monthlyLabor = $state(15000);
  let monthlyMisc = $state(1000);
  let nextId = $state(1);

  let currentIngredients = $state<Ingredient[]>([
    { id: '0', name: 'Beef Tapa', qty: 100, cost: 15 },
    { id: '1', name: 'Garlic', qty: 10, cost: 1 },
    { id: '2', name: 'Oil for cooking', qty: 15, cost: 2 }
  ]);

  function changeVariant(variant: keyof typeof variants) {
    selectedVariant = variant;
    const variantData = variants[variant];
    sellingPrice = variantData.defaultPrice;

    if (variant === 'Custom') {
      currentIngredients = [];
      nextId = 1;
    } else {
      currentIngredients = variantData.ingredients.map((ing, i) => ({
        id: String(i),
        ...ing
      }));
      nextId = currentIngredients.length;
    }
  }

  let ingredientsCost = $derived.by(() => {
    return currentIngredients.reduce((sum, ing) => sum + ing.cost, 0);
  });

  let totalCostPerServing = $derived(baseSilogCost + ingredientsCost);

  let profitPerServing = $derived(sellingPrice - totalCostPerServing);

  let marginPercent = $derived(
    totalCostPerServing > 0 ? Math.round(((profitPerServing / sellingPrice) * 100 * 100) / 100) : 0
  );

  let dailyProfit = $derived(profitPerServing * servingsPerDay);

  let monthlyExpenses = $derived(monthlyRent + monthlyUtilities + monthlyLabor + monthlyMisc);

  let monthlyRevenue = $derived(sellingPrice * servingsPerDay * 30);

  let monthlyProfit = $derived(monthlyRevenue - monthlyExpenses - ingredientsCost * servingsPerDay * 30);

  let breakEvenServings = $derived.by(() => {
    if (profitPerServing <= 0) return Infinity;
    return Math.ceil(monthlyExpenses / profitPerServing);
  });

  let breakEvenServingsPerDay = $derived(Math.ceil(breakEvenServings / 30));

  function addIngredient() {
    currentIngredients.push({
      id: String(nextId++),
      name: '',
      qty: 0,
      cost: 0
    });
    currentIngredients = currentIngredients;
  }

  function removeIngredient(id: string) {
    currentIngredients = currentIngredients.filter((ing) => ing.id !== id);
  }

  function formatPrice(price: number): string {
    return price.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  function formatPriceDecimal(price: number): string {
    return price.toLocaleString('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
</script>

<svelte:head>
  <title>Silog Profit Calculator — ArjoStyle Free Tools</title>
  <meta
    name="description"
    content="Free silog menu profit calculator. Calculate ingredient costs, selling prices, daily and monthly profit, and break-even analysis."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 pt-20 pb-16 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">Silog Profit Calculator</h1>
      <p class="text-zinc-400 text-lg">Calculate costs, pricing, and profits for your silog menu</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8 mb-12">
      <!-- Variant & Ingredients -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Variant Selector -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <h2 class="text-white font-semibold text-lg mb-4">Silog Variant</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            {#each Object.keys(variants) as variant}
              <button
                onclick={() => changeVariant(variant as keyof typeof variants)}
                class="py-2 px-3 rounded-lg text-sm font-medium transition-all {selectedVariant === variant
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700'}"
              >
                {variant}
              </button>
            {/each}
          </div>
        </div>

        <!-- Ingredients Editor -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-white font-semibold text-lg">Ingredients (excluding rice & egg)</h2>
            {#if selectedVariant === 'Custom'}
              <button
                onclick={addIngredient}
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all"
              >
                + Add
              </button>
            {/if}
          </div>

          <div class="space-y-3">
            {#each currentIngredients as ingredient (ingredient.id)}
              <div class="flex gap-3 items-end">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  bind:value={ingredient.name}
                  disabled={selectedVariant !== 'Custom'}
                  class="flex-1 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  bind:value={ingredient.qty}
                  disabled={selectedVariant !== 'Custom'}
                  class="w-20 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <input
                  type="number"
                  placeholder="Cost"
                  bind:value={ingredient.cost}
                  disabled={selectedVariant !== 'Custom'}
                  step="0.5"
                  class="w-24 px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {#if selectedVariant === 'Custom'}
                  <button
                    onclick={() => removeIngredient(ingredient.id)}
                    class="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-all"
                  >
                    Remove
                  </button>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Base Silog Breakdown -->
          <div class="mt-6 pt-6 border-t border-zinc-700/50">
            <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-3">
              Base Silog (included in all variants)
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p class="text-zinc-500">Rice</p>
                <p class="text-white font-medium">₱8</p>
              </div>
              <div>
                <p class="text-zinc-500">Egg</p>
                <p class="text-white font-medium">₱8</p>
              </div>
              <div>
                <p class="text-zinc-500">Oil</p>
                <p class="text-white font-medium">₱3</p>
              </div>
              <div>
                <p class="text-zinc-500">Seasoning</p>
                <p class="text-white font-medium">₱2</p>
              </div>
            </div>
            <p class="text-orange-400 font-semibold mt-2">Total: {formatPrice(baseSilogCost)}/serving</p>
          </div>
        </div>

        <!-- Selling Price -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <label for="selling-price" class="block text-white font-semibold text-lg mb-4">Selling Price</label>
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <input
                id="selling-price"
                type="number"
                bind:value={sellingPrice}
                step="5"
                class="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white text-lg focus:outline-none focus:border-orange-500 font-semibold"
              />
            </div>
            <p class="text-2xl font-bold text-orange-400">{formatPrice(sellingPrice)}</p>
          </div>
        </div>
      </div>

      <!-- Cost & Profit Summary -->
      <div class="space-y-4">
        <div class="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
          <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Total Cost/Serving</p>
          <p class="text-3xl font-bold text-orange-400">{formatPrice(totalCostPerServing)}</p>
          <p class="text-zinc-400 text-sm mt-2">
            Base ₱{baseSilogCost} + Ingredients ₱{ingredientsCost}
          </p>
        </div>

        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <div class="mb-4">
            <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-1">Profit/Serving</p>
            <p class="text-2xl font-bold text-white">{formatPrice(profitPerServing)}</p>
          </div>
          <div class="pt-4 border-t border-zinc-700/50">
            <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-1">Margin %</p>
            <p class="text-2xl font-bold text-white">{marginPercent}%</p>
          </div>
        </div>

        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Daily Profit</p>
          <p class="text-2xl font-bold text-green-400">{formatPrice(dailyProfit)}</p>
          <p class="text-zinc-500 text-sm mt-2">@ {servingsPerDay} servings/day</p>
        </div>

        <div class="bg-zinc-800/30 border border-zinc-700/50 rounded-lg p-4 text-sm space-y-2">
          <div class="flex justify-between text-zinc-300">
            <span>Selling Price:</span>
            <span class="text-white font-medium">{formatPrice(sellingPrice)}</span>
          </div>
          <div class="flex justify-between text-zinc-300">
            <span>Total Cost:</span>
            <span class="text-white font-medium">{formatPrice(totalCostPerServing)}</span>
          </div>
          <div class="flex justify-between text-zinc-300">
            <span>Profit:</span>
            <span class="text-white font-medium">{formatPrice(profitPerServing)}</span>
          </div>
          <div class="flex justify-between text-zinc-300">
            <span>Margin:</span>
            <span class="text-white font-medium">{marginPercent}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Input -->
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 mb-12">
      <h2 class="text-white font-semibold text-lg mb-6">Daily & Monthly Projections</h2>
      <div class="grid md:grid-cols-5 gap-4">
        <div>
          <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
            Servings/Day
          
          <input
            type="number"
            bind:value={servingsPerDay}
            min="1"
            class="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
          />
</label>
        </div>
      </div>
    </div>

    <!-- Monthly Expenses -->
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6 mb-12">
      <h2 class="text-white font-semibold text-lg mb-6">Monthly Operating Expenses</h2>
      <div class="grid md:grid-cols-5 gap-4">
        <div>
          <label class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
            Rent
          
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
        <div>
          <span class="block text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">
            Total
          </span>
          <div class="px-4 py-2 bg-zinc-700/20 border border-zinc-600 rounded-lg text-white font-semibold">
            {formatPrice(monthlyExpenses)}
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Projections -->
    <div class="grid md:grid-cols-3 gap-6 mb-12">
      <div class="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-6">
        <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Monthly Revenue</p>
        <p class="text-3xl font-bold text-green-400 mb-2">{formatPrice(monthlyRevenue)}</p>
        <p class="text-zinc-400 text-sm">{servingsPerDay} servings × 30 days</p>
      </div>

      <div class="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-lg p-6">
        <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Monthly Expenses</p>
        <p class="text-3xl font-bold text-red-400 mb-2">{formatPrice(monthlyExpenses + ingredientsCost * servingsPerDay * 30)}</p>
        <p class="text-zinc-400 text-sm">Fixed + Variable costs</p>
      </div>

      <div class="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
        <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Monthly Profit</p>
        <p class="text-3xl font-bold text-orange-400">{formatPrice(monthlyProfit)}</p>
        <p class="text-zinc-400 text-sm">After all expenses</p>
      </div>
    </div>

    <!-- Break-Even Analysis -->
    <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
      <h2 class="text-white font-semibold text-lg mb-6">Break-Even Analysis</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div>
          <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Servings Needed/Month</p>
          <p class="text-2xl font-bold text-white">{breakEvenServings.toLocaleString('en-PH')}</p>
        </div>
        <div>
          <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Servings/Day Needed</p>
          <p class="text-2xl font-bold text-white">{breakEvenServingsPerDay}</p>
        </div>
        <div>
          <p class="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-2">Current Daily Sales</p>
          <p class={`text-2xl font-bold ${servingsPerDay >= breakEvenServingsPerDay ? 'text-green-400' : 'text-orange-400'}`}>
            {servingsPerDay}
          </p>
          <p class="text-xs text-zinc-400 mt-1">
            {#if servingsPerDay >= breakEvenServingsPerDay}
              ✓ Above break-even
            {:else}
              Need {breakEvenServingsPerDay - servingsPerDay} more
            {/if}
          </p>
        </div>
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
