import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/db';
import { marketingContent } from '$lib/db/schema';

// AI content generation endpoint
// This generates captions and image prompts using templates
// Actual image generation would be handled by an external service (n8n webhook, Replicate, etc.)
export const POST: RequestHandler = async ({ request, platform }) => {
  const db = getDb(platform?.env ?? {});
  const body = await request.json();

  const { business, contentType, platform: targetPlatform, pipelineStage, menuItem, promoDetails, templateOverride } = body;

  // Build content based on type
  let title = '';
  let caption = '';
  let imagePrompt = '';
  let hashtags: string[] = [];

  const businessNames: Record<string, string> = {
    silog: "Kuya's Silog & Lugaw",
    sweetytreats: 'SweetyTreats',
    foodhub: 'FoodHub',
    dorm: 'Dorm Living',
    arjostyle: 'ArjoStyle'
  };

  const biz = businessNames[business] || business;

  if (contentType === 'menu_image') {
    title = `${menuItem?.name || 'Featured Item'} — ${biz}`;
    caption = templateOverride || generateMenuCaption(business, menuItem, targetPlatform);
    imagePrompt = generateMenuImagePrompt(business, menuItem);
    hashtags = generateHashtags(business, 'menu');
  } else if (contentType === 'promo_graphic') {
    title = `${promoDetails?.title || 'Special Promo'} — ${biz}`;
    caption = templateOverride || generatePromoCaption(business, promoDetails, targetPlatform);
    imagePrompt = generatePromoImagePrompt(business, promoDetails);
    hashtags = generateHashtags(business, 'promo');
  } else if (contentType === 'social_caption') {
    title = `Daily Post — ${biz}`;
    caption = templateOverride || generateDailyCaption(business, targetPlatform, pipelineStage);
    hashtags = generateHashtags(business, 'daily');
  } else if (contentType === 'story_post') {
    title = `Story — ${biz}`;
    caption = generateStoryCaption(business);
    hashtags = generateHashtags(business, 'story');
  }

  // Save as draft
  const [created] = await db.insert(marketingContent).values({
    business,
    contentType,
    platform: targetPlatform,
    pipelineStage: pipelineStage || 'awareness',
    status: 'generated',
    title,
    caption,
    imagePrompt,
    hashtags,
    aiModel: 'template-v1',
    aiPromptUsed: JSON.stringify(body),
  }).returning();

  return json(created, { status: 201 });
};

// ── Template generators ──────────────────────────────────────────────────────

function generateMenuCaption(business: string, item: any, platform: string): string {
  const name = item?.name || 'our bestseller';
  const price = item?.price || '';
  const priceStr = price ? ` for just ₱${price}` : '';

  const templates: Record<string, string[]> = {
    silog: [
      `🍳 ${name}${priceStr}! Walang tatalo sa lasa at presyo. Open kami buong araw hanggang madaling araw!\n\n📍 Maria Clara St.\n💬 DM para sa orders!`,
      `Gutom na? Try our ${name}${priceStr} — perfect na perfect pang-lunch, meryenda, o midnight snack! 🔥\n\n#KuyasSilog #SilogNation`,
      `${name} alert! 🚨${priceStr}\nAbot-kaya, masarap, at busog ka talaga.\n\n📍 Maria Clara St. | Open daily`,
    ],
    sweetytreats: [
      `🍰 ${name}${priceStr} — freshly made with love!\nPerfect for any occasion. Order now!\n\n💬 DM or call to order`,
      `Sweet tooth calling? Our ${name} is here${priceStr}! 😍\nMade fresh daily. Limited slots available!\n\n#SweetyTreats #HomemadeGoodness`,
    ],
    foodhub: [
      `🍽️ ${name}${priceStr} — available now at FoodHub!\nMultiple flavors, one destination.\n\nVisit us today!`,
    ],
  };

  const options = templates[business] || templates.silog;
  return options[Math.floor(Math.random() * options.length)];
}

