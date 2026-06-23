/* ==========================================
   YumShare Main Application Shell & Router
   ========================================== */

import { store } from './store.js';
import { renderNavbar, initFooter } from './components.js';
import { renderDashboard, renderRecipeDetail, renderProfile, renderRecipeForm } from './pages.js';

const appContainer = document.getElementById("app");

// Navigation Controller
function onNavigate(pageKey) {
    window.location.hash = pageKey;
}

// Router Mapping Logic
function route() {
    const hash = window.location.hash.slice(1) || "dashboard";
    
    // Clear dynamic main content
    appContainer.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
        </div>
    `;

    let activePage = "dashboard";

    // Route Parsing
    if (hash === "dashboard" || hash === "") {
        activePage = "dashboard";
        renderDashboard(appContainer, onNavigate);
    } 
    else if (hash === "create-recipe") {
        activePage = "create-recipe";
        renderRecipeForm(appContainer, onNavigate);
    } 
    else if (hash.startsWith("edit-recipe-")) {
        const recipeId = hash.replace("edit-recipe-", "");
        activePage = "create-recipe"; // Keeps create active in nav
        renderRecipeForm(appContainer, onNavigate, recipeId);
    } 
    else if (hash.startsWith("recipe-")) {
        const recipeId = hash.replace("recipe-", "");
        activePage = "recipe-detail";
        renderRecipeDetail(appContainer, recipeId, onNavigate);
    } 
    else if (hash.startsWith("profile-")) {
        const userId = hash.replace("profile-", "");
        activePage = store.getCurrentUser()?.id === userId ? "profile" : "dashboard";
        renderProfile(appContainer, onNavigate, userId);
    } 
    else if (hash === "profile") {
        activePage = "profile";
        renderProfile(appContainer, onNavigate);
    } 
    else {
        // Fallback fallback default
        activePage = "dashboard";
        renderDashboard(appContainer, onNavigate);
    }

    // Refresh navbar state highlights
    renderNavbar(activePage, onNavigate);
}

// Initialize Application
function init() {
    // Watch hashchange
    window.addEventListener("hashchange", route);
    
    // Watch store changes (like login / logout state updates)
    store.subscribe(() => {
        const hash = window.location.hash.slice(1) || "dashboard";
        let activePage = "dashboard";
        
        if (hash === "create-recipe" || hash.startsWith("edit-recipe-")) {
            activePage = "create-recipe";
        } else if (hash.startsWith("recipe-")) {
            activePage = "recipe-detail";
        } else if (hash === "profile" || hash.startsWith("profile-")) {
            activePage = "profile";
        }
        
        renderNavbar(activePage, onNavigate);
    });

    // Run logo home click bind
    const logoBtn = document.getElementById("logo-btn");
    if (logoBtn) {
        logoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            onNavigate("dashboard");
        });
    }

    // Initialize Footer
    initFooter(onNavigate);

    // Trigger initial route
    route();
}

// Start App when DOM is ready
document.addEventListener("DOMContentLoaded", init);
if (document.readyState === "interactive" || document.readyState === "complete") {
    init();
}
