/* ==========================================
   YumShare Global State Store
   ========================================== */

// Initial Seed Data for Recipes
const DEFAULT_RECIPES = [
    {
        id: "recipe-1",
        title: "Creamy Tuscan Garlic Chicken",
        description: "Tender chicken breasts simmered in a rich garlic, spinach, and sun-dried tomato cream sauce. Perfect with pasta or crusty bread!",
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
        category: "Lunch",
        prepTime: 15,
        cookTime: 25,
        difficulty: "Medium",
        ingredients: [
            "2 large chicken breasts, halved horizontally",
            "1 tbsp olive oil",
            "1 cup heavy cream",
            "1/2 cup chicken broth",
            "1 tsp garlic powder",
            "1 cup fresh spinach, packed",
            "1/2 cup sun-dried tomatoes, chopped",
            "1/2 cup grated parmesan cheese",
            "3 cloves garlic, minced"
        ],
        instructions: [
            "Season chicken breasts with salt, pepper, and garlic powder.",
            "Heat olive oil in a large skillet over medium-high heat. Sear chicken for 5 minutes on each side until golden and cooked through. Remove from skillet and set aside.",
            "In the same skillet, add minced garlic and sauté for 1 minute. Pour in chicken broth and heavy cream, scraping up the browned bits.",
            "Bring sauce to a simmer, then stir in the sun-dried tomatoes, parmesan cheese, and spinach. Simmer for 3 minutes until spinach is wilted.",
            "Return the chicken to the skillet, spooning sauce over top. Let simmer for an additional 2-3 minutes to heat through. Serve hot!"
        ],
        creatorId: "user-admin",
        creatorName: "Chef Isabella",
        creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
        likes: ["user-admin", "user-john"],
        ratings: [
            { userId: "user-admin", stars: 5 },
            { userId: "user-john", stars: 4 }
        ],
        comments: [
            {
                id: "comment-1-1",
                userId: "user-john",
                userName: "John Doe",
                userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
                text: "Absolutely delicious! I added a pinch of red pepper flakes for a kick.",
                createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
            }
        ]
    },
    {
        id: "recipe-2",
        title: "Ultimate Chocolate Chip Cookies",
        description: "The gold standard of cookies: crispy around the golden edges, thick and soft in the middle, packed with chocolate chips.",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
        category: "Dessert",
        prepTime: 15,
        cookTime: 10,
        difficulty: "Easy",
        ingredients: [
            "1 cup unsalted butter, softened",
            "3/4 cup brown sugar, packed",
            "3/4 cup granulated sugar",
            "2 large eggs, room temperature",
            "2 tsp vanilla extract",
            "2 1/4 cups all-purpose flour",
            "1 tsp baking soda",
            "1/2 tsp salt",
            "2 cups semi-sweet chocolate chips"
        ],
        instructions: [
            "Preheat oven to 375°F (190°C) and line a baking sheet with parchment paper.",
            "In a large bowl, cream together the softened butter, brown sugar, and granulated sugar until light and fluffy.",
            "Beat in the eggs one at a time, then stir in the vanilla extract.",
            "Combine the flour, baking soda, and salt. Gradually blend into the creamed mixture.",
            "Fold in the chocolate chips by hand.",
            "Drop rounded tablespoons of dough onto the prepared baking sheet, leaving space between each.",
            "Bake for 9-11 minutes until edges are golden brown. Let cool on sheet for 5 minutes before transferring to a wire rack."
        ],
        creatorId: "user-admin",
        creatorName: "Chef Isabella",
        creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
        likes: ["user-john"],
        ratings: [
            { userId: "user-john", stars: 5 }
        ],
        comments: []
    },
    {
        id: "recipe-3",
        title: "Spicy Vegetarian Ramen",
        description: "A steaming, flavorful bowl of comfort. Silky miso and sesame broth topped with tender noodles, a soft-boiled egg, and crispy scallions.",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        category: "Dinner",
        prepTime: 20,
        cookTime: 20,
        difficulty: "Hard",
        ingredients: [
            "2 packs ramen noodles (discard seasoning packets)",
            "4 cups vegetable broth",
            "2 tbsp white miso paste",
            "1 tbsp tahini (sesame paste)",
            "2 cloves garlic, grated",
            "1 tbsp soy sauce",
            "1 tsp chili oil (adjust to taste)",
            "1 soft-boiled egg, halved",
            "1/2 cup green onions, thinly sliced",
            "1/4 cup corn kernels"
        ],
        instructions: [
            "In a medium pot, bring the vegetable broth to a simmer over medium heat.",
            "In a small bowl, whisk together the miso paste, tahini, grated garlic, soy sauce, and chili oil with a splash of warm broth until smooth.",
            "Pour the miso mixture back into the simmering broth. Stir well and keep warm on low heat (do not boil miso).",
            "In a separate pot, cook ramen noodles according to package instructions, then drain.",
            "Divide the cooked noodles into two serving bowls. Pour the hot broth over the noodles.",
            "Top each bowl with half a soft-boiled egg, fresh sliced green onions, sweet corn, and extra chili oil if desired. Enjoy immediately!"
        ],
        creatorId: "user-john",
        creatorName: "John Doe",
        creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
        likes: ["user-admin"],
        ratings: [
            { userId: "user-admin", stars: 5 }
        ],
        comments: []
    },
    {
        id: "recipe-4",
        title: "Fresh Avocado Toast with Feta",
        description: "The ultimate quick breakfast. Sourdough toast topped with creamy mashed avocado, salty feta cheese, cherry tomatoes, and microgreens.",
        image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=800&q=80",
        category: "Breakfast",
        prepTime: 10,
        cookTime: 5,
        difficulty: "Easy",
        ingredients: [
            "2 slices thick sourdough bread",
            "1 ripe Hass avocado",
            "Juice of 1/2 lemon",
            "2 tbsp feta cheese, crumbled",
            "4-5 cherry tomatoes, halved",
            "Pinch of red pepper flakes",
            "Coarse sea salt and freshly cracked black pepper",
            "Drizzle of extra virgin olive oil"
        ],
        instructions: [
            "Toast the sourdough bread slices until golden brown and crispy.",
            "In a small bowl, mash the avocado flesh with lemon juice, salt, and pepper to your desired chunkiness.",
            "Spread the mashed avocado evenly over the toasted bread.",
            "Top with halved cherry tomatoes, crumbled feta cheese, and microgreens/herbs.",
            "Sprinkle red pepper flakes over top and finish with a light drizzle of olive oil."
        ],
        creatorId: "user-john",
        creatorName: "John Doe",
        creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        likes: [],
        ratings: [],
        comments: []
    }
];

