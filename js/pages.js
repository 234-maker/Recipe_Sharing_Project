/* ==========================================
   YumShare Page Views Module
   ========================================== */

import { store } from './store.js';
import { createRecipeCard, renderStars, createStarRatingSelector, toast, openAuthModal } from './components.js';

// --- Dashboard Page View ---
export function renderDashboard(container, onNavigate) {
    let currentCategory = "All";
    let currentSort = "newest";
    let searchQuery = "";

    function updateGrid() {
        const grid = container.querySelector("#recipes-grid");
        if (!grid) return;

        const recipes = store.getRecipes({
            query: searchQuery,
            category: currentCategory,
            sortBy: currentSort
        });

        if (recipes.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🍽️</span>
                    <h3 class="empty-title">No recipes found</h3>
                    <p class="empty-subtitle">We couldn't find any recipes matching your filters. Try searching for something else or upload your own!</p>
                    <button class="btn btn-primary" id="empty-create-btn">Share a Recipe</button>
                </div>
            `;
            const emptyBtn = grid.querySelector("#empty-create-btn");
            if (emptyBtn) {
                emptyBtn.addEventListener("click", () => {
                    if (store.getCurrentUser()) {
                        onNavigate("create-recipe");
                    } else {
                        toast.warning("Please login to share your recipes!");
                        openAuthModal(onNavigate);
                    }
                });
            }
        } else {
            grid.innerHTML = "";
            recipes.forEach(recipe => {
                const card = createRecipeCard(recipe, onNavigate);
                grid.appendChild(card);
            });
        }
    }

    container.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-section">
            <h1 class="hero-title">Discover, Cook & Share <br><span>Delicious Recipes</span></h1>
            <p class="hero-subtitle">Join YumShare, the social community of home chefs. Explore mouth-watering recipes, rate your favorites, and share your own masterpieces.</p>
            <div class="search-container">
                <input type="text" id="dashboard-search" class="search-input" placeholder="Search by title, description, or ingredients..." value="${searchQuery}">
                <button class="search-btn" id="search-submit-btn">Search</button>
            </div>
        </section>

        <!-- Filter & Sorting Bar -->
        <div class="filter-bar">
            <div class="categories-list" id="categories-bar">
                ${["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Drinks"].map(cat => `
                    <button class="category-chip ${cat === currentCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>
                `).join('')}
            </div>
            
            <div class="sort-select-wrapper">
                <span class="sort-label">Sort by:</span>
                <select class="sort-select" id="sort-dropdown">
                    <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>Newest</option>
                    <option value="highest-rated" ${currentSort === 'highest-rated' ? 'selected' : ''}>Highest Rated</option>
                    <option value="popular" ${currentSort === 'popular' ? 'selected' : ''}>Most Popular</option>
                </select>
            </div>
        </div>

        <!-- Recipe Grid -->
        <div class="recipes-grid" id="recipes-grid">
            <div class="loader-container"><div class="loader"></div></div>
        </div>
    `;

    // Attach search input events
    const searchInput = container.querySelector("#dashboard-search");
    const searchBtn = container.querySelector("#search-submit-btn");
    
    const triggerSearch = () => {
        searchQuery = searchInput.value;
        updateGrid();
    };

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") triggerSearch();
    });
    searchBtn.addEventListener("click", triggerSearch);

    // Attach category filter click events
    const categoryBar = container.querySelector("#categories-bar");
    categoryBar.addEventListener("click", (e) => {
        const chip = e.target.closest(".category-chip");
        if (!chip) return;

        categoryBar.querySelectorAll(".category-chip").forEach(el => el.classList.remove("active"));
        chip.classList.add("active");
        currentCategory = chip.getAttribute("data-cat");
        updateGrid();
    });

    // Attach sorting dropdown event
    const sortDropdown = container.querySelector("#sort-dropdown");
    sortDropdown.addEventListener("change", (e) => {
        currentSort = e.target.value;
        updateGrid();
    });

    // Initial render
    updateGrid();
}

// --- Recipe Detail Page View ---
export function renderRecipeDetail(container, recipeId, onNavigate) {
    const recipe = store.getRecipeById(recipeId);
    if (!recipe) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">⚠️</span>
                <h3 class="empty-title">Recipe Not Found</h3>
                <p class="empty-subtitle">The recipe you're looking for does not exist or has been deleted.</p>
                <button class="btn btn-primary" id="back-home-btn">Go back to dashboard</button>
            </div>
        `;
        container.querySelector("#back-home-btn").addEventListener("click", () => onNavigate("dashboard"));
        return;
    }

    const currentUser = store.getCurrentUser();
    const isOwner = currentUser && recipe.creatorId === currentUser.id;
    const isLiked = store.isLiked(recipe.id);

    function refreshDetailView() {
        const commentsList = container.querySelector("#comments-thread");
        if (commentsList) {
            const updatedRecipe = store.getRecipeById(recipeId);
            renderComments(commentsList, updatedRecipe.comments);
        }

        const avgRatingEl = container.querySelector("#avg-rating-value");
        const ratingCountEl = container.querySelector("#rating-count-value");
        const starsContainer = container.querySelector("#avg-stars-display");
        
        if (avgRatingEl && ratingCountEl && starsContainer) {
            const avgRating = store.getAverageRating(recipeId);
            const rCount = store.getRecipeById(recipeId).ratings?.length || 0;
            avgRatingEl.innerText = avgRating > 0 ? avgRating : "New";
            ratingCountEl.innerText = `(${rCount} review${rCount !== 1 ? 's' : ''})`;
            starsContainer.innerHTML = renderStars(avgRating);
        }
    }

    // Heart Icon SVG
    const heartSvg = isLiked 
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`;

    const avgRating = store.getAverageRating(recipe.id);
    const totalTime = recipe.prepTime + recipe.cookTime;

    container.innerHTML = `
        <div class="detail-layout">
            <!-- Header Card Banner -->
            <section class="detail-header-card">
                <img src="${recipe.image}" alt="${recipe.title}" class="detail-hero-img">
                <div class="detail-hero-overlay"></div>
                <div class="detail-header-content">
                    <div class="detail-badge-group">
                        <span class="detail-badge">${recipe.category}</span>
                        <span class="detail-badge difficulty">${recipe.difficulty}</span>
                    </div>
                    <h1 class="detail-title">${recipe.title}</h1>
                    
                    <div class="detail-meta-wrapper">
                        <div class="detail-meta-group">
                            <div class="detail-meta-item">
                                <div class="detail-meta-label">Total Time</div>
                                <div class="detail-meta-value">⏱️ ${totalTime} mins</div>
                            </div>
                            <div class="detail-meta-item">
                                <div class="detail-meta-label">Prep / Cook</div>
                                <div class="detail-meta-value">${recipe.prepTime}m / ${recipe.cookTime}m</div>
                            </div>
                            <div class="detail-meta-item">
                                <div class="detail-meta-label">Publisher</div>
                                <div class="detail-meta-value" style="display:flex; align-items:center; gap:0.4rem; cursor:pointer;" id="recipe-author-click">
                                    <img src="${recipe.creatorAvatar}" alt="${recipe.creatorName}" class="creator-avatar" style="width:20px;height:20px;">
                                    <span>${recipe.creatorName}</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-action-buttons">
                            <button class="detail-btn-social ${isLiked ? 'active' : ''}" id="detail-favorite-btn">
                                ${heartSvg} <span id="like-text-btn">${isLiked ? 'Favorited' : 'Add to Favs'}</span>
                            </button>
                            ${isOwner ? `
                                <button class="detail-btn-social" id="edit-recipe-btn">✏️ Edit</button>
                                <button class="detail-btn-social detail-btn-danger" id="delete-recipe-btn">🗑️ Delete</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Content Split Grid -->
            <div class="detail-grid">
                <!-- Ingredients Sidebar -->
                <aside class="detail-sidebar">
                    <div class="detail-section-card">
                        <h2 class="detail-section-title">🛒 Ingredients</h2>
                        <div class="ingredients-list">
                            ${recipe.ingredients.map((ing, i) => `
                                <label class="ingredient-item" for="ing-${i}">
                                    <input type="checkbox" id="ing-${i}" class="ingredient-checkbox">
                                    <span class="ingredient-text">${ing}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </aside>

                <!-- Instructions Main Area -->
                <main class="detail-main">
                    <div class="detail-section-card" style="margin-bottom: 2rem;">
                        <h2 class="detail-section-title">📋 Preparation</h2>
                        <div class="instructions-list">
                            ${recipe.instructions.map((step, i) => `
                                <div class="instruction-step">
                                    <span class="step-number">${i + 1}</span>
                                    <p class="step-text">${step}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Reviews & Comments Section -->
                    <div class="detail-section-card">
                        <h2 class="detail-section-title">💬 Conversation & Ratings</h2>
                        
                        <!-- Review Info Overview -->
                        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem;">
                            <div id="avg-stars-display">${renderStars(avgRating)}</div>
                            <span style="font-weight:700;font-size:1.1rem;" id="avg-rating-value">${avgRating > 0 ? avgRating : 'New'}</span>
                            <span style="color:var(--text-secondary);font-size:0.9rem;" id="rating-count-value">(${recipe.ratings?.length || 0} reviews)</span>
                        </div>

                        <!-- Rating form (if logged in) -->
                        <div id="rate-recipe-form-container">
                            <!-- Injected dynamically if auth -->
                        </div>

                        <div class="comments-container">
                            <!-- Comment box (if logged in) -->
                            <div class="comment-input-area" id="comment-form-container">
                                <!-- Injected dynamically if auth -->
                            </div>
                            
                            <!-- Comments List -->
                            <div class="comments-list" id="comments-thread">
                                <!-- Rendered dynamically -->
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;

    // Click author profile link
    container.querySelector("#recipe-author-click").addEventListener("click", () => {
        onNavigate(`profile-${recipe.creatorId}`);
    });

    // Favorite Button Action
    const favBtn = container.querySelector("#detail-favorite-btn");
    favBtn.addEventListener("click", () => {
        try {
            store.toggleLike(recipe.id);
            const nowLiked = store.isLiked(recipe.id);
            toast.success(nowLiked ? "Added to favorites!" : "Removed from favorites.");
            
            // Re-render button icon/text
            favBtn.classList.toggle("active", nowLiked);
            const likeTxt = container.querySelector("#like-text-btn");
            favBtn.innerHTML = (nowLiked 
                ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`
            ) + ` <span id="like-text-btn">${nowLiked ? 'Favorited' : 'Add to Favs'}</span>`;
        } catch (err) {
            toast.warning("Please login to favorite recipes.");
            openAuthModal(onNavigate);
        }
    });

    // Owner Edit & Delete Buttons
    if (isOwner) {
        container.querySelector("#edit-recipe-btn").addEventListener("click", () => {
            onNavigate(`edit-recipe-${recipe.id}`);
        });

        container.querySelector("#delete-recipe-btn").addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this recipe? This cannot be undone.")) {
                store.deleteRecipe(recipe.id);
                toast.success("Recipe deleted successfully.");
                onNavigate("dashboard");
            }
        });
    }

    // Dynamic Components: Ratings & Comments Forms based on Auth
    const rateFormContainer = container.querySelector("#rate-recipe-form-container");
    const commentFormContainer = container.querySelector("#comment-form-container");

    if (currentUser) {
        // Initial user rating
        const initialRating = store.getUserRating(recipeId);
        createStarRatingSelector("rate-recipe-form-container", initialRating, (starsVal) => {
            store.addRating(recipeId, starsVal);
            toast.success(`You rated this recipe ${starsVal} stars!`);
            refreshDetailView();
        });

        // Comment Input Form
        commentFormContainer.innerHTML = `
            <div class="form-group" style="margin-bottom: 0.5rem; width:100%;">
                <textarea id="comment-text-input" class="form-input form-input-textarea" placeholder="Add to the conversation... What tweaks did you make?" style="min-height:80px;"></textarea>
            </div>
            <button class="btn btn-primary comment-btn" id="submit-comment-btn">Post Comment</button>
        `;

        const submitCommentBtn = commentFormContainer.querySelector("#submit-comment-btn");
        const commentInput = commentFormContainer.querySelector("#comment-text-input");

        submitCommentBtn.addEventListener("click", () => {
            const text = commentInput.value;
            if (!text.trim()) {
                toast.error("Please enter a comment.");
                return;
            }
            try {
                store.addComment(recipeId, text);
                commentInput.value = "";
                toast.success("Comment added!");
                refreshDetailView();
            } catch (err) {
                toast.error(err.message);
            }
        });
    } else {
        rateFormContainer.innerHTML = `
            <div class="empty-state" style="padding: 1.5rem; margin-bottom: 1rem; border-radius: var(--border-radius-sm);">
                <p style="font-size:0.9rem; color:var(--text-secondary);">Want to rate or review this recipe? <a href="#" id="rate-login-link" style="color:var(--primary); font-weight:600; text-decoration:none;">Sign In</a> to share your feedback.</p>
            </div>
        `;
        rateFormContainer.querySelector("#rate-login-link").addEventListener("click", (e) => {
            e.preventDefault();
            openAuthModal(onNavigate);
        });
    }

    // Initial Comments Render
    const commentsList = container.querySelector("#comments-thread");
    renderComments(commentsList, recipe.comments);
}

// Render Comment Threads List
function renderComments(container, comments) {
    if (!comments || comments.length === 0) {
        container.innerHTML = `
            <p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1.5rem 0;">No comments yet. Start the conversation!</p>
        `;
        return;
    }

    // Sort newest comments first
    const sorted = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    container.innerHTML = sorted.map(c => {
        const timeFormatted = new Date(c.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="comment-node">
                <img src="${c.userAvatar}" alt="${c.userName}" class="comment-avatar">
                <div class="comment-content">
                    <div class="comment-top">
                        <span class="comment-author-name">${c.userName}</span>
                        <span class="comment-timestamp">${timeFormatted}</span>
                    </div>
                    <p class="comment-body">${c.text}</p>
                </div>
            </div>
        `;
    }).join('');
}

// --- User Profile Page View ---
export function renderProfile(container, onNavigate, userId) {
    const currentUser = store.getCurrentUser();
    
    // If no userId is supplied, fall back to current user. If still none, route home
    const effectiveUserId = userId || (currentUser ? currentUser.id : null);
    if (!effectiveUserId) {
        onNavigate("dashboard");
        return;
    }

    const profileUser = store.getUserById(effectiveUserId);
    if (!profileUser) {
        toast.error("Profile not found.");
        onNavigate("dashboard");
        return;
    }

    const isOwnProfile = currentUser && currentUser.id === profileUser.id;
    let activeTab = "recipes"; // recipes or favorites

    function updateTabContent() {
        const grid = container.querySelector("#profile-recipes-grid");
        if (!grid) return;

        const recipes = activeTab === "recipes" 
            ? store.getUserRecipes(profileUser.id)
            : store.getUserFavorites(profileUser.id);

        if (recipes.length === 0) {
            const noValText = activeTab === "recipes" 
                ? (isOwnProfile ? "You haven't shared any recipes yet." : `${profileUser.name} hasn't shared any recipes yet.`)
                : (isOwnProfile ? "You haven't favorited any recipes yet." : `${profileUser.name} hasn't favorited any recipes yet.`);

            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <span class="empty-icon">🍳</span>
                    <h3 class="empty-title">Empty cookbook</h3>
                    <p class="empty-subtitle">${noValText}</p>
                    ${isOwnProfile && activeTab === "recipes" ? `
                        <button class="btn btn-primary" id="profile-create-btn">Share Your First Recipe</button>
                    ` : ''}
                </div>
            `;

            const createBtn = grid.querySelector("#profile-create-btn");
            if (createBtn) {
                createBtn.addEventListener("click", () => onNavigate("create-recipe"));
            }
        } else {
            grid.innerHTML = "";
            recipes.forEach(recipe => {
                const card = createRecipeCard(recipe, onNavigate);
                grid.appendChild(card);
            });
        }
    }

    const sharedRecipesCount = store.getUserRecipes(profileUser.id).length;
    const favoriteRecipesCount = store.getUserFavorites(profileUser.id).length;

    container.innerHTML = `
        <div class="profile-layout">
            <!-- Profile Card -->
            <section class="profile-card">
                <div class="profile-avatar-wrapper">
                    <img src="${profileUser.avatar}" alt="${profileUser.name}" class="profile-avatar" id="avatar-preview-el">
                    ${isOwnProfile ? `
                        <label class="profile-avatar-edit-label" for="profile-avatar-input" title="Upload new avatar">
                            📸
                            <input type="file" id="profile-avatar-input" accept="image/*" style="display:none;">
                        </label>
                    ` : ''}
                </div>
                
                <div class="profile-details">
                    <h1 class="profile-name">${profileUser.name}</h1>
                    
                    <div id="bio-container">
                        <p class="profile-bio">${profileUser.bio || "No bio added yet."}</p>
                        ${isOwnProfile ? `<button class="btn btn-sm" id="edit-bio-btn">Edit Bio</button>` : ''}
                    </div>

                    <div class="profile-stats">
                        <div class="stat-box">
                            <span class="stat-number">${sharedRecipesCount}</span>
                            <span class="stat-label">Recipes Shared</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-number">${favoriteRecipesCount}</span>
                            <span class="stat-label">Favorites</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Toggles and Grid -->
            <div class="profile-tabs" id="profile-tabs-bar">
                <button class="profile-tab active" data-tab="recipes">Recipes Published</button>
                <button class="profile-tab" data-tab="favorites">Liked & Saved</button>
            </div>

            <div class="recipes-grid" id="profile-recipes-grid">
                <!-- Rendered dynamically -->
            </div>
        </div>
    `;

    // Avatar Upload Handler
    if (isOwnProfile) {
        const fileInput = container.querySelector("#profile-avatar-input");
        const avatarImg = container.querySelector("#avatar-preview-el");
        
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2000000) {
                    toast.error("Image file size must be less than 2MB.");
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    store.updateProfile(undefined, dataUrl);
                    avatarImg.src = dataUrl;
                    toast.success("Avatar updated!");
                    // update top nav header avatar also
                    const headerAv = document.querySelector(".header-container .user-avatar");
                    if (headerAv) headerAv.src = dataUrl;
                };
                reader.readAsDataURL(file);
            }
        });

        // Bio Editor Trigger
        const bioContainer = container.querySelector("#bio-container");
        const editBioBtn = container.querySelector("#edit-bio-btn");
        
        if (editBioBtn) {
            editBioBtn.addEventListener("click", () => {
                const currentBio = profileUser.bio || "";
                bioContainer.innerHTML = `
                    <div class="profile-bio-editor">
                        <textarea class="profile-bio-textarea" rows="3" id="bio-textarea">${currentBio}</textarea>
                        <div class="profile-bio-actions">
                            <button class="btn btn-sm btn-primary" id="save-bio-btn">Save</button>
                            <button class="btn btn-sm" id="cancel-bio-btn">Cancel</button>
                        </div>
                    </div>
                `;

                const cancelBtn = bioContainer.querySelector("#cancel-bio-btn");
                const saveBtn = bioContainer.querySelector("#save-bio-btn");
                const textarea = bioContainer.querySelector("#bio-textarea");

                cancelBtn.addEventListener("click", () => {
                    // Reset profile view
                    renderProfile(container, onNavigate, userId);
                });

                saveBtn.addEventListener("click", () => {
                    const updatedBio = textarea.value;
                    store.updateProfile(updatedBio, undefined);
                    toast.success("Profile bio updated!");
                    renderProfile(container, onNavigate, userId);
                });
            });
        }
    }

    // Tabs toggle binding
    const tabsBar = container.querySelector("#profile-tabs-bar");
    tabsBar.addEventListener("click", (e) => {
        const tabBtn = e.target.closest(".profile-tab");
        if (!tabBtn) return;

        tabsBar.querySelectorAll(".profile-tab").forEach(el => el.classList.remove("active"));
        tabBtn.classList.add("active");
        activeTab = tabBtn.getAttribute("data-tab");
        updateTabContent();
    });

    // Initial grid render
    updateTabContent();
}

// --- Recipe Form View (Create / Edit) ---
export function renderRecipeForm(container, onNavigate, editRecipeId = null) {
    const currentUser = store.getCurrentUser();
    if (!currentUser) {
        onNavigate("dashboard");
        return;
    }

    let isEditMode = editRecipeId !== null;
    let editingRecipe = null;
    
    let ingredients = [""];
    let instructions = [""];
    let imageBase64 = "";

    if (isEditMode) {
        editingRecipe = store.getRecipeById(editRecipeId);
        if (!editingRecipe || editingRecipe.creatorId !== currentUser.id) {
            toast.error("Unauthorized or recipe not found.");
            onNavigate("dashboard");
            return;
        }

        // Prepopulate
        ingredients = [...editingRecipe.ingredients];
        instructions = [...editingRecipe.instructions];
        imageBase64 = editingRecipe.image;
    }

    function renderForm() {
        container.innerHTML = `
            <div class="modal-container large" style="margin: 0 auto; background: var(--bg-secondary); border: 1px solid var(--border-color); animation:none;">
                <div class="modal-header">
                    <h2 class="modal-title">${isEditMode ? 'Edit Recipe' : 'Share Your Recipe'}</h2>
                    <button class="btn btn-sm" id="form-cancel-btn">Back</button>
                </div>
                <div class="modal-body">
                    <form id="recipe-wizard-form">
                        <div class="detail-grid" style="grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom:1.5rem;">
                            <!-- Column 1: Details -->
                            <div>
                                <div class="form-group">
                                    <label class="form-label" for="recipe-title">Recipe Title</label>
                                    <input type="text" id="recipe-title" class="form-input" placeholder="e.g. Classic Margherita Pizza" value="${isEditMode ? editingRecipe.title : ''}" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="recipe-desc">Short Description</label>
                                    <textarea id="recipe-desc" class="form-input form-input-textarea" placeholder="Describe your dish. What makes it special?" style="min-height:80px;" required>${isEditMode ? editingRecipe.description : ''}</textarea>
                                </div>
                                
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                                    <div class="form-group">
                                        <label class="form-label" for="recipe-category">Category</label>
                                        <select id="recipe-category" class="form-input" required>
                                            <option value="Breakfast" ${isEditMode && editingRecipe.category === 'Breakfast' ? 'selected' : ''}>Breakfast</option>
                                            <option value="Lunch" ${isEditMode && editingRecipe.category === 'Lunch' ? 'selected' : ''}>Lunch</option>
                                            <option value="Dinner" ${isEditMode && editingRecipe.category === 'Dinner' ? 'selected' : ''}>Dinner</option>
                                            <option value="Dessert" ${isEditMode && editingRecipe.category === 'Dessert' ? 'selected' : ''}>Dessert</option>
                                            <option value="Drinks" ${isEditMode && editingRecipe.category === 'Drinks' ? 'selected' : ''}>Drinks</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label" for="recipe-difficulty">Difficulty</label>
                                        <select id="recipe-difficulty" class="form-input" required>
                                            <option value="Easy" ${isEditMode && editingRecipe.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                                            <option value="Medium" ${isEditMode && editingRecipe.difficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                                            <option value="Hard" ${isEditMode && editingRecipe.difficulty === 'Hard' ? 'selected' : ''}>Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                                    <div class="form-group">
                                        <label class="form-label" for="recipe-preptime">Prep Time (mins)</label>
                                        <input type="number" id="recipe-preptime" class="form-input" min="0" placeholder="15" value="${isEditMode ? editingRecipe.prepTime : ''}" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label" for="recipe-cooktime">Cook Time (mins)</label>
                                        <input type="number" id="recipe-cooktime" class="form-input" min="0" placeholder="25" value="${isEditMode ? editingRecipe.cookTime : ''}" required>
                                    </div>
                                </div>
                            </div>

                            <!-- Column 2: Cover Image Upload -->
                            <div>
                                <label class="form-label">Cover Image</label>
                                <div class="image-upload-wrapper" id="image-upload-zone" style="height: calc(100% - 24px); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                    ${imageBase64 ? `
                                        <img src="${imageBase64}" class="image-upload-preview" id="image-preview-element">
                                    ` : `
                                        <span class="image-upload-icon">📸</span>
                                        <span class="image-upload-text">Drag and drop or <span>browse image</span></span>
                                    `}
                                    <input type="file" id="recipe-image-input" accept="image/*" style="display:none;">
                                </div>
                            </div>
                        </div>

                        <hr style="border:0; border-top:1px solid var(--border-color); margin: 2rem 0;">

                        <!-- Ingredients Dynamic Lists -->
                        <div class="form-group" style="margin-bottom: 2rem;">
                            <label class="form-label" style="font-size:1.1rem; font-weight:700; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
                                Ingredients
                                <button type="button" class="list-btn-add" id="add-ing-row-btn">+ Add Ingredient</button>
                            </label>
                            <div class="dynamic-form-list" id="ingredients-inputs-list">
                                <!-- Loaded dynamically -->
                            </div>
                        </div>

                        <hr style="border:0; border-top:1px solid var(--border-color); margin: 2rem 0;">

                        <!-- Instructions Dynamic Lists -->
                        <div class="form-group" style="margin-bottom: 2rem;">
                            <label class="form-label" style="font-size:1.1rem; font-weight:700; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
                                Directions / Steps
                                <button type="button" class="list-btn-add" id="add-step-row-btn">+ Add Step</button>
                            </label>
                            <div class="dynamic-form-list" id="instructions-inputs-list">
                                <!-- Loaded dynamically -->
                            </div>
                        </div>

                        <button type="submit" class="form-btn-submit" style="padding:1rem; font-size:1.1rem; margin-top:2rem;">
                            ${isEditMode ? 'Save Changes' : 'Publish Recipe'}
                        </button>
                    </form>
                </div>
            </div>
        `;

        renderIngredients();
        renderInstructions();
        attachFormEvents();
    }

    function renderIngredients() {
        const wrapper = container.querySelector("#ingredients-inputs-list");
        if (!wrapper) return;

        wrapper.innerHTML = ingredients.map((ing, i) => `
            <div class="dynamic-list-row" data-index="${i}">
                <input type="text" class="form-input ingredient-val-input" placeholder="e.g. 2 cups granulated sugar" value="${ing}" required>
                ${ingredients.length > 1 ? `
                    <button type="button" class="list-row-btn-remove remove-ing-row">🗑️</button>
                ` : ''}
            </div>
        `).join('');

        // Rebind remove events
        wrapper.querySelectorAll(".remove-ing-row").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.closest(".dynamic-list-row").dataset.index);
                // Capture current input values so they don't get wiped out
                syncIngredientsState();
                ingredients.splice(idx, 1);
                renderIngredients();
            });
        });
    }

    function renderInstructions() {
        const wrapper = container.querySelector("#instructions-inputs-list");
        if (!wrapper) return;

        wrapper.innerHTML = instructions.map((step, i) => `
            <div class="dynamic-list-row" data-index="${i}">
                <span style="font-weight:700; padding-top:0.75rem; width:24px;">${i + 1}.</span>
                <textarea class="form-input form-input-textarea instruction-val-input" placeholder="Describe this step..." style="min-height:50px;" required>${step}</textarea>
                ${instructions.length > 1 ? `
                    <button type="button" class="list-row-btn-remove remove-step-row" style="height:50px;">🗑️</button>
                ` : ''}
            </div>
        `).join('');

        // Rebind remove events
        wrapper.querySelectorAll(".remove-step-row").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.closest(".dynamic-list-row").dataset.index);
                syncInstructionsState();
                instructions.splice(idx, 1);
                renderInstructions();
            });
        });
    }

    function syncIngredientsState() {
        const inputs = container.querySelectorAll(".ingredient-val-input");
        ingredients = Array.from(inputs).map(inp => inp.value);
    }

    function syncInstructionsState() {
        const inputs = container.querySelectorAll(".instruction-val-input");
        instructions = Array.from(inputs).map(inp => inp.value);
    }

    function attachFormEvents() {
        // Back Button
        container.querySelector("#form-cancel-btn").addEventListener("click", () => {
            if (isEditMode) {
                onNavigate(`recipe-${editRecipeId}`);
            } else {
                onNavigate("dashboard");
            }
        });

        // Add Row Buttons
        container.querySelector("#add-ing-row-btn").addEventListener("click", () => {
            syncIngredientsState();
            ingredients.push("");
            renderIngredients();
        });

        container.querySelector("#add-step-row-btn").addEventListener("click", () => {
            syncInstructionsState();
            instructions.push("");
            renderInstructions();
        });

        // File uploader triggers
        const uploadZone = container.querySelector("#image-upload-zone");
        const fileInput = container.querySelector("#recipe-image-input");

        uploadZone.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 3000000) {
                    toast.error("Image file size must be less than 3MB.");
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    imageBase64 = event.target.result;
                    // Replace upload text with preview image
                    uploadZone.innerHTML = `
                        <img src="${imageBase64}" class="image-upload-preview" id="image-preview-element">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });

        // Drag & Drop
        uploadZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = "var(--primary)";
        });

        uploadZone.addEventListener("dragleave", () => {
            uploadZone.style.borderColor = "var(--border-color)";
        });

        uploadZone.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = "var(--border-color)";
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imageBase64 = event.target.result;
                    uploadZone.innerHTML = `
                        <img src="${imageBase64}" class="image-upload-preview" id="image-preview-element">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });

        // Form Submit
        const form = container.querySelector("#recipe-wizard-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            syncIngredientsState();
            syncInstructionsState();

            const title = container.querySelector("#recipe-title").value;
            const description = container.querySelector("#recipe-desc").value;
            const category = container.querySelector("#recipe-category").value;
            const difficulty = container.querySelector("#recipe-difficulty").value;
            const prepTime = container.querySelector("#recipe-preptime").value;
            const cookTime = container.querySelector("#recipe-cooktime").value;

            const recipeData = {
                title,
                description,
                category,
                difficulty,
                prepTime,
                cookTime,
                image: imageBase64,
                ingredients: ingredients.filter(x => x.trim() !== ""),
                instructions: instructions.filter(x => x.trim() !== "")
            };

            if (recipeData.ingredients.length === 0) {
                toast.error("Please add at least one ingredient.");
                return;
            }
            if (recipeData.instructions.length === 0) {
                toast.error("Please add at least one instruction step.");
                return;
            }

            try {
                if (isEditMode) {
                    store.updateRecipe(editRecipeId, recipeData);
                    toast.success("Recipe updated successfully!");
                    onNavigate(`recipe-${editRecipeId}`);
                } else {
                    const newRecipe = store.createRecipe(recipeData);
                    toast.success("Recipe published successfully!");
                    onNavigate(`recipe-${newRecipe.id}`);
                }
            } catch (err) {
                toast.error(err.message);
            }
        });
    }

    renderForm();
}
