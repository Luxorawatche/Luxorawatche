let cart = [];
        let currentFilter = 'all';
        let currentSort = 'default';

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            renderProducts(products);
            updateCartUI();
        });

        // Render products
        function renderProducts(productsToRender) {
            const productGrid = document.getElementById('productGrid');
            productGrid.innerHTML = '';

            productsToRender.forEach(product => {
                const productCard = createProductCard(product);
                productGrid.innerHTML += productCard;
            });
        }

        // Create product card HTML
        function createProductCard(product) {
            const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
            const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
            
            return `
                <div class="product-card" data-category="${product.category}">
                    ${badgeHtml}
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-overlay">
                            <div class="overlay-buttons">
                                <button class="overlay-btn" onclick="quickView(${product.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="overlay-btn" onclick="addToWishlist(${product.id})">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-brand">${product.brand}</div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-rating">
                            <span class="star">${stars}</span>
                        </div>
                        <div class="product-price">
                            <span class="price-current">${product.price.toLocaleString()} MAD</span>
                            <span class="price-original">${product.originalPrice.toLocaleString()} MAD</span>
                        </div>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
        }

        // Filter products
        function filterProducts(category) {
            currentFilter = category;
            
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            let filteredProducts = products;
            if (category !== 'all') {
                filteredProducts = products.filter(p => p.category === category);
            }

            // Apply current sort
            applySorting(filteredProducts);
        }

        // Sort products
        function sortProducts(sortType) {
            currentSort = sortType;
            let sortedProducts = [...products];

            if (currentFilter !== 'all') {
                sortedProducts = sortedProducts.filter(p => p.category === currentFilter);
            }

            applySorting(sortedProducts);
        }

        function applySorting(productsToSort) {
            switch(currentSort) {
                case 'price-low':
                    productsToSort.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    productsToSort.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                    productsToSort.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
            renderProducts(productsToSort);
        }

        // Add to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }

            updateCartUI();
            showToast(`${product.name} added to cart!`);
        }

        // Update cart UI
        function updateCartUI() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;

            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                cartTotal.textContent = '0 MAD';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.brand} ${item.name}</div>
                            <div class="cart-item-price">${item.price.toLocaleString()} MAD</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <button class="overlay-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');

                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartTotal.textContent = `${total.toLocaleString()} MAD`;
            }
        }

        // Update quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    updateCartUI();
                }
            }
        }

        // Remove from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartUI();
            showToast('Item removed from cart');
        }

        // Toggle cart sidebar
        function toggleCart() {
            const cartSidebar = document.getElementById('cartSidebar');
            cartSidebar.classList.toggle('active');
        }

        // Checkout
        function checkout() {
            if (cart.length === 0) {
                showToast('Your cart is empty');
                return;
            }
            showToast('Proceeding to checkout...');
            // Here you would typically redirect to a checkout page
        }

        // Quick view
        function quickView(productId) {
            const product = products.find(p => p.id === productId);
            showToast(`Quick view: ${product.brand} ${product.name}`);
        }

        // Add to wishlist
        function addToWishlist(productId) {
            const product = products.find(p => p.id === productId);
            showToast(`${product.name} added to wishlist!`);
        }

        // Subscribe to newsletter
        function subscribeNewsletter(event) {
            event.preventDefault();
            const email = event.target.querySelector('input[type="email"]').value;
            showToast(`Thank you for subscribing with ${email}!`);
            event.target.reset();
        }

        // Show toast notification
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
            
            lastScroll = currentScroll;
        });