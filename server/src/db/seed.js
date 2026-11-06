import { query, pool } from './pool.js';

const menuItemsSeed = [
  {
    name: "Whipped feta",
    category: "starters",
    description: "Roasted grapes, thyme honey, and warm freshly baked sourdough.",
    price: 9.00,
    dietary: "Vegetarian",
    image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Charred aubergine",
    category: "starters",
    description: "Tahini, pomegranate seeds, fresh flat-leaf parsley & a squeeze of lemon.",
    price: 10.00,
    dietary: "Vegan",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Crispy calamari",
    category: "starters",
    description: "Golden and tender squid rings, with homemade garlic lemon aioli & sea salt.",
    price: 12.00,
    dietary: null,
    image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Lemon roast chicken",
    category: "mains",
    description: "Rosemary roasted potatoes, seasonal tender greens & rich natural pan juices.",
    price: 22.00,
    dietary: "House favourite",
    image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Seared sea bass",
    category: "mains",
    description: "Silky white bean purée, blistered cherry tomatoes & fragrant fresh basil oil.",
    price: 25.00,
    dietary: null,
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Wild mushroom orzo",
    category: "mains",
    description: "Slow-roasted wild forest mushrooms, aged parmesan cheese & garden thyme.",
    price: 19.00,
    dietary: "Vegetarian",
    image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pistachio baklava",
    category: "desserts",
    description: "Crispy delicate filo layers, wild orange blossom syrup & strained Greek yoghurt.",
    price: 8.00,
    dietary: "Vegetarian",
    image_url: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Olive oil cake",
    category: "desserts",
    description: "Infused with lemon zest, served with macerated seasonal berries & crème fraîche.",
    price: 8.00,
    dietary: "Vegetarian",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dark chocolate mousse",
    category: "desserts",
    description: "Valrhona 70% cocoa, flaky Cornish sea salt, roasted crushed hazelnuts.",
    price: 9.00,
    dietary: "Vegetarian",
    image_url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
  }
];

export async function seedDatabase() {
  console.log('--- Seeding Sofra Menu Items ---');
  try {
    const existing = await query('SELECT COUNT(*) as count FROM menu_items');
    const count = parseInt(existing.rows[0]?.count || 0, 10);

    if (count === 0) {
      for (const item of menuItemsSeed) {
        await query(
          `INSERT INTO menu_items (name, category, description, price, dietary, image_url, availability)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [item.name, item.category, item.description, item.price, item.dietary, item.image_url, true]
        );
      }
      console.log(`✓ Inserted ${menuItemsSeed.length} menu items into database.`);
    } else {
      console.log(`ℹ Database already has ${count} menu items. Skipping seed.`);
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    if (pool) pool.end();
  });
}
