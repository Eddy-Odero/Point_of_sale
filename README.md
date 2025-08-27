# Beauty Shop POS System

A modern, responsive Point of Sale system built with HTML, CSS, and JavaScript specifically designed for beauty shops, fashion stores, and cosmetics retailers. This system provides a clean and intuitive interface for managing sales transactions in beauty and fashion businesses.

## Features

### 🛍️ Product Management
- **Category-Based Navigation**: Browse products by Clothes, Cosmetics, and Shoes
- **Subcategory Organization**: Each category has organized subcategories (e.g., Shirts, Dresses, Makeup, Skincare)
- **Product Cards**: Visual product cards with icons, names, prices, and stock information
- **Quick Add/Remove**: Add or remove items directly from product cards with +/- buttons
- **Search Functionality**: Search products by name within subcategories
- **Pagination**: Navigate through multiple pages of products

### 🛒 Shopping Cart
- **Add to Cart**: Click on any product to add it to the cart
- **Quantity Management**: Increase or decrease item quantities with +/- buttons
- **Remove Items**: Remove items from cart with the X button
- **Real-time Updates**: Cart totals update automatically as items are modified

### 💰 Order Management
- **Customer Selection**: Choose from predefined customer types
- **Order Summary**: View total items, payable amount, discounts, and shipping
- **Grand Total Calculation**: Automatic calculation of final amount

### 💳 Checkout Processing
- **Checkout**: Process transactions with simulated payment gateway
- **Cancel Order**: Clear cart and start over
- **Receipt Generation**: Detailed receipt with all transaction information

### 🎨 User Interface
- **Modern Design**: Clean, professional interface with green accent colors
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Notifications**: Success, error, and info notifications for user feedback

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Download or clone the repository
2. Open `index.html` in your web browser
3. The POS system will load automatically

### File Structure
```
pos-system/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

### Adding Products to Cart
1. Select a category (Clothes, Cosmetics, or Shoes)
2. Choose a subcategory (e.g., Shirts, Makeup, Heels)
3. Click the "+" button on any product card to add it to your cart
4. The product will appear in the cart sidebar on the right

### Managing Cart Items
- **Increase Quantity**: Click the "+" button next to an item
- **Decrease Quantity**: Click the "-" button next to an item
- **Remove Item**: Click the "X" button to remove an item completely

### Searching Products
1. Use the search bar at the top of the interface
2. Type product name, category, or brand
3. Results will filter automatically as you type
4. Click the "X" in the search bar to clear the search

### Navigating Categories
- **Main Categories**: Click "Clothes", "Cosmetics", or "Shoes" tabs
- **Subcategories**: Click "View Products" on any subcategory card
- **Back Navigation**: Use the "Back" button to return to main categories

### Processing a Sale
1. Add desired products to cart
2. Select a customer from the dropdown (optional)
3. Review the order summary
4. Click "Checkout" to process the transaction
5. Click "Cancel" to clear the cart and start over

## Customization

### Adding New Products
Edit the `beautyShopData` object in `script.js`:

```javascript
// Add to existing subcategory
cosmetics: {
    subcategories: {
        makeup: {
            items: [
                // ... existing items
                { id: "m6", name: "New Lipstick", price: 30.00, stock: "50/100", icon: "💄" }
            ]
        }
    }
}

// Or add new subcategory
cosmetics: {
    subcategories: {
        // ... existing subcategories
        newCategory: {
            name: "New Category",
            icon: "🎨",
            items: [
                { id: "nc1", name: "New Product", price: 40.00, stock: "30/60", icon: "🎨" }
            ]
        }
    }
}
```

### Modifying Styles
- Edit `styles.css` to change colors, fonts, or layout
- The main accent color is `#27ae60` (green)
- Background uses a gradient from `#f5f7fa` to `#c3cfe2`

### Adding Features
- Extend the JavaScript functionality in `script.js`
- Add new event listeners for additional interactions
- Implement database connectivity for persistent data

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality and DOM manipulation
- **Font Awesome**: Icons for better user experience

## Future Enhancements

- [ ] Database integration for persistent data
- [ ] User authentication and role management
- [ ] Inventory management system
- [ ] Sales reports and analytics
- [ ] Multiple payment methods
- [ ] Barcode scanner integration
- [ ] Receipt printer integration
- [ ] Offline functionality with service workers

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Note**: This is a frontend demonstration. For production use, implement proper backend services, database connectivity, and security measures.