function generateMenuImagePrompt(business: string, item: any): string {
  const name = item?.name || 'Filipino comfort food';
  const style = item?.style || 'overhead food photography';

  const prompts: Record<string, string> = {
    silog: `Professional food photography of ${name}, Filipino silog meal with garlic rice and sunny-side egg, orange and black brand colors, clean white plate, steam rising, ${style}, warm lighting, appetizing, 4K quality, dark wood table background`,
    sweetytreats: `Professional dessert photography of ${name}, pastel colors, elegant plating, soft natural lighting, ${style}, bokeh background, Instagram-worthy, 4K quality`,
    foodhub: `Professional food court photography of ${name}, vibrant colors, casual dining atmosphere, ${style}, warm lighting, 4K quality`,
  };

  return prompts[business] || prompts.silog;
}

function generatePromoCaption(business: string, promo: any, platform: string): string {
  const title = promo?.title || 'Special Promo';
  const discount = promo?.discount || '';
  const validUntil = promo?.validUntil || '';

  return `🔥 ${title}! ${discount ? discount + ' OFF ' : ''}${validUntil ? `Valid until ${validUntil}` : 'Limited time only!'}\n\nDon't miss out! Tag someone who needs to see this! 👇\n\n📍 Visit us today!`;
}

function generatePromoImagePrompt(business: string, promo: any): string {
  const title = promo?.title || 'Special Promotion';
  return `Professional promotional graphic for ${title}, ${business} food brand, bold typography, orange and black color scheme, eye-catching design, social media post format, clean modern layout`;
}

function generateDailyCaption(business: string, platform: string, stage: string): string {
  const dailyTemplates: Record<string, string[]> = {
    silog: [
      '🌅 Good morning, Tagbilaran! Anong silog mo today?\n\nBukas na kami! Tara kain! 🍳',
      'Monday mood: Tapsilog + Kape = Perfect combo ☕🍳\n\nStart your week right! Open na kami.',
      'Late night cravings? We got you! 🌙\nOpen hanggang madaling araw.\n\n#MidnightSilog #KuyasSilog',
      'Payday treat! Extra rice libre today! 🎉\nCelebrate with your favorite silog.\n\n📍 Maria Clara St.',
    ],
    sweetytreats: [
      '🎂 Start your day sweet! Fresh baked goods available now.\nOrder before 12nn for same-day delivery!',
      'Weekend treat loading... 🍰\nWhat flavor are you craving today?\n\nComment below! 👇',
    ],
  };

  const options = dailyTemplates[business] || dailyTemplates.silog;
  return options[Math.floor(Math.random() * options.length)];
}

function generateStoryCaption(business: string): string {
  const storyTemplates = [
    '📸 Behind the scenes today!',
    '🔥 Fresh batch coming out!',
    '👨‍🍳 Cooking in progress...',
    '📦 Orders ready for pickup!',
    '⭐ Customer review of the day!',
  ];
  return storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
}

function generateHashtags(business: string, type: string): string[] {
  const base: Record<string, string[]> = {
    silog: ['#KuyasSilog', '#SilogStation', '#MariaClaraSt', '#Tagbilaran', '#BoholFood', '#SilogLover', '#FilipinoFood', '#AffordableMeals'],
    sweetytreats: ['#SweetyTreats', '#HomeBaked', '#DessertLovers', '#Tagbilaran', '#BoholSweets', '#CakesOfBohol'],
    foodhub: ['#FoodHub', '#FoodCourt', '#Tagbilaran', '#BoholEats'],
    dorm: ['#DormLiving', '#StudentLife', '#Tagbilaran', '#AffordableDorm'],
    arjostyle: ['#ArjoStyle', '#TattooArtist', '#Bohol', '#InkLife'],
  };

  const typeSpecific: Record<string, string[]> = {
    menu: ['#FoodPorn', '#Yummy', '#FoodPhotography'],
    promo: ['#PromoAlert', '#LimitedTime', '#DealOfTheDay'],
    daily: ['#DailyPost', '#FoodOfTheDay'],
    story: ['#BTS', '#BehindTheScenes'],
  };

  return [...(base[business] || base.silog).slice(0, 5), ...(typeSpecific[type] || [])];
}
