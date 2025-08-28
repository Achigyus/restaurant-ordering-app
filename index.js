import { menuArray } from "./data.js";
const menuItems = document.getElementById("menu_items");
const orderDetails = document.getElementById("order_details");
const modal = document.getElementById("modal");
const modalForm = document.getElementById("modal_form");
const orderItems = [];
let hasDiscount = false;

console.log(menuArray);

function renderMenu() {
    return menuArray.map((item) => {
        const { name, ingredients, price, emoji, id } = item;

        return `
            <div class="menu_item">
                <div class="emoji">${emoji}</div>
                <div class="item_details">
                    <h3>${name}</h3>
                    <p class="ingredients">${ingredients.join(", ")}</p>
                    <p class="item_price">$${price}</p>
                </div>
                <button type="button" class="add_btn" data-id="${id}" id="${id}">+</button>
            </div>
        `
    }).join('');
}

menuItems.innerHTML = renderMenu();

document.addEventListener("click", handleDocBtnClick);

window.onclick = function(event) {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
}

modalForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(modalForm);
    const name = formData.get("name");

    modal.classList.add("hidden");
    modalForm.reset();
    orderItems.length = []; 

    // Render thank you and rating UI
    orderDetails.innerHTML = `
    <div class="thank_you">
        <p>Thanks, ${name}! Your order is on its way!</p>
        <div class="rating">
            <p>Please rate your experience:</p>
            <div id="star-rating">
                ${[1,2,3,4,5].map(star => `
                    <span class="star" data-value="${star}" style="font-size:2em;cursor:pointer;">&#9733;</span>
                `).join('')}
            </div>
            <p id="rating-result"></p>
        </div>
    </div>
    `;

    // Add event listener for star rating
    const starRatingDiv = document.getElementById("star-rating");
    const ratingResult = document.getElementById("rating-result");
    if (starRatingDiv) {
        starRatingDiv.addEventListener("click", function(e) {
            if (e.target.classList.contains("star")) {
                const value = e.target.dataset.value;
                ratingResult.textContent = `You rated us ${value} out of 5 stars.`;
                // Disable all stars
                const stars = starRatingDiv.querySelectorAll(".star");
                stars.forEach(star => {
                    star.style.pointerEvents = "none";
                    star.style.opacity = "0.5";
                });
                setTimeout(() => {
                    orderDetails.innerHTML = "";
                }, 3000);
            }
        });
    }

});

function handleDocBtnClick(e) {
    console.log(e);
    if (e.target.classList.contains("add_btn")) {
        handleAddBtnClick(e);
    }
    if (e.target.id === "complete_order_btn") {
        modal.classList.remove("hidden");
    }
    if (e.target.id === "modal_close_btn") {
        modal.classList.add("hidden");
    }
    if (e.target.classList.contains("remove_item_btn")) {
        const itemId = e.target.dataset.id;
        const index = orderItems.findIndex(item => item.id == itemId);
        if (index !== -1) {
            orderItems.splice(index, 1);
            // Clear beer discount if Beer is no longer in the order
            if (!orderItems.some(item => item.name === "Beer")) {
                hasDiscount = false;
            }
            renderOrder(orderItems);
        }
    }
}

function handleAddBtnClick(e) {
    const itemId = e.target.dataset.id;
    const menuItem = menuArray[itemId];

    // Find if item already exists in orderItems
    const existingIndex = orderItems.findIndex(item => item.id === menuItem.id);

    if (existingIndex !== -1) {
        orderItems[existingIndex].amount++;
    } else {
        // Push a deep copy with amount initialized
        orderItems.push({ ...menuItem, amount: 1 });
    }
    renderOrder(orderItems);
}

function renderOrder(ordersArray) {
    if (orderItems.length <= 0) {
        orderDetails.innerHTML = "";
        return;
    } else {
        let totalPrice = 0;
        hasDiscount = false; // Reset before calculation

        const orderItemsHtml = ordersArray.map((item) => {
            const { name, price, amount, id } = item;
            totalPrice += (price * amount);
            if (name === "Beer") {
                hasDiscount = true;
            }
            return `
                <div class="order_item">
                    <h3>${name} x${amount} <span class="remove_item_btn" data-id="${id}" style="cursor:pointer;">remove</span></h3>
                    <p>$${price * amount}</p>
                </div>
            `
        }).join('');
        if (hasDiscount) {
            totalPrice = totalPrice * 0.9; // Apply 10% discount
        }
        orderDetails.innerHTML = `
            <h2 class="order_details_h2">Your Order</h2>
            <div class="order_items">
                ${orderItemsHtml}
            </div>
            <div class="total_price">
                <h3>Total Price:</h3>
                
                <p>$${totalPrice.toFixed(2)} ${hasDiscount ? "(10% Beer Discount Applied)" : ""}</p>
            </div>
            <button class="complete_order_btn" id="complete_order_btn">Complete Order</button>
        `
    }
}