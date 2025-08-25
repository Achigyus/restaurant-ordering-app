import { menuArray } from "./data.js";
const menuItems = document.getElementById("menu_items");
const orderDetails = document.getElementById("order_details");
const modal = document.getElementById("modal");
const orderItems = [];

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
        // console.log(itemId);
        if (orderItems.includes(menuArray[itemId])) {
            console.log('Already there');
            let indexOfItem = orderItems.indexOf(menuArray[itemId]);
            // console.log(indexOfItem);
            orderItems[indexOfItem].amount++;
            console.log(orderItems[indexOfItem].amount);

        } else {
            orderItems.push(menuArray[itemId]);
            console.log(orderItems);
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
            totalPrice += price * amount;
            return `
                <div class="order_item">
                    <h3>${name} x${amount}</h3>
                    <p>$${price * amount}</p>
                </div>
            `
        }).join('');
        orderDetails.innerHTML = `
            <h2>Your Order</h2>
            <div class="order_items">
                ${orderItemsHtml}
            </div>
            <div class="total_price">
                <h3>Total Price:</h3>
                <p>$${totalPrice}</p>
            </div>
            <button id="complete_order_btn">Complete Order</button>
        `
    }
}