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
                    <p>${ingredients.join(", ")}</p>
                    <p>$${price}</p>
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
    `;

    // Add event listener for star rating
    const starRatingDiv = document.getElementById("star-rating");
    const ratingResult = document.getElementById("rating-result");
    if (starRatingDiv) {
        starRatingDiv.addEventListener("click", function(e) {
            if (e.target.classList.contains("star")) {
                const value = e.target.dataset.value;
                ratingResult.textContent = `You rated us ${value} out of 5 stars.`;
                
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

        const orderItemsHtml = ordersArray.map((item) => {
            const { name, price, amount } = item;
            totalPrice += (price * amount);
            if (name === "Beer") {
                hasDiscount = true;
            }
            return `
                <div class="order_item">
                    <h3>${name} x${amount}</h3>
                    <p>$${price * amount}</p>
                </div>
            `
        }).join('');
        if (hasDiscount) {
            totalPrice = totalPrice * 0.9; // Apply 10% discount
        }
        orderDetails.innerHTML = `
            <h2>Your Order</h2>
            <div class="order_items">
                ${orderItemsHtml}
            </div>
            <div class="total_price">
                <h3>Total Price:</h3>
                
                <p>$${totalPrice.toFixed(2)} ${hasDiscount ? "(10% Beer Discount Applied)" : ""}</p>
            </div>
            <button id="complete_order_btn">Complete Order</button>
        `
    }
}