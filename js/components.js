/* ==========================================
   YumShare UI Components Module
   ========================================== */

import { store } from './store.js';

// --- Helper: Toast Notification System ---
export const toast = {
    show(message, type = "success") {
        let container = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }

        const toastEl = document.createElement("div");
        toastEl.className = `toast ${type}`;
        
        let icon = "✨";
        if (type === "success") icon = "✅";
        if (type === "error") icon = "❌";
        if (type === "warning") icon = "⚠️";

        toastEl.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toastEl);

        // Slide out and remove
        setTimeout(() => {
            toastEl.classList.add("toast-fade-out");
            toastEl.addEventListener("animationend", () => {
                toastEl.remove();
            });
        }, 3000);
    },
    success(msg) { this.show(msg, "success"); },
    error(msg) { this.show(msg, "error"); },
    warning(msg) { this.show(msg, "warning"); }
};

// --- Navbar Renderer ---
export function renderNavbar(activePage = "dashboard", onNavigate) {
    const navbar = document.getElementById("main-navbar");
    if (!navbar) return;

    const currentUser = store.getCurrentUser();

    let navHtml = `
        <a href="#dashboard" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" data-page="dashboard">Explore</a>
    `;

    if (currentUser) {
        navHtml += `
            <a href="#create-recipe" class="nav-link ${activePage === 'create-recipe' ? 'active' : ''} nav-btn-primary" data-page="create-recipe">
                <span>➕</span> Create Recipe
            </a>
            <div class="user-profile-menu" id="user-menu-btn" data-page="profile">
                <img src="${currentUser.avatar}" alt="${currentUser.name}" class="user-avatar">
                <span class="user-name">${currentUser.name}</span>
            </div>
            <button class="btn btn-sm" id="logout-btn">Logout</button>
        `;
    } else {
        navHtml += `
            <button class="btn btn-primary" id="login-trigger-btn">Login / Register</button>
        `;
    }

    navbar.innerHTML = navHtml;

    // Attach Action Listeners
    const links = navbar.querySelectorAll("[data-page]");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const page = link.getAttribute("data-page");
            if (onNavigate) onNavigate(page);
        });
    });

    const logoutBtn = navbar.querySelector("#logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            store.logout();
            toast.success("Successfully logged out!");
            if (onNavigate) onNavigate("dashboard");
        });
    }

    const loginBtn = navbar.querySelector("#login-trigger-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            openAuthModal(onNavigate);
        });
    }
}

