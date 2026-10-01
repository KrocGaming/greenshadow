/*
 * Product catalogue — product names, grades and pack sizes are exactly as shown
 * in the company brochure (gsw.pdf, pages 3–4). Descriptions are plain,
 * generic definitions of each spice; no grades, origins or specifications
 * are claimed beyond what the brochure states.
 * Images are the pack mockups (dark studio tiles). The brochure's Coffee
 * Powder and Tea Powder are left out: no pack mockup exists for them.
 */

export const collections = [
  { id: 'whole', label: 'Whole spices & nuts' },
  { id: 'ground', label: 'Ground spices' },
  { id: 'masala', label: 'Masala blends' },
]

export const products = [
  { slug: 'black-pepper', name: 'Black Pepper', col: 'whole', format: 'Whole', desc: 'Sun-dried berries of the pepper vine — the spice most closely tied to Kerala.', uses: ['Seasoning', 'Curries & rubs', 'Spice blends'] },
  { slug: 'white-pepper', name: 'White Pepper', col: 'whole', format: 'Whole', desc: 'Pepper with the outer skin removed, giving a clean, mellow heat.', uses: ['Light sauces', 'Soups', 'Spice blends'] },
  { slug: 'cardamom', name: 'Cardamom', col: 'whole', format: 'Whole pods', spec: 'Grades: 8 Bold · 7 Bold · 6 Bold', desc: 'Green cardamom pods, graded by size for consistent appearance and aroma.', uses: ['Sweets & desserts', 'Tea & coffee', 'Biryani & curries'] },
  { slug: 'chukku', name: 'Chukku', col: 'whole', format: 'Whole', desc: 'Dry ginger — a pantry staple in Kerala kitchens and traditional preparations.', uses: ['Chukku coffee', 'Spice blends', 'Traditional remedies'] },
  { slug: 'clove', name: 'Clove', col: 'whole', format: 'Whole', desc: 'Dried flower buds with a warm, intense aroma.', uses: ['Garam masala', 'Rice dishes', 'Baking'] },
  { slug: 'cinnamon-sticks', name: 'Cinnamon Sticks', col: 'whole', format: 'Quills', desc: 'Rolled bark quills with a sweet, woody fragrance.', uses: ['Biryani & pulao', 'Beverages', 'Baking'] },
  { slug: 'anise-stars', name: 'Anise Stars', col: 'whole', format: 'Whole', desc: 'Star anise — star-shaped pods with a liquorice-like aroma.', uses: ['Biryani', 'Broths', 'Spice blends'] },
  { slug: 'nutmace', name: 'Nutmace', col: 'whole', format: 'Whole', desc: 'Nutmeg and mace — the seed of the nutmeg fruit and its crimson aril.', uses: ['Garam masala', 'Desserts', 'Meat dishes'] },
  { slug: 'garam-masala-whole', name: 'Garam Masala (Whole)', col: 'whole', format: 'Whole-spice mix', desc: 'A mix of whole aromatic spices for tempering and slow cooking.', uses: ['Biryani', 'Curries', 'Tempering'] },
  { slug: 'cashew-nuts', name: 'Cashew Nuts', col: 'whole', format: 'Kernels', desc: 'Cashew kernels for snacking, cooking and confectionery.', uses: ['Snacking', 'Gravies', 'Sweets'] },
  { slug: 'chilli-powder', name: 'Chilli Powder', col: 'ground', format: 'Powder', spec: 'Pack: 100 g', desc: 'Ground dried red chillies for colour and heat.', uses: ['Curries', 'Marinades', 'Pickles'] },
  { slug: 'coriander-powder', name: 'Coriander Powder', col: 'ground', format: 'Powder', spec: 'Pack: 100 g', desc: 'Ground coriander seed with a citrusy, earthy note.', uses: ['Curries', 'Gravies', 'Spice blends'] },
  { slug: 'turmeric-powder', name: 'Turmeric Powder', col: 'ground', format: 'Powder', spec: 'Pack: 100 g', desc: 'Ground turmeric root — the golden base of everyday Indian cooking.', uses: ['Curries', 'Rice', 'Marinades'] },
  { slug: 'garam-masala', name: 'Garam Masala', col: 'masala', format: 'Blend', spec: 'Pack: 100 g', desc: 'A warming blend of ground whole spices.', uses: ['Curries', 'Biryani', 'Finishing'] },
  { slug: 'fish-masala', name: 'Fish Masala', col: 'masala', format: 'Blend', spec: 'Pack: 100 g', desc: 'A blend made for fish curries and fries.', uses: ['Fish curry', 'Fish fry', 'Seafood'] },
  { slug: 'chicken-masala', name: 'Chicken Masala', col: 'masala', format: 'Blend', spec: 'Pack: 100 g', desc: 'A blend made for chicken curries and roasts.', uses: ['Chicken curry', 'Roasts', 'Fry'] },
  { slug: 'meat-masala', name: 'Meat Masala', col: 'masala', format: 'Blend', spec: 'Pack: 100 g', desc: 'A robust blend made for meat curries.', uses: ['Meat curry', 'Roasts', 'Stews'] },
]

export const productImg = (slug) => `/media/products/${slug}.webp`
