'use strict';

const menu = [
  {
    id: 1,
    category: 'signature',
    name: 'Ultrasonic Geisha Cold Extract',
    description: 'Panamanian Geisha extracted via high-frequency waves. Notes of jasmine blossom and white peach.',
    price: 14,
    tag: 'Micro-Lot',
  },
  {
    id: 2,
    category: 'signature',
    name: 'Obsidian Glacial Drip',
    description: 'Slow-steeped over 24 hours with glacial mineral water and organic cacao husks.',
    price: 10.5,
    tag: 'Popular',
  },
  {
    id: 3,
    category: 'molecular',
    name: 'Cryo Espresso Orb',
    description: 'Flash-frozen ristretto sphere suspended in raw coconut blossom water that dissolves on your palate.',
    price: 15,
    tag: 'Molecular',
  },
  {
    id: 4,
    category: 'molecular',
    name: 'Cascara Yuzu Nitro Fizz',
    description: 'High-pressure nitrogen infused coffee cherry husk tea topped with fresh yuzu foam.',
    price: 11,
    tag: 'Refreshing',
  },
  {
    id: 5,
    category: 'botanical',
    name: 'Lavender Cedar Tonic',
    description: 'Cold brew concentrate infused with organic mountain lavender tincture and cedar bark essence.',
    price: 12,
    tag: 'Botanical',
  },
  {
    id: 6,
    category: 'botanical',
    name: 'Cardamom Saffron Elixir',
    description: 'Light-roast Ethiopian extract layered with Iranian saffron threads and micro-foamed oat milk.',
    price: 13.5,
    tag: 'Luxury',
  },
  {
    id: 7,
    category: 'pastry',
    name: 'Matcha Yuzu Croissant',
    description: 'Laminated French butter croissant filled with ceremonial grade matcha ganache and citrus glaze.',
    price: 7.5,
    tag: 'Fresh Baked',
  },
  {
    id: 8,
    category: 'pastry',
    name: 'Truffle Espresso Tart',
    description: 'Single-origin dark chocolate shell infused with espresso liqueur and black truffle dust.',
    price: 9,
    tag: 'Gourmet',
  },
];

const jsonResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(data),
});

exports.getMenu = async (event) => {
  const category = event.queryStringParameters?.category;
  const validCategories = new Set(menu.map((item) => item.category));

  if (category && category !== 'all' && !validCategories.has(category)) {
    return jsonResponse(400, {
      message: `Unknown menu category: ${category}`,
      validCategories: [...validCategories],
    });
  }

  const items = category && category !== 'all'
    ? menu.filter((item) => item.category === category)
    : menu;
  return jsonResponse(200, { items });
};
