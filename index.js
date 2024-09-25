const bookContainer = document.getElementById("book-list");
const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");

let cart = [];

// Funzione per ottenere i libri dall'API
const fetchBooks = async () => {
  try {
    const response = await fetch("https://striveschool-api.herokuapp.com/books");
    const books = await response.json();
    renderBooks(books);
  } catch (error) {
    console.error("Errore nella chiamata API:", error);
  }
};

// Funzione per visualizzare i libri
const renderBooks = (books) => {
  books.forEach((book) => {
    const bookCard = `
      <div class="col-md-4 col-lg-3 mb-4">
        <div class="card h-100">
          <img src="${book.img}" class="card-img-top" alt="${book.title}">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">Prezzo: €${book.price}</p>
            <button class="btn btn-danger btn-remove">Rimuovi</button>
            <button class="btn btn-success btn-add">Aggiungi al carrello</button>
          </div>
        </div>
      </div>
    `;
    bookContainer.insertAdjacentHTML("beforeend", bookCard);
  });

  // Aggiungi eventi ai pulsanti
  document.querySelectorAll(".btn-remove").forEach((btn, index) => {
    btn.addEventListener("click", () => removeBook(index));
  });

  document.querySelectorAll(".btn-add").forEach((btn, index) => {
    btn.addEventListener("click", () => addToCart(books[index]));
  });
};

// Funzione per rimuovere un libro dalla pagina
const removeBook = (index) => {
  const books = document.querySelectorAll(".col-md-4, .col-lg-3");
  books[index].remove();
};

// Funzione per aggiungere un libro al carrello
const addToCart = (book) => {
  cart.push(book);
  updateCart();
  saveCartToStorage();
};

// Funzione per aggiornare il carrello
const updateCart = () => {
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const cartItem = `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.title} - €${item.price}
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">Scarta</button>
      </li>
    `;
    cartItems.insertAdjacentHTML("beforeend", cartItem);
  });

  cartCount.textContent = cart.length;
};

// Funzione per rimuovere un libro dal carrello
const removeFromCart = (index) => {
  cart.splice(index, 1);
  updateCart();
  saveCartToStorage();
};

// Salvataggio del carrello nel localStorage
const saveCartToStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Recupera il carrello dal localStorage
const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
};

// Event listener per visualizzare il carrello
document.getElementById("view-cart").addEventListener("click", () => {
  cartModal.show();
});

// Chiamata all'API e caricamento del carrello quando la pagina viene caricata
window.onload = () => {
  fetchBooks();
  loadCartFromStorage();
};
