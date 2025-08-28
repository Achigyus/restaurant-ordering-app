# Jimmy’s Diner - Restaurant Ordering App

Visit the live site: [restaurant-ordering-app-achigyus.netlify.app](https://restaurant-ordering-app-achigyus.netlify.app/)

## Features

- Browse menu items (Pizza, Hamburger, Beer) with emoji and ingredients
- Add items to your order and adjust quantities
- Remove items from your order
- Automatic 10% discount when Beer is in the order
- Responsive design with fluid font sizes
- Modal payment form with card validation
- Thank you message and star rating after order completion

## Technology Used

- [Vite](https://vitejs.dev/) for fast development and build
- Vanilla JavaScript (ES Modules)
- HTML5 & CSS3 (responsive, custom fonts, modern UI)
- [Smythe font](https://fonts.google.com/specimen/Smythe) from Google Fonts

## Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourusername/restaurant-ordering-app.git
cd restaurant-ordering-app
npm install
```

## Development

Start the development server:

```bash
npm start
```

## Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Example Code Snippets

**Add item to order and update quantity:**

```javascript
function handleAddBtnClick(e) {
    const itemId = e.target.dataset.id;
    const menuItem = menuArray[itemId];
    const existingIndex = orderItems.findIndex(item => item.id === menuItem.id);
    if (existingIndex !== -1) {
        orderItems[existingIndex].amount++;
    } else {
        orderItems.push({ ...menuItem, amount: 1 });
    }
    renderOrder(orderItems);
}
```

**Remove item and update discount:**

```javascript
if (e.target.classList.contains("remove_item_btn")) {
    const itemId = e.target.dataset.id;
    const index = orderItems.findIndex(item => item.id == itemId);
    if (index !== -1) {
        orderItems.splice(index, 1);
        if (!orderItems.some(item => item.name === "Beer")) {
            hasDiscount = false;
        }
        renderOrder(orderItems);
    }
}
```

**Responsive font size with clamp:**

```css
.emoji {
  font-size: clamp(31.488px, 13vw, 78.72px);
}
```

## Build Process

- Uses Vite for fast hot module replacement and optimized builds.
- All source files are in the project root.
- CSS is modular and responsive.
- JavaScript is organized by feature and uses ES Modules.

## License

MIT