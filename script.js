"use strict";

const products = [
    { id: 1, name: "Wireless Headphones", price: 2499, category: "Audio", image: "🎧" },
    { id: 2, name: "Smart Watch", price: 3999, category: "Wearables", image: "⌚" },
    { id: 3, name: "Gaming Keyboard", price: 1899, category: "Gaming", image: "⌨️" },
    { id: 4, name: "Bluetooth Speaker", price: 1599, category: "Audio", image: "🔊" },
    { id: 5, name: "Wireless Mouse", price: 899, category: "Accessories", image: "🖱️" },
    { id: 6, name: "Gaming Controller", price: 2299, category: "Gaming", image: "🎮" },
    { id: 7, name: "USB-C Hub", price: 1299, category: "Accessories", image: "🔌" },
    { id: 8, name: "Fitness Band", price: 1799, category: "Wearables", image: "🏃" },
    { id: 9, name: "Noise Cancelling Earbuds", price: 2999, category: "Audio", image: "🎶" },
    { id: 10, name: "Mechanical Keyboard", price: 3499, category: "Gaming", image: "⌨️" },
    { id: 11, name: "Portable Power Bank", price: 1499, category: "Accessories", image: "🔋" },
    { id: 12, name: "Smart Glasses", price: 4999, category: "Wearables", image: "🕶️" },
    { id: 13, name: "Gaming Headset", price: 2799, category: "Gaming", image: "🎧" },
    { id: 14, name: "Wireless Charger", price: 1199, category: "Accessories", image: "⚡" },
    { id: 15, name: "Mini Bluetooth Speaker", price: 999, category: "Audio", image: "📻" },
    { id: 16, name: "VR Headset", price: 6999, category: "Gaming", image: "🥽" }
];


const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const productCount = document.getElementById("productCount");

const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("delivery");
const totalElement = document.getElementById("total");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const orderSummary = document.getElementById("orderSummary");
const closeCheckout = document.getElementById("closeCheckout");

const couponCode = document.getElementById("couponCode");
const applyCoupon = document.getElementById("applyCoupon");
const couponMessage = document.getElementById("couponMessage");
const discountElement = document.getElementById("discount");


const coupons = {
    WELCOME10: {
        type: "percent",
        value: 10,
        minimum: 2000
    },
    TECH20: {
        type: "percent",
        value: 20,
        minimum: 10000
    },
    FREESHIP: {
        type: "shipping",
        value: 0,
        minimum: 1
    }
};

let activeCoupon = "";


function formatPrice(price) {
    return price.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    });
}

function displayProducts(items) {
    productGrid.replaceChildren();

    if (productCount) {
        productCount.textContent =
            `Showing ${items.length} of ${products.length} products`;
    }

    if (items.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No products found.";
        productGrid.appendChild(message);
        return;
    }

    items.forEach(function(product) {
        const card = document.createElement("div");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-image";
        image.textContent = product.image;

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const button = document.createElement("button");
        button.className = "add-btn";
        button.textContent = "Add to Cart";

        button.addEventListener("click", function() {
            addToCart(product.id);
        });

        info.append(category, name, price, button);
        card.append(image, info);
        productGrid.appendChild(card);
    });
}

function filterProducts() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const sort = sortFilter ? sortFilter.value : "default";

    let filtered = products.filter(function(product) {
        return product.name.toLowerCase().includes(search) &&
            (category === "all" || product.category === category);
    });

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

if (sortFilter) {
    sortFilter.addEventListener("change", filterProducts);
}

let cart = {};

try {
    const saved = JSON.parse(
        localStorage.getItem("techzoneCart") || "{}"
    );

    if (saved && typeof saved === "object" &&
        !Array.isArray(saved)) {

        Object.entries(saved).forEach(function([id, quantity]) {
            const validProduct = products.some(p => p.id === Number(id));

            if (validProduct && Number.isSafeInteger(quantity) &&
                quantity > 0) {
                cart[id] = quantity;
            }
        });
    }
} catch (error) {
    cart = {};
}

function openCart() {
    cartPanel.classList.add("active");
    overlay.classList.add("active");
}

function hideCart() {
    cartPanel.classList.remove("active");
    overlay.classList.remove("active");
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
overlay.addEventListener("click", hideCart);

function saveCart() {
    localStorage.setItem("techzoneCart", JSON.stringify(cart));
    renderCart();
}

function addToCart(id) {
    if (!products.some(p => p.id === id)) return;

    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    openCart();
}

function changeQuantity(id, delta) {
    if (!cart[id]) return;

    cart[id] += delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();
}

function removeItem(id) {
    delete cart[id];
    saveCart();
}

function calculateTotals() {
    let subtotal = 0;
    let count = 0;

    Object.keys(cart).forEach(function(id) {
        const product = products.find(p => p.id === Number(id));
        const quantity = cart[id];

        if (!product || !Number.isSafeInteger(quantity) ||
            quantity <= 0) return;

        subtotal += product.price * quantity;
        count += quantity;
    });

    let delivery = subtotal > 0 && subtotal < 5000 ? 99 : 0;
    let discount = 0;
    let couponValid = false;

    const offer = coupons[activeCoupon];

    if (offer && subtotal >= offer.minimum) {
        couponValid = true;

        if (offer.type === "percent") {
            discount = Math.round(
                subtotal * offer.value
            ) / 100;
        } else if (offer.type === "shipping") {
            delivery = 0;
        }
    }

    return {
        subtotal,
        delivery,
        discount,
        total: Math.max(0, subtotal - discount + delivery),
        count,
        couponValid
    };
}

function updateCouponMessage() {
    if (!activeCoupon) {
        couponMessage.textContent = "";
        return;
    }

    const offer = coupons[activeCoupon];
    const totals = calculateTotals();

    if (!totals.couponValid) {
        couponMessage.textContent =
            `${activeCoupon} requires a minimum order of ${formatPrice(offer.minimum)}.`;
        couponMessage.style.color = "#dc2626";
    } else {
        couponMessage.textContent =
            `${activeCoupon} applied successfully!`;
        couponMessage.style.color = "#16a34a";
    }
}

applyCoupon.addEventListener("click", function() {
    const code = couponCode.value.trim().toUpperCase();

    if (code === "") {
        activeCoupon = "";
        couponMessage.textContent = "Enter a coupon code.";
        couponMessage.style.color = "#dc2626";
        renderCart(false);
        return;
    }

    if (!coupons[code]) {
        couponMessage.textContent = "Invalid coupon code.";
        couponMessage.style.color = "#dc2626";
        return;
    }

    const subtotal = calculateTotals().subtotal;

    if (subtotal < coupons[code].minimum) {
        couponMessage.textContent =
            `Minimum order required: ${formatPrice(coupons[code].minimum)}.`;
        couponMessage.style.color = "#dc2626";
        return;
    }

    activeCoupon = code;
    couponCode.value = code;

    renderCart();
});

couponCode.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        applyCoupon.click();
    }
});

function renderCart(refreshCouponMessage = true) {
    cartItems.replaceChildren();

    const ids = Object.keys(cart).filter(function(id) {
        return products.some(p => p.id === Number(id)) &&
            Number.isSafeInteger(cart[id]) && cart[id] > 0;
    });

    if (ids.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Your cart is empty 🛒";
        cartItems.appendChild(empty);
    }

    ids.forEach(function(id) {
        const product = products.find(p => p.id === Number(id));
        const quantity = cart[id];

        const item = document.createElement("div");
        item.className = "cart-item";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(product.price * quantity);

        const controls = document.createElement("div");
        controls.className = "cart-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.setAttribute("aria-label", "Decrease quantity");
        minus.addEventListener("click", function() {
            changeQuantity(product.id, -1);
        });

        const qty = document.createElement("span");
        qty.textContent = quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Increase quantity");
        plus.addEventListener("click", function() {
            changeQuantity(product.id, 1);
        });

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.className = "remove-btn";
        remove.addEventListener("click", function() {
            removeItem(product.id);
        });

        controls.append(minus, qty, plus, remove);
        item.append(name, price, controls);
        cartItems.appendChild(item);
    });

    const totals = calculateTotals();

    cartCount.textContent = totals.count;
    subtotalElement.textContent = formatPrice(totals.subtotal);
    deliveryElement.textContent = formatPrice(totals.delivery);
    discountElement.textContent = "-" + formatPrice(totals.discount);
    totalElement.textContent = formatPrice(totals.total);

    checkoutBtn.disabled = totals.count === 0;

    if (refreshCouponMessage) {
        updateCouponMessage();
    }
}

checkoutBtn.addEventListener("click", function() {
    const totals = calculateTotals();

    if (totals.count === 0) return;

    orderSummary.replaceChildren();

    Object.keys(cart).forEach(function(id) {
        const product = products.find(p => p.id === Number(id));
        const quantity = cart[id];

        if (!product || !Number.isSafeInteger(quantity) ||
            quantity <= 0) return;

        const item = document.createElement("p");
        item.textContent =
            `${product.name} × ${quantity} — ${formatPrice(product.price * quantity)}`;
        item.style.marginBottom = "10px";
        orderSummary.appendChild(item);
    });

    const divider = document.createElement("hr");
    divider.style.margin = "18px 0";

    const subtotal = document.createElement("p");
    subtotal.textContent =
        `Subtotal: ${formatPrice(totals.subtotal)}`;

    const discount = document.createElement("p");
    discount.textContent =
        `Discount: -${formatPrice(totals.discount)}`;

    const delivery = document.createElement("p");
    delivery.textContent =
        `Delivery: ${formatPrice(totals.delivery)}`;

    const total = document.createElement("h3");
    total.textContent =
        `Grand Total: ${formatPrice(totals.total)}`;
    total.style.marginTop = "15px";

    orderSummary.append(
        divider, subtotal, discount, delivery, total
    );

    hideCart();
    checkoutModal.showModal();
});

closeCheckout.addEventListener("click", function() {
    checkoutModal.close();
});

const viewOffersBtn = document.getElementById("viewOffers");
const availableOffers = document.getElementById("availableOffers");

const offerDetails = [
    {
        code: "WELCOME10",
        description: "10% OFF on orders ₹2,000 and above"
    },
    {
        code: "TECH20",
        description: "20% OFF on orders ₹10,000 and above"
    },
    {
        code: "FREESHIP",
        description: "Free delivery on your order"
    }
];

// Show or hide offers
viewOffersBtn.addEventListener("click", function() {
    availableOffers.hidden = !availableOffers.hidden;

    viewOffersBtn.textContent = availableOffers.hidden
        ? "🎉 View Available Offers"
        : "✕ Hide Available Offers";
});

// Create offer cards
offerDetails.forEach(function(offer) {
    const card = document.createElement("div");
    card.className = "offer-card";

    const title = document.createElement("strong");
    title.textContent = offer.code;

    const description = document.createElement("p");
    description.textContent = offer.description;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Apply Offer";

    button.addEventListener("click", function() {
        const subtotal = calculateTotals().subtotal;
        const rule = coupons[offer.code];

        couponCode.value = offer.code;

        if (subtotal < rule.minimum) {
            couponMessage.textContent =
                `Minimum order required: ${formatPrice(rule.minimum)}.`;
            couponMessage.style.color = "#dc2626";
            return;
        }

        activeCoupon = offer.code;
        renderCart();

        availableOffers.hidden = true;
        viewOffersBtn.textContent = "🎉 View Available Offers";
    });

    card.append(title, description, button);
    availableOffers.appendChild(card);
});

filterProducts();
renderCart();