// Initial Seed Data for Users
const DEFAULT_USERS = [
    {
        id: "user-admin",
        name: "Chef Isabella",
        email: "isabella@yumshare.com",
        password: "password123", // For mock purposes
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        bio: "Professional chef and culinary enthusiast. I love exploring Mediterranean flavors and creating easy-to-follow, gourmet recipes for home cooks."
    },
    {
        id: "user-john",
        name: "John Doe",
        email: "john@yumshare.com",
        password: "password123",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        bio: "Home cook trying to eat healthy. Breakfast and dessert lover! Follow my cooking experiments."
    }
];

class Store {
    constructor() {
        // Load data from LocalStorage or initialize with defaults
        this.recipes = this._load("yumshare_recipes", DEFAULT_RECIPES);
        this.users = this._load("yumshare_users", DEFAULT_USERS);
        this.currentUser = this._load("yumshare_current_user", null);
        this.listeners = [];
    }

    // --- State Persistence Helpers ---
    _load(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Failed to load key: ${key}`, e);
            return defaultValue;
        }
    }

    _save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Failed to save key: ${key}`, e);
        }
    }

    _notify() {
        this.listeners.forEach(fn => fn());
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // --- Auth Management ---
    register(name, email, password) {
        // Validate unique email
        if (this.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("An account with this email already exists.");
        }

        const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            password,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80", // Default avatar
            bio: "Welcome to my recipe profile! I love sharing food."
        };

        this.users.push(newUser);
        this._save("yumshare_users", this.users);

        // Auto login after registration
        this.currentUser = newUser;
        this._save("yumshare_current_user", this.currentUser);
        this._notify();

        return newUser;
    }

    login(email, password) {
        const user = this.users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!user) {
            throw new Error("Invalid email or password.");
        }

        this.currentUser = user;
        this._save("yumshare_current_user", this.currentUser);
        this._notify();

        return user;
    }

    logout() {
        this.currentUser = null;
        this._save("yumshare_current_user", null);
        this._notify();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserById(userId) {
        return this.users.find(u => u.id === userId);
    }

    updateProfile(bio, avatarDataUrl) {
        if (!this.currentUser) return;

        // Update in users database
        this.users = this.users.map(user => {
            if (user.id === this.currentUser.id) {
                const updated = { ...user };
                if (bio !== undefined) updated.bio = bio;
                if (avatarDataUrl !== undefined) updated.avatar = avatarDataUrl;
                return updated;
            }
            return user;
        });
        this._save("yumshare_users", this.users);

        // Update current user cache
        this.currentUser = this.users.find(u => u.id === this.currentUser.id);
        this._save("yumshare_current_user", this.currentUser);

        // Also update creator avatar/name on recipes published by this user
        this.recipes = this.recipes.map(recipe => {
            if (recipe.creatorId === this.currentUser.id) {
                return {
                    ...recipe,
                    creatorName: this.currentUser.name,
                    creatorAvatar: this.currentUser.avatar
                };
            }
            return recipe;
        });
        this._save("yumshare_recipes", this.recipes);

        this._notify();
    }

    // --- Recipes CRUD ---
    getRecipes({ query = "", category = "All", sortBy = "newest" } = {}) {
        let list = [...this.recipes];

        // Search text filter
        if (query.trim()) {
            const q = query.toLowerCase().trim();
            list = list.filter(r => 
                r.title.toLowerCase().includes(q) || 
                r.description.toLowerCase().includes(q) ||
                r.ingredients.some(ing => ing.toLowerCase().includes(q))
            );
        }

        // Category filter
        if (category && category !== "All") {
            list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
        }

        // Sorting
        if (sortBy === "newest") {
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === "highest-rated") {
            list.sort((a, b) => this.getAverageRating(b.id) - this.getAverageRating(a.id));
        } else if (sortBy === "popular") {
            // Sort by like count
            list.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        }

        return list;
    }

    getRecipeById(id) {
        return this.recipes.find(r => r.id === id);
    }

    createRecipe(recipeData) {
        if (!this.currentUser) throw new Error("Must be logged in to create a recipe.");

        const newRecipe = {
            id: `recipe-${Date.now()}`,
            title: recipeData.title,
            description: recipeData.description,
            image: recipeData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
            category: recipeData.category,
            prepTime: parseInt(recipeData.prepTime) || 0,
            cookTime: parseInt(recipeData.cookTime) || 0,
            difficulty: recipeData.difficulty || "Easy",
            ingredients: recipeData.ingredients || [],
            instructions: recipeData.instructions || [],
            creatorId: this.currentUser.id,
            creatorName: this.currentUser.name,
            creatorAvatar: this.currentUser.avatar,
            createdAt: new Date().toISOString(),
            likes: [],
            ratings: [],
            comments: []
        };

        this.recipes.unshift(newRecipe);
        this._save("yumshare_recipes", this.recipes);
        this._notify();

        return newRecipe;
    }

    updateRecipe(id, recipeData) {
        if (!this.currentUser) throw new Error("Must be logged in to update recipes.");
        
        const recipe = this.getRecipeById(id);
        if (!recipe) throw new Error("Recipe not found.");
        if (recipe.creatorId !== this.currentUser.id) throw new Error("Unauthorized to edit this recipe.");

        this.recipes = this.recipes.map(r => {
            if (r.id === id) {
                return {
                    ...r,
                    title: recipeData.title,
                    description: recipeData.description,
                    image: recipeData.image || r.image,
                    category: recipeData.category,
                    prepTime: parseInt(recipeData.prepTime) || 0,
                    cookTime: parseInt(recipeData.cookTime) || 0,
                    difficulty: recipeData.difficulty,
                    ingredients: recipeData.ingredients,
                    instructions: recipeData.instructions
                };
            }
            return r;
        });

        this._save("yumshare_recipes", this.recipes);
        this._notify();
    }

    deleteRecipe(id) {
        if (!this.currentUser) throw new Error("Must be logged in to delete recipes.");
        
        const recipe = this.getRecipeById(id);
        if (!recipe) throw new Error("Recipe not found.");
        if (recipe.creatorId !== this.currentUser.id) throw new Error("Unauthorized to delete this recipe.");

        this.recipes = this.recipes.filter(r => r.id !== id);
        this._save("yumshare_recipes", this.recipes);
        this._notify();
    }

    // --- Like / Favorites ---
    toggleLike(recipeId) {
        if (!this.currentUser) throw new Error("Must be logged in to favorite recipes.");

        this.recipes = this.recipes.map(r => {
            if (r.id === recipeId) {
                let likes = [...(r.likes || [])];
                if (likes.includes(this.currentUser.id)) {
                    likes = likes.filter(uid => uid !== this.currentUser.id);
                } else {
                    likes.push(this.currentUser.id);
                }
                return { ...r, likes };
            }
            return r;
        });

        this._save("yumshare_recipes", this.recipes);
        this._notify();
    }

    isLiked(recipeId) {
        if (!this.currentUser) return false;
        const r = this.getRecipeById(recipeId);
        return r && r.likes && r.likes.includes(this.currentUser.id);
    }

    getUserRecipes(userId) {
        return this.recipes.filter(r => r.creatorId === userId);
    }

    getUserFavorites(userId) {
        return this.recipes.filter(r => r.likes && r.likes.includes(userId));
    }

    // --- Ratings System ---
    addRating(recipeId, stars) {
        if (!this.currentUser) throw new Error("Must be logged in to rate recipes.");
        if (stars < 1 || stars > 5) throw new Error("Invalid rating. Must be between 1 and 5.");

        this.recipes = this.recipes.map(r => {
            if (r.id === recipeId) {
                let ratings = [...(r.ratings || [])];
                const existingIdx = ratings.findIndex(rt => rt.userId === this.currentUser.id);
                
                if (existingIdx > -1) {
                    ratings[existingIdx].stars = stars;
                } else {
                    ratings.push({ userId: this.currentUser.id, stars });
                }
                return { ...r, ratings };
            }
            return r;
        });

        this._save("yumshare_recipes", this.recipes);
        this._notify();
    }

    getAverageRating(recipeId) {
        const r = this.getRecipeById(recipeId);
        if (!r || !r.ratings || r.ratings.length === 0) return 0;
        const sum = r.ratings.reduce((acc, rt) => acc + rt.stars, 0);
        return parseFloat((sum / r.ratings.length).toFixed(1));
    }

    getUserRating(recipeId) {
        if (!this.currentUser) return 0;
        const r = this.getRecipeById(recipeId);
        if (!r || !r.ratings) return 0;
        const rating = r.ratings.find(rt => rt.userId === this.currentUser.id);
        return rating ? rating.stars : 0;
    }

    // --- Comment Thread ---
    addComment(recipeId, text) {
        if (!this.currentUser) throw new Error("Must be logged in to comment.");
        if (!text.trim()) throw new Error("Comment text cannot be empty.");

        const newComment = {
            id: `comment-${Date.now()}`,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            userAvatar: this.currentUser.avatar,
            text: text.trim(),
            createdAt: new Date().toISOString()
        };

        this.recipes = this.recipes.map(r => {
            if (r.id === recipeId) {
                const comments = [...(r.comments || [])];
                comments.push(newComment);
                return { ...r, comments };
            }
            return r;
        });

        this._save("yumshare_recipes", this.recipes);
        this._notify();

        return newComment;
    }
}

export const store = new Store();
