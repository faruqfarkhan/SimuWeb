-- This schema is designed for SQLite and is compatible with Turso.

-- Table: users
-- Purpose: Stores user account information.
CREATE TABLE IF NOT EXISTS users (
    -- Column: id
    -- Data type: INTEGER
    -- Constraints: PRIMARY KEY, AUTOINCREMENT
    -- Description: Unique identifier for each user. Automatically generated.
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Column: email
    -- Data type: TEXT
    -- Constraints: UNIQUE, NOT NULL
    -- Description: The user's email address. Must be unique and cannot be empty.
    email TEXT UNIQUE NOT NULL,
    
    -- Column: name
    -- Data type: TEXT
    -- Constraints: NULLABLE
    -- Description: The user's display name. Can be empty.
    name TEXT,
    
    -- Column: created_at
    -- Data type: TEXT (ISO 8601 string)
    -- Constraints: NOT NULL
    -- Default: CURRENT_TIMESTAMP
    -- Description: The date and time when the user account was created.
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: products
-- Purpose: Stores all available products. This table is pre-populated from `src/lib/products.ts`.
CREATE TABLE IF NOT EXISTS products (
    -- Column: id
    -- Data type: INTEGER
    -- Constraints: PRIMARY KEY
    -- Description: Unique product identifier. It is NOT auto-incrementing because we use predefined IDs.
    id INTEGER PRIMARY KEY,

    -- Column: name
    -- Data type: TEXT
    -- Constraints: NOT NULL
    -- Description: The name of the product.
    name TEXT NOT NULL,
    
    -- Column: price
    -- Data type: INTEGER
    -- Constraints: NOT NULL
    -- Description: The price of the product in the smallest currency unit (e.g., cents, or in this case, Rupiah).
    price INTEGER NOT NULL,

    -- Column: description
    -- Data type: TEXT
    -- Description: A short description of the product.
    description TEXT,
    
    -- Column: longDescription
    -- Data type: TEXT
    -- Description: A more detailed description of the product.
    longDescription TEXT,
    
    -- Column: image
    -- Data type: TEXT
    -- Description: URL for the product image.
    image TEXT,

    -- Column: dataAiHint
    -- Data type: TEXT
    -- Description: Keywords for AI-powered image search hints.
    dataAiHint TEXT
);


-- Table: cart_items
-- Purpose: Associates users with products in their shopping cart.
CREATE TABLE IF NOT EXISTS cart_items (
    -- Column: user_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY to users(id)
    -- Description: References the user who owns this cart item.
    user_id INTEGER NOT NULL,
    
    -- Column: product_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY to products(id)
    -- Description: References the product in the cart.
    product_id INTEGER NOT NULL,
    
    -- Column: quantity
    -- Data type: INTEGER
    -- Constraints: NOT NULL
    -- Default: 1
    -- Description: The number of units of the product in the cart.
    quantity INTEGER NOT NULL DEFAULT 1,
    
    -- Define a composite primary key to ensure a user has only one row per product.
    PRIMARY KEY (user_id, product_id),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Table: wishlist_items
-- Purpose: Associates users with products in their wishlist.
CREATE TABLE IF NOT EXISTS wishlist_items (
    -- Column: user_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY to users(id)
    -- Description: References the user who owns this wishlist item.
    user_id INTEGER NOT NULL,
    
    -- Column: product_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY to products(id)
    -- Description: References the product in the wishlist.
    product_id INTEGER NOT NULL,
    
    -- Column: added_at
    -- Data type: TEXT (ISO 8601 string)
    -- Constraints: NOT NULL
    -- Default: CURRENT_TIMESTAMP
    -- Description: The date and time when the item was added to the wishlist.
    added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Define a composite primary key to ensure a user has only one wishlist entry per product.
    PRIMARY KEY (user_id, product_id),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
