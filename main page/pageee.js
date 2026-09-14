"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const searchInput = searchBox?.querySelector("input");
    const searchButton = searchBox?.querySelector("button");
    const cartBadge = document.querySelector(".header-action .icon-button:last-child .notification-badge");
    const wishlistBadge = document.querySelector(".header-action .icon-button:nth-last-child(2) .notification-badge");
    let toastTimer;

    const readCount = (badge) => Number.parseInt(badge?.textContent, 10) || 0;

    const updateBadge = (badge, count) => {
        if (!badge) return;
        badge.textContent = String(Math.max(0, count));
    };

    const showMessage = (message) => {
        let toast = document.querySelector(".shopkart-message");

        if (!toast) {
            toast = document.createElement("div");
            toast.className = "shopkart-message";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            Object.assign(toast.style, {
                position: "fixed",
                right: "24px",
                bottom: "24px",
                zIndex: "1000",
                padding: "13px 18px",
                borderRadius: "8px",
                color: "#ffffff",
                background: "#102b5d",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
                fontFamily: "Arial, sans-serif",
                fontWeight: "700"
            });
            document.body.append(toast);
        }

        toast.textContent = message;
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.hidden = true;
        }, 2600);
    };

    const productCards = [...document.querySelectorAll("article[class^='product-card']")];

    const filterProducts = () => {
        const query = searchInput?.value.trim().toLowerCase() || "";
        let visibleProducts = 0;

        productCards.forEach((card) => {
            const matches = !query || card.textContent.toLowerCase().includes(query);
            const cardWrapper = card.parentElement;
            cardWrapper.hidden = !matches;
            if (matches) visibleProducts += 1;
        });

        if (query) {
            showMessage(
                visibleProducts
                    ? `${visibleProducts} product${visibleProducts === 1 ? "" : "s"} found for “${searchInput.value.trim()}”.`
                    : `No products found for “${searchInput.value.trim()}”.`
            );
        }
    };

    searchButton?.addEventListener("click", filterProducts);
    searchInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") filterProducts();
        if (event.key === "Escape") {
            searchInput.value = "";
            filterProducts();
        }
    });

    document.querySelectorAll("button[class^='wishlist-button']").forEach((button) => {
        button.setAttribute("aria-pressed", "false");
        button.textContent = "♡";

        button.addEventListener("click", () => {
            const isSaved = button.getAttribute("aria-pressed") === "true";
            const productName = button.closest("article")?.querySelector("h3")?.textContent.trim() || "Product";
            button.setAttribute("aria-pressed", String(!isSaved));
            button.textContent = isSaved ? "♡" : "♥";
            button.style.color = isSaved ? "#60708a" : "#e91e63";
            updateBadge(wishlistBadge, readCount(wishlistBadge) + (isSaved ? -1 : 1));
            showMessage(isSaved ? `${productName} removed from wishlist.` : `${productName} saved to wishlist.`);
        });
    });

    document.querySelectorAll("button[class^='add-button'], button[class^='buy-button']").forEach((button) => {
        button.addEventListener("click", () => {
            const productName = button.closest("article")?.querySelector("h3")?.textContent.trim() || "Product";
            const isBuyButton = button.className.startsWith("buy-button");
            updateBadge(cartBadge, readCount(cartBadge) + 1);
            showMessage(isBuyButton ? `${productName} is ready for checkout.` : `${productName} added to your cart.`);
        });
    });

    document.querySelectorAll(".admin-nav a").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelector(".admin-nav .active")?.classList.remove("active");
            link.classList.add("active");
            showMessage(`${link.textContent.trim()} selected.`);
        });
    });

    document.querySelectorAll(".category-List a").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const category = link.querySelector("h3")?.textContent.trim() || "";
            if (searchInput) searchInput.value = category;
            filterProducts();
            document.querySelector(".best-sellers")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    document.querySelector(".primary-btn")?.addEventListener("click", () => {
        document.querySelector(".best-sellers")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.querySelector(".account-button")?.addEventListener("click", (event) => {
        const label = event.currentTarget.querySelector("span:last-child");
        const isLoggedIn = label?.textContent.trim() === "Logout";
        if (label) label.textContent = isLoggedIn ? "Login" : "Logout";
        showMessage(isLoggedIn ? "You have logged out." : "You are now logged in.");
    });
});