// --- Recipe Card Component ---
export function createRecipeCard(recipe, onNavigate) {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.dataset.id = recipe.id;

    const avgRating = store.getAverageRating(recipe.id);
    const isLiked = store.isLiked(recipe.id);
    const likeCount = recipe.likes?.length || 0;

    // Heart Icon SVG
    const heartIcon = isLiked 
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`;

    card.innerHTML = `
        <div class="card-img-wrapper">
            <img src="${recipe.image}" alt="${recipe.title}" class="card-img" loading="lazy">
            <span class="card-badge">${recipe.category}</span>
            <button class="card-favorite-btn ${isLiked ? 'favorited' : ''}" title="Favorite recipe">
                ${heartIcon}
            </button>
        </div>
        <div class="card-content">
            <h3 class="card-title">${recipe.title}</h3>
            <p class="card-desc">${recipe.description}</p>
            
            <div class="card-meta-metrics">
                <div class="metric-item">
                    <span class="metric-icon">⏱️</span>
                    <span>${recipe.prepTime + recipe.cookTime} mins</span>
                </div>
                <div class="metric-item">
                    <span class="metric-icon">🔥</span>
                    <span>${recipe.difficulty}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-icon">❤️</span>
                    <span>${likeCount}</span>
                </div>
            </div>

            <div class="card-footer">
                <div class="creator-info">
                    <img src="${recipe.creatorAvatar}" alt="${recipe.creatorName}" class="creator-avatar">
                    <span class="creator-name">${recipe.creatorName}</span>
                </div>
                
                <div class="rating-display">
                    <span class="rating-star">★</span>
                    <span class="rating-score">${avgRating > 0 ? avgRating : 'New'}</span>
                    <span class="rating-count">(${recipe.ratings?.length || 0})</span>
                </div>
            </div>
        </div>
    `;

    // Click to Open Details (except for the favorite button)
    card.addEventListener("click", (e) => {
        if (e.target.closest(".card-favorite-btn")) {
            e.stopPropagation();
            try {
                store.toggleLike(recipe.id);
                toast.success(store.isLiked(recipe.id) ? "Added to favorites!" : "Removed from favorites.");
            } catch (err) {
                toast.warning("Please login to favorite recipes.");
                openAuthModal(onNavigate);
            }
            return;
        }

        if (onNavigate) {
            onNavigate(`recipe-${recipe.id}`);
        }
    });

    return card;
}

// --- Star Rating Display Renderer ---
export function renderStars(score) {
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.5;
    let starsHtml = "";
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHtml += '<span class="rating-star">★</span>';
        } else if (i === fullStars + 1 && hasHalf) {
            starsHtml += '<span class="rating-star">★</span>'; // Vanilla CSS handles simple styling, full star here
        } else {
            starsHtml += '<span class="rating-star" style="color: var(--text-muted)">★</span>';
        }
    }
    return starsHtml;
}

// --- Star Rating Selector Form UI ---
export function createStarRatingSelector(containerId, initialValue = 0, onChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let selectedValue = initialValue;

    function renderSelector() {
        container.innerHTML = `
            <div class="rating-selector-wrapper">
                <span class="form-label">Tap stars to rate this recipe</span>
                <div class="rating-stars-row">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <span class="interactive-star ${star <= selectedValue ? 'selected' : ''}" data-value="${star}">★</span>
                    `).join('')}
                </div>
            </div>
        `;

        const stars = container.querySelectorAll(".interactive-star");
        stars.forEach(star => {
            star.addEventListener("click", () => {
                selectedValue = parseInt(star.getAttribute("data-value"));
                renderSelector();
                if (onChange) onChange(selectedValue);
            });
        });
    }

    renderSelector();
}

// --- Auth Modal Dialog Box ---
export function openAuthModal(onNavigate) {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title">Join YumShare</h3>
                <button class="modal-close-btn" id="close-modal-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="auth-tabs">
                    <button class="auth-tab-btn active" id="tab-login-btn">Sign In</button>
                    <button class="auth-tab-btn" id="tab-register-btn">Create Account</button>
                </div>
                
                <!-- Login Form -->
                <form id="auth-form-login">
                    <div class="form-group">
                        <label class="form-label" for="login-email">Email Address</label>
                        <input type="email" id="login-email" class="form-input" placeholder="you@example.com" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="login-password">Password</label>
                        <input type="password" id="login-password" class="form-input" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="form-btn-submit">Sign In</button>
                </form>

                <!-- Register Form (Hidden initially) -->
                <form id="auth-form-register" class="hidden" style="display: none;">
                    <div class="form-group">
                        <label class="form-label" for="register-name">Full Name</label>
                        <input type="text" id="register-name" class="form-input" placeholder="Chef Ramsay" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="register-email">Email Address</label>
                        <input type="email" id="register-email" class="form-input" placeholder="you@example.com" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="register-password">Password</label>
                        <input type="password" id="register-password" class="form-input" placeholder="Min. 6 characters" minlength="6" required>
                    </div>
                    <button type="submit" class="form-btn-submit">Create Account</button>
                </form>
            </div>
        </div>
    `;

    modalContainer.classList.remove("hidden");

    // Modal Closing
    const closeBtn = modalContainer.querySelector("#close-modal-btn");
    const closeModal = () => {
        modalContainer.classList.add("hidden");
        modalContainer.innerHTML = "";
    };
    closeBtn.addEventListener("click", closeModal);
    
    // Close on overlay click
    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });

    // Tab Toggling
    const tabLogin = modalContainer.querySelector("#tab-login-btn");
    const tabRegister = modalContainer.querySelector("#tab-register-btn");
    const formLogin = modalContainer.querySelector("#auth-form-login");
    const formRegister = modalContainer.querySelector("#auth-form-register");

    tabLogin.addEventListener("click", () => {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        formLogin.style.display = "block";
        formRegister.style.display = "none";
    });

    tabRegister.addEventListener("click", () => {
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
        formRegister.style.display = "block";
        formLogin.style.display = "none";
    });

    // Submission Handler (Login)
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = modalContainer.querySelector("#login-email").value;
        const password = modalContainer.querySelector("#login-password").value;

        try {
            store.login(email, password);
            toast.success(`Welcome back, ${store.getCurrentUser().name}!`);
            closeModal();
            if (onNavigate) onNavigate("dashboard");
        } catch (err) {
            toast.error(err.message || "Login failed");
        }
    });

    // Submission Handler (Register)
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = modalContainer.querySelector("#register-name").value;
        const email = modalContainer.querySelector("#register-email").value;
        const password = modalContainer.querySelector("#register-password").value;

        try {
            store.register(name, email, password);
            toast.success(`Welcome, ${name}! Your account is created.`);
            closeModal();
            if (onNavigate) onNavigate("dashboard");
        } catch (err) {
            toast.error(err.message || "Registration failed");
        }
    });
}

// --- Help & Info Modal Dialog Helper ---
export function openInfoModal(title, contentHtml) {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close-btn" id="close-modal-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="info-modal-content" style="line-height: 1.6; color: var(--text-secondary);">
                    ${contentHtml}
                </div>
            </div>
        </div>
    `;

    modalContainer.classList.remove("hidden");

    const closeBtn = modalContainer.querySelector("#close-modal-btn");
    const closeModal = () => {
        modalContainer.classList.add("hidden");
        modalContainer.innerHTML = "";
    };
    closeBtn.addEventListener("click", closeModal);
    modalContainer.addEventListener("click", (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
}

// --- Footer Event Initializer ---
export function initFooter(onNavigate) {
    // 1. Explore link bindings
    const exploreBtn = document.getElementById("footer-explore-link");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (onNavigate) onNavigate("dashboard");
        });
    }
    const logoBtn = document.getElementById("footer-logo-btn");
    if (logoBtn) {
        logoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (onNavigate) onNavigate("dashboard");
        });
    }

    // 2. Auth checking link bindings
    const createBtn = document.getElementById("footer-create-link");
    if (createBtn) {
        createBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (store.getCurrentUser()) {
                if (onNavigate) onNavigate("create-recipe");
            } else {
                toast.warning("Please login to create a recipe.");
                openAuthModal(onNavigate);
            }
        });
    }

    const profileBtn = document.getElementById("footer-profile-link");
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (store.getCurrentUser()) {
                if (onNavigate) onNavigate("profile");
            } else {
                toast.warning("Please login to view your cookbook.");
                openAuthModal(onNavigate);
            }
        });
    }

    // 3. Info / Policy Modal popups
    const aboutBtn = document.getElementById("footer-about-link");
    if (aboutBtn) {
        aboutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openInfoModal("About YumShare", `
                <p style="margin-bottom: 1rem;"><strong>YumShare</strong> is a premium, open-source cooking community and recipe-sharing platform where culinary passion meets modern tech.</p>
                <p style="margin-bottom: 1rem;">Whether you are an amateur home cook or a professional chef, our platform lets you:</p>
                <ul style="margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc; padding-left: 0;">
                    <li style="margin-bottom: 0.5rem;">Explore curated recipes with smart search and sorting filtering.</li>
                    <li style="margin-bottom: 0.5rem;">Share your custom dishes with full steps and ingredients details.</li>
                    <li style="margin-bottom: 0.5rem;">Rate and review other recipes to provide constructive feedback.</li>
                    <li style="margin-bottom: 0.5rem;">Maintain a dynamic cookbook directly on your personal profile.</li>
                </ul>
                <p>Developed with ❤️ for food lovers everywhere. Let's make every meal delicious together!</p>
            `);
        });
    }

    const guidelinesBtn = document.getElementById("footer-guidelines-link");
    if (guidelinesBtn) {
        guidelinesBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openInfoModal("Cooking Guidelines", `
                <p style="margin-bottom: 1rem;">Welcome to the YumShare kitchen guidelines! To keep our culinary community healthy and constructive, please follow these rules:</p>
                <ul style="margin-left: 1.5rem; list-style-type: disc; padding-left: 0;">
                    <li style="margin-bottom: 0.5rem;"><strong>Authentic Ingredients:</strong> Specify accurate quantities and measurements for ingredients.</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Clear Instructions:</strong> Write step-by-step cooking steps clearly.</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Original Photography:</strong> Upload clear images of actual cooked food. Avoid stock placeholders.</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Respectful Reviews:</strong> Keep community feedback kind, helpful, and constructive.</li>
                </ul>
            `);
        });
    }

    const helpBtn = document.getElementById("footer-help-link");
    if (helpBtn) {
        helpBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openInfoModal("Help & FAQs", `
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 0.25rem;">How do I create a recipe?</h4>
                        <p>Simply register/log in, click the "Create Recipe" button in the navigation header or the footer explore link, and fill out the detailed form.</p>
                    </div>
                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 0.25rem;">Can I edit my recipes?</h4>
                        <p>Yes, go to your profile, click on one of your recipes, and click the Edit button to modify ingredients, description, or steps.</p>
                    </div>
                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 0.25rem;">How does the scoring system work?</h4>
                        <p>User ratings are averaged dynamically to display a rating score from 1 to 5 stars for every recipe card.</p>
                    </div>
                </div>
            `);
        });
    }

    const termsBtn = document.getElementById("footer-terms-btn");
    if (termsBtn) {
        termsBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openInfoModal("Terms of Service", `
                <p style="margin-bottom: 1rem;">By accessing YumShare, you agree to comply with our general conditions of usage:</p>
                <ol style="margin-left: 1.5rem; margin-bottom: 1rem; padding-left: 0;">
                    <li style="margin-bottom: 0.5rem;">You own the copyright or have permissions for the recipe descriptions and images you publish.</li>
                    <li style="margin-bottom: 0.5rem;">Spamming, copying content without permission, or abusive commentary is strictly prohibited.</li>
                    <li style="margin-bottom: 0.5rem;">We reserve the right to remove recipes that violate community standards.</li>
                </ol>
            `);
        });
    }

    const privacyBtn = document.getElementById("footer-privacy-btn");
    if (privacyBtn) {
        privacyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openInfoModal("Privacy Policy", `
                <p style="margin-bottom: 1rem;">We value your privacy. Here's a summary of how we handle user data:</p>
                <ul style="margin-left: 1.5rem; list-style-type: disc; padding-left: 0;">
                    <li style="margin-bottom: 0.5rem;"><strong>Account Information:</strong> We store your registered username and email address to authenticate your profile details securely.</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Uploaded Content:</strong> Any images or descriptions uploaded during recipe creation are shared publicly within our platform shell.</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Data Security:</strong> We do not sell or distribute personal information to third-party ad networks.</li>
                </ul>
            `);
        });
    }

    // 4. Newsletter Subscription Form submit
    const newsletterForm = document.getElementById("footer-newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("footer-email-input");
            if (emailInput && emailInput.value) {
                toast.success(`Thank you for subscribing, ${emailInput.value}! 🍳`);
                emailInput.value = "";
            }
        });
    }

    // 5. Scroll to Top smooth action
    const backToTopBtn = document.getElementById("back-to-top-btn");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}
