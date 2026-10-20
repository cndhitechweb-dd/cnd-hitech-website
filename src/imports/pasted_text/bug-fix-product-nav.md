IMPORTANT BUG FIX — PRODUCT CATEGORY NAVIGATION AND EMPTY CATEGORIES

The current implementation has an incorrect fallback behavior.

Example:
WIRING ACCESSORIES has NO PRODUCTS.

When I click:
Products → Wiring Accessories

the page currently shows:
"Showing 0 of 0 products"
and then clicking the category again sometimes opens the OLD PRODUCT LISTING MODEL.

THIS MUST BE COMPLETELY FIXED.

==================================================
1. NO FALLBACK TO OLD PRODUCT MODEL
==================================================

Every category must have its own independent navigation state.

DO NOT reuse the previous/old product listing screen when a category has no products.

DO NOT automatically load products from:
- another category
- previous category
- previous page state
- previously selected filter
- old product listing data

DO NOT use fallback/mock/legacy product data.

When there are zero products for a category, the category must remain in its own empty state.

Example:

Home
→ Products
→ Wiring Accessories

MUST ALWAYS remain:

Home / Products / Wiring Accessories

and NEVER become the old product listing page.

==================================================
2. WIRING ACCESSORIES — ZERO PRODUCTS
==================================================

Wiring Accessories currently contains NO PRODUCTS.

Therefore:

DO NOT display:
- old products
- old product cards
- products from Light Fittings
- products from Junction Box
- products from any other category
- previous page products

Instead display a proper empty state.

Example:

---------------------------------------
Home / Products / Wiring Accessories
---------------------------------------

WIRING ACCESSORIES

Explosion Proof Wiring Accessories Manufacturers
& Exporters in India

---------------------------------------

No Products Available

There are currently no products available
under this category.

[ Back to Products ]

---------------------------------------

The empty state should look intentional and professional.

Do NOT show:
"0 of 0 products"

Do NOT show a broken filter interface.

Do NOT show unrelated product cards.

==================================================
3. CATEGORY DATA MUST BE STRICTLY MAPPED
==================================================

Treat the product/category hierarchy as a fixed database.

Every main category must contain ONLY its own assigned subcategories/products.

Data relationship:

MAIN CATEGORY
    ↓
SUBCATEGORY
    ↓
PRODUCTS
    ↓
PRODUCT IMAGE

Never cross-connect these relationships.

For example:

Wiring Accessories
    ↓
only its actual subcategories
    ↓
if no products exist
    ↓
EMPTY STATE

It must NEVER become:

Wiring Accessories
    ↓
old product listing
    ↓
products belonging to another category

==================================================
4. CLICKING THE SAME CATEGORY AGAIN
==================================================

Fix the current repeated-click bug.

When the user clicks:

Wiring Accessories → View Details

open:

/products/wiring-accessories

If the user clicks Wiring Accessories again:

stay on:

/products/wiring-accessories

Do NOT:
- return to an old page
- display old products
- reuse previous category state
- preserve previous filters
- preserve previous product results

The category route/state must be reset every time the category is entered.

==================================================
5. RESET FILTER STATE WHEN CATEGORY CHANGES
==================================================

When switching between categories:

RESET:
- selected filters
- search keyword
- sorting
- product results
- pagination
- previous product state

Example:

User visits:

Junction Box
→ DB-6000 Series
→ products appear

Then user goes to:

Wiring Accessories

The Junction Box products MUST disappear completely.

The Wiring Accessories page must load ONLY Wiring Accessories data.

If Wiring Accessories contains zero products:

show the empty-state UI.

==================================================
6. REMOVE LEGACY MODEL
==================================================

There appears to be an older product-listing implementation still connected to category navigation.

REMOVE/DEACTIVATE that legacy fallback.

There should be ONLY ONE product navigation system.

Required flow:

Products
    ↓
Main Category Page
    ↓
Subcategory Page
    ↓
Product Listing Page
    ↓
Product Detail Page

But when there are no products:

Main Category
    ↓
Subcategory Page
    ↓
EMPTY STATE

No product listing should be forced when data does not exist.

==================================================
7. CORRECT NAVIGATION EXAMPLES
==================================================

Example A — Category with products:

Products
→ Junction Box
→ DB-6000 Series
→ Product Listing
→ Product Detail

Example B — Category with NO products:

Products
→ Wiring Accessories
→ Wiring Accessories Empty State

NOT:

Products
→ Wiring Accessories
→ Old Product Listing
→ Previous Products

==================================================
8. BREADCRUMBS
==================================================

Breadcrumbs must always reflect the CURRENT route.

For Wiring Accessories:

Home / Products / Wiring Accessories

For a Junction Box subcategory:

Home / Products / Junction Box / DB-6000 Series

For a product:

Home / Products / Junction Box / DB-6000 Series / Product Name

Never show a breadcrumb from a previously visited category.

==================================================
9. IMPORTANT — DO NOT INVENT DATA
==================================================

Do NOT create products for Wiring Accessories just to fill the page.

The absence of products is VALID DATA.

Represent it visually with an empty state.

Do not generate:
- fake product names
- fake product images
- placeholder products
- duplicated products
- products copied from another category

==================================================
10. FINAL EXPECTED BEHAVIOR
==================================================

WHEN USER CLICKS:

WIRING ACCESSORIES

RESULT:

┌──────────────────────────────────────────────┐
│ CND HI-TECH HEADER                           │
├──────────────────────────────────────────────┤
│ Home / Products / Wiring Accessories         │
│                                              │
│ WIRING ACCESSORIES                           │
│ Explosion Proof Wiring Accessories           │
│ Manufacturers & Exporters in India           │
├──────────────────────────────────────────────┤
│                                              │
│              No Products Available           │
│                                              │
│   There are currently no products available  │
│   under this category.                       │
│                                              │
│             [ Back to Products ]              │
│                                              │
└──────────────────────────────────────────────┘

Clicking the same category again MUST produce
the EXACT SAME STATE.

It must NEVER display the old product model.

==================================================
11. IMPORTANT IMPLEMENTATION RULE
==================================================

The UI must be driven by the selected category's actual data.

Pseudo-logic:

IF category exists
    load ONLY that category's data

IF category has subcategories
    show subcategory page

IF selected subcategory has products
    show product listing

IF selected subcategory has zero products
    show empty state

IF category itself has zero products
    show empty state

NEVER:
    use previous category products
    use legacy product data
    use default product data
    use fallback products

==================================================
12. KEEP ALL EXISTING DATA UNCHANGED
==================================================

DO NOT change:
- category names
- subcategory names
- product names
- product images
- category mappings
- subcategory mappings
- product mappings

ONLY fix:
- navigation
- routing
- state management
- filtering reset
- empty-state handling
- legacy fallback behavior
- breadcrumb behavior