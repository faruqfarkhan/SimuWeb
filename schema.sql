-- This schema is designed for a simple e-commerce application using Turso (SQLite).

-- Table: users
-- Purpose: Stores user account information.
-- Drop statement is included for easy reset during development.
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    -- Column: id
    -- Data type: INTEGER
    -- Constraints: PRIMARY KEY
    -- Default: None
    -- Generated: Automatically increments for each new user.
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Column: email
    -- Data type: TEXT
    -- Constraints: NOT NULL, UNIQUE
    -- Default: None
    -- Generated: No
    -- Purpose: Stores the user's email address, used for login. Must be unique.
    email TEXT NOT NULL UNIQUE,

    -- Column: name
    -- Data type: TEXT
    -- Constraints: None
    -- Default: None
    -- Generated: No
    -- Purpose: Stores the user's display name.
    name TEXT,

    -- Column: created_at
    -- Data type: TEXT
    -- Constraints: NOT NULL
    -- Default: The current UTC timestamp (e.g., '2023-10-27 10:00:00Z').
    -- Generated: No (but set by default on creation).
    -- Purpose: Records when the user account was created.
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ', 'now'))
);

-- Table: products
-- Purpose: Stores all product information.
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    -- Column: id
    -- Data type: INTEGER
    -- Constraints: PRIMARY KEY
    -- Default: None
    -- Generated: No (we use predefined IDs from our product list).
    id INTEGER PRIMARY KEY,

    -- Column: name
    -- Data type: TEXT
    -- Constraints: NOT NULL
    -- Default: None
    -- Generated: No
    name TEXT NOT NULL,

    -- Column: price
    -- Data type: REAL
    -- Constraints: NOT NULL
    -- Default: 0.0
    price REAL NOT NULL DEFAULT 0.0,

    -- Column: description
    -- Data type: TEXT
    -- Constraints: None
    -- Default: None
    description TEXT,
    
    -- Column: longDescription
    -- Data type: TEXT
    -- Constraints: None
    -- Default: None
    longDescription TEXT,

    -- Column: image
    -- Data type: TEXT
    -- Constraints: None
    -- Default: None
    image TEXT,

    -- Column: dataAiHint
    -- Data type: TEXT
    -- Constraints: None
    -- Default: None
    dataAiHint TEXT
);


-- Table: cart_items
-- Purpose: Links users to the products in their shopping cart.
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    -- Column: user_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY referencing users(id)
    -- Default: None
    -- Generated: No
    -- Purpose: The ID of the user who owns this cart item.
    user_id INTEGER NOT NULL,

    -- Column: product_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY referencing products(id)
    -- Default: None
    -- Generated: No
    -- Purpose: The ID of the product in the cart.
    product_id INTEGER NOT NULL,

    -- Column: quantity
    -- Data type: INTEGER
    -- Constraints: NOT NULL
    -- Default: 1
    -- Generated: No
    -- Purpose: The quantity of the product in the cart.
    quantity INTEGER NOT NULL DEFAULT 1,

    -- Constraint: PRIMARY KEY (user_id, product_id)
    -- Purpose: Ensures that a user can only have one entry per product in their cart.
    -- If a user adds the same product again, the quantity should be updated instead.
    PRIMARY KEY (user_id, product_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- Table: wishlist_items
-- Purpose: Links users to the products in their wishlist.
DROP TABLE IF EXISTS wishlist_items;
CREATE TABLE wishlist_items (
    -- Column: user_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY referencing users(id)
    -- Default: None
    -- Generated: No
    -- Purpose: The ID of the user who owns this wishlist item.
    user_id INTEGER NOT NULL,

    -- Column: product_id
    -- Data type: INTEGER
    -- Constraints: NOT NULL, FOREIGN KEY referencing products(id)
    -- Default: None
    -- Generated: No
    -- Purpose: The ID of the product in the wishlist.
    product_id INTEGER NOT NULL,

    -- Constraint: PRIMARY KEY (user_id, product_id)
    -- Purpose: Ensures that a user can only have a specific product in their wishlist once.
    PRIMARY KEY (user_id, product_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Note on seeding:
-- The 'products' table needs to be populated with data.
-- A service file in the application (`src/services/product-service.ts`) will
-- automatically seed this table if it's empty.
