let toggleMenu = document.querySelector('.toggle-menu');
let links = document.querySelector('.links');
let bestSellerProductsSection = document.querySelector(".best-seller .cards-container");
let shuffleLis = document.querySelectorAll(".shuffle li");
let cartIcon = document.querySelector(".cartIcon");
let cartHTML = document.querySelector(".cart");
let closeCart = document.querySelector(".cart .close");
let cartProductsHTML = document.querySelector(".cartProducts");
let cartProductsCount = document.querySelector(".cartIcon .count");
let total = document.querySelector(".total");
let cleanCart = document.querySelector(".cleanCart");
let productsSection = document.querySelector(".products .cards-container");
let upBtn = document.querySelector(".up");
let closeFavorite = document.querySelector(".favorite .close");
let favoriteIcon = document.querySelector(".favoriteIcon");
let favoriteHTML = document.querySelector(".favorite");
let favoriteProductsHTML = document.querySelector(".favoriteProducts");
let favoriteProductsCount = document.querySelector(".favoriteIcon .count");
let cleanFavorite = document.querySelector(".cleanFavorite");




/* Toggle Icon */
toggleMenu.onclick = () => links.classList.toggle("open");




/* Get Products And Add To Pages */
let products;

fetch('data.json').then((res) => res.json()).then((data) => {
    products = data;
    addProductsToHtml();
});

function addProductsToHtml() {
    products.forEach((item, index) => {
        let div = document.createElement("div");

        if (bestSellerProductsSection) {
            item.classes.forEach((el) => {
                div.classList.add(el);
            });
        } else {
            div.classList.add("card");
        }

        div.innerHTML = `
            <img src="images/${item.image}" alt="product img" loading="lazy">
            <i class="heart fa-regular fa-heart" onclick="addProductToFavorite(${index})"></i>
            <div class="info">
                <h4>${item.name}</h4>
                <ul class="rate">
                    <li><i class="filled fa-solid fa-star"></i></li>
                    <li><i class="filled fa-solid fa-star"></i></li>
                    <li><i class="filled fa-solid fa-star"></i></li>
                    <li><i class="filled fa-solid fa-star"></i></li>
                    <li><i class="filled fa-regular fa-star"></i></li>
                </ul>
                <div>
                    <span class="price">${item.price}$</span>
                    <i class="add fa-solid fa-plus" onclick="addProductToCart(${index})"></i>
                </div>
            </div>`;

        if (bestSellerProductsSection) {
            bestSellerProductsSection.appendChild(div);
        } else if (productsSection) {
            productsSection.appendChild(div);
        }
    });
}




/* Products Filter */
shuffleLis.forEach((li) => {
    li.addEventListener("click", function(){
        shuffleLis.forEach((ele) => {
            ele.classList.remove("active");
        });
        this.classList.add("active");

        let productsCards = Array.from(document.querySelectorAll(".best-seller .card"));
        for (let i = 0; i < productsCards.length; i++) {
            productsCards[i].style.display = 'none';
        }
        document.querySelectorAll(this.dataset.class).forEach((el) =>{
            el.style.display = "block";
        });
    });
});




/* Cart Products */
let cartProducts = [];

if (sessionStorage.getItem("state")) {
    let data = sessionStorage.getItem("state");
    cartProducts = JSON.parse(data);
    createCartCards()
}

cartIcon.addEventListener("click", function(){
    cartHTML.classList.add("active");
});
closeCart.addEventListener("click", function(){
    cartHTML.classList.remove("active");
});

cleanCart.addEventListener("click", function(){
    cartProducts = [];
    addProductCartToStorage(cartProducts);
    createCartCards();
});

function addProductToCart(index) {
    const findIndexProduct = cartProducts.findIndex((el) => el.id === products[index].id);

    if (findIndexProduct === -1) {
        let product = {...products[index], quantity: 1};
        cartProducts.push(product);
    } else {
        cartProducts[findIndexProduct].quantity += 1;
    }
    addProductCartToStorage(cartProducts);
    createCartCards();
}

function createCartCards() {
    cartProductsHTML.innerHTML = '';
    let priceTotal = 0;
    let count = 0;

    cartProducts.forEach((item, index) => {
        if (item !== null) {
            priceTotal += item.price * item.quantity;
            count += 1;

            let li = document.createElement("li");
            li.classList.add("item");
            li.innerHTML = `
                <div><img src="images/${item.image}" alt="product img" loading="lazy"></div>
                <div>${item.name}</div>
                <div>${item.price}$</div>
                <div>
                    <button onclick="handleQuantity(${index}, ${item.quantity - 1})"><i class="fa-solid fa-minus"></i></button>
                    <div class="quantity">${item.quantity}</div>
                    <button onclick="handleQuantity(${index}, ${item.quantity + 1})"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;
            
            cartProductsHTML.appendChild(li);
        }
    });
    
    total.innerHTML = `${priceTotal}$`;
    cartProductsCount.innerHTML = `${count}`;
}

function handleQuantity(index, newQuantity) {
    if (newQuantity === 0) {
        cartProducts = cartProducts.filter(el => el.id !== cartProducts[index].id);
    } else {
        cartProducts[index].quantity = newQuantity;
    }
    
    addProductCartToStorage(cartProducts);
    createCartCards();
}

function addProductCartToStorage(products) {
    sessionStorage.setItem("state", JSON.stringify(products));
}




/* Favorite Products */
let favoriteProducts = [];

if (sessionStorage.getItem("favorite")) {
    let data = JSON.parse(sessionStorage.getItem("favorite"));
    favoriteProducts = data;
    createFavoriteCards();
}

favoriteIcon.addEventListener("click", function(){
    favoriteHTML.classList.add("active");
});
closeFavorite.addEventListener("click", function(){
    favoriteHTML.classList.remove("active");
});

cleanFavorite.addEventListener("click", function(){
    favoriteProducts = [];
    addProductFavoriteToStorage(favoriteProducts);
    createFavoriteCards();
});

function addProductToFavorite(index) {
    const findIndexProduct = favoriteProducts.findIndex((el) => el.id === products[index].id);

    if (findIndexProduct === -1) {
        favoriteProducts.push(products[index]);
    }
    addProductFavoriteToStorage(favoriteProducts);
    createFavoriteCards();
}

function createFavoriteCards() {
    favoriteProductsHTML.innerHTML = "";
    count = 0;

    favoriteProducts.forEach((item) => {
        count += 1;

        let li = document.createElement("li");
        li.classList.add("item");
        li.innerHTML = `
            <div><img src="images/${item.image}" alt="product img" loading="lazy"></div>
            <div>${item.name}</div>
            <div>${item.price}$</div>
            <div><i class="delete fa-solid fa-trash" onclick="handleDelete(${item.id})"></i></div>
        `;

        favoriteProductsHTML.appendChild(li);
    });
    favoriteProductsCount.innerHTML = `${count}`;
}

function handleDelete(id) {
    favoriteProducts = favoriteProducts.filter(el => el.id !== id);

    addProductFavoriteToStorage(favoriteProducts);
    createFavoriteCards();
}

function addProductFavoriteToStorage(products) {
    sessionStorage.setItem("favorite", JSON.stringify(products));
}




/* Up Button */
window.onscroll = () => window.scrollY >= 200 ? upBtn.classList.add("active") : upBtn.classList.remove("active");

upBtn.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}