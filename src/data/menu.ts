/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // --- SIGNATURE SPECIAL ---
  {
    id: 'f-bahubali',
    name: 'Bahubali Falooda',
    price: 150,
    category: 'falooda',
    description: 'Our legendary, extra-large royal signature falooda. Layered with saffron milk, sweet basil seeds, premium dry fruits, chunks of rich kulfi, mango pulp, and topped with multi-flavored ice cream scoops.',
    isSpecial: true,
    isPopular: true,
    tags: ['Signature', 'Royal Feast', 'Best Seller'],
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80'
  },

  // --- FALOODA ITEMS ---
  {
    id: 'f-dryfruit',
    name: 'Dry Fruit Falooda',
    price: 100,
    category: 'falooda',
    description: 'A luxurious treats loaded with dynamic layers of chopped almonds, cashews, pistachios, and raisins in sweetened rose-infused milk.',
    isPopular: true,
    tags: ['Rich Nuts', 'Classic'],
    image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-mango',
    name: 'Mango Falooda',
    price: 100,
    category: 'falooda',
    description: 'Fresh mango pulp combined with vermicelli, rose syrup, and creamy milk, topped with rich mango ice cream.',
    tags: ['Fruity', 'Seasonal Favorite'],
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-gulabjam',
    name: 'Gulabjam Falooda',
    price: 120,
    category: 'falooda',
    description: 'An ultimate fusion dessert where soft, warm Gulab Jamuns meet chilled, rose-scented vermicelli and ice cream.',
    isPopular: true,
    tags: ['Fusion Special', 'Sweet Indulgence'],
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-kulfi',
    name: 'Kulfi Falooda',
    price: 120,
    category: 'falooda',
    description: 'Traditional malai kulfi slices served over a bed of vermicelli, basil seeds, sweet rose milk, and dry fruits.',
    tags: ['Traditional'],
    image: 'https://images.unsplash.com/photo-1505394033343-40a690728743?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-kova',
    name: 'Kova Falooda',
    price: 120,
    category: 'falooda',
    description: 'Enriched with premium sweet khoya (kova) chunks, providing an incredibly rich and dairy-centric texture.',
    tags: ['Extra Creamy'],
    image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-oreo',
    name: 'Oreo Falooda',
    price: 120,
    category: 'falooda',
    description: 'A modern twist featuring crushed Oreo cookies, chocolate sauce, milk, and chocolate-chip-vanilla cream layers.',
    tags: ['Kids Choice', 'Chocolatey'],
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-fruitpunch',
    name: 'Fruit Punch Falooda',
    price: 120,
    category: 'falooda',
    description: 'An assortment of fresh mixed fruits layered with sabja, vermicelli, fruit syrups, and strawberry-mango ice cream scoops.',
    tags: ['Refreshing', 'Fruity'],
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-blackcurrent',
    name: 'Black Current Falooda',
    price: 110,
    category: 'falooda',
    description: 'Exotic blackcurrant syrup, sweet basil seeds, soft vermicelli, topped with blackcurrant berry ice cream.',
    tags: ['Tangy & Sweet'],
    image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-chocolate',
    name: 'Chocolate Falooda',
    price: 120,
    category: 'falooda',
    description: 'Heavenly layers of rich Belgian chocolate syrup, chocolate milk, choco-chips, and dual scoops of chocolate ice cream.',
    tags: ['Chocolate Lover'],
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-americandry',
    name: 'American Dry Fruit Falooda',
    price: 120,
    category: 'falooda',
    description: 'Inspired by Western sundaes, loaded with assorted caramelized nuts, fig-honey syrup, and premium vanilla fudge.',
    tags: ['Exotic Nuts'],
    image: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-caramel',
    name: 'Caramel Falooda',
    price: 120,
    category: 'falooda',
    description: 'Silky smooth golden caramel sauce drizzled over vermicelli, sweet milk, and butterscotch crunch ice cream.',
    tags: ['Sweet Caramel'],
    image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-blackforest',
    name: 'Black Forest Falooda',
    price: 120,
    category: 'falooda',
    description: 'Deconstructed black forest cake layer paired with cherry compote, chocolate flakes, and whipped cream topping.',
    tags: ['Dessert Fusion'],
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-italianbounty',
    name: 'Italian Bounty Falooda',
    price: 120,
    category: 'falooda',
    description: 'Inspired by Italian confectionery, loaded with coconut flakes, premium dark chocolate drizzle, and coconut ice cream.',
    tags: ['Coconut & Choco'],
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'f-familypack',
    name: 'Family Pack Falooda',
    price: 180,
    category: 'falooda',
    description: 'Our jumbo sharing portion loaded with multiple layers of fruit, nuts, and three jumbo ice cream scoops. Perfect for 2-3 people!',
    isSpecial: true,
    tags: ['Jumbo Shareable', 'Feast'],
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80'
  },

  // --- ICE CREAMS ---
  {
    id: 'ic-double',
    name: 'Double Ice Cream',
    price: 70,
    category: 'icecream',
    description: 'Two generous scoops of your choice from our classic flavor cabinet (Vanilla, Strawberry, Chocolate).',
    tags: ['Classic Double'],
    image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-dryfruit',
    name: 'Dry Fruit Ice Cream',
    price: 80,
    category: 'icecream',
    description: 'Premium ice cream scoop infused with rich pieces of almonds, cashews, raisins, and a hint of saffron.',
    isPopular: true,
    tags: ['Nutty Scoop'],
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-blackcurrent',
    name: 'Black Current Ice Cream',
    price: 90,
    category: 'icecream',
    description: 'Rich, purple berry-flavored scoop studded with soft blackcurrant raisins.',
    tags: ['Berry Delight'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-chocolate',
    name: 'Chocolate Ice Cream',
    price: 90,
    category: 'icecream',
    description: 'Deep, rich cocoa ice cream scoop drizzled with luscious chocolate fudge sauce.',
    tags: ['Timeless'],
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-fruitpunch',
    name: 'Fruit Punch Ice Cream',
    price: 100,
    category: 'icecream',
    description: 'A multi-colored scoop packed with natural fruit extracts and candied tutti-frutti pieces.',
    tags: ['Colorful'],
    image: 'https://images.unsplash.com/photo-1517093602195-b40af9688b46?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-gulabjam',
    name: 'Gulabjam Ice Cream',
    price: 100,
    category: 'icecream',
    description: 'A delightful vanilla-based scoop packed with sweet crushed bits of direct festive Gulab Jamun.',
    isPopular: true,
    tags: ['Desi Twist'],
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-caramel',
    name: 'Caramel Ice Cream',
    price: 100,
    category: 'icecream',
    description: 'Buttery caramel ice cream swirl with a touch of sea salt and dynamic caramel drizzle.',
    tags: ['Sweet Swirl'],
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-americandry',
    name: 'American Dry Fruit Ice Cream',
    price: 100,
    category: 'icecream',
    description: 'Rich creamy base packed with imported pecans, almonds, and sweet golden honey ribbon.',
    tags: ['Premium Scoop'],
    image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-italianbounty',
    name: 'Italian Bounty Ice Cream',
    price: 100,
    category: 'icecream',
    description: 'Shredded coconut ice cream base combined with dark chocolate crunchies.',
    tags: ['Tropical Dream'],
    image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-honeycake',
    name: 'Honey Cake Ice Cream',
    price: 100,
    category: 'icecream',
    description: 'Infused with soft crumbs of golden honey sponge cake and raspberry preserve ribbons.',
    tags: ['Cake Flavor'],
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ic-blackforest',
    name: 'Black Forest Ice Cream',
    price: 100,
    category: 'icecream',
    description: 'Chocolate ice cream base swirled with dark cherries and sponge cake chunks.',
    tags: ['Choco Cherry'],
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80'
  },

  // --- BEVERAGES & LASSI ---
  {
    id: 'b-spbadampalu',
    name: 'Special Badam Palu',
    price: 70,
    category: 'beverages',
    description: 'Our house-special thick almond milk slow-cooked with pure saffron, crushed cardamom, and generous almond flakes.',
    isPopular: true,
    tags: ['Chef Special', 'Warm or Chilled'],
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b-badampalu',
    name: 'Badam Palu',
    price: 40,
    category: 'beverages',
    description: 'Classic chilled almond milk sweetened to perfection and flavored with real cardamom.',
    tags: ['Refreshing Drink'],
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b-dryfruitlassi',
    name: 'Dry Fruit Lassi',
    price: 60,
    category: 'beverages',
    description: 'Thick, creamy churned yogurt lassi topped with a premium assortment of dry fruits and honey.',
    isPopular: true,
    tags: ['Creamy yogurt', 'Healthy'],
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b-lassi',
    name: 'Sweet Lassi',
    price: 30,
    category: 'beverages',
    description: 'Traditional Punjabi sweet lassi, thick, chilled, and served with a layer of cream (malai) on top.',
    tags: ['Summer Savior'],
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b-sabjalassi',
    name: 'Sabja Lassi',
    price: 40,
    category: 'beverages',
    description: 'Traditional sweet lassi infused with cooling organic sweet basil seeds (sabja) for extra wellness benefits.',
    tags: ['Cooling Herbs'],
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b-gheepayasam',
    name: 'Ghee Payasam',
    price: 40,
    category: 'beverages',
    description: 'A rich rice-and-milk pudding sweetened with jaggery, flavored with cardamom, and roasted in pure cow ghee.',
    tags: ['Traditional Sweet'],
    image: 'https://images.unsplash.com/photo-1505394033343-40a690728743?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b-buttermilk',
    name: 'Spiced Butter Milk',
    price: 10,
    category: 'beverages',
    description: 'Thin, refreshing yogurt beverage mixed with fresh coriander, ginger, green chilies, and salt.',
    tags: ['Savory', 'Digestion Friend'],
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b-jeerabuttermilk',
    name: 'Jeera Butter Milk',
    price: 10,
    category: 'beverages',
    description: 'Savory chilled buttermilk seasoned with roasted cumin powder (jeera) and black salt for instant hydration.',
    tags: ['Savory', 'Hydration'],
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=500&q=80'
  }
];
