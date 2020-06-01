//using es5
//Book Constructor
//UI Constructor

function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

function UI() {}

function Store() {}

Store.prototype.getBooks = function () {
  let books;
  if (localStorage.getItem("books") === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }
  return books;
};

Store.prototype.displayBooks = function () {
  const books = this.getBooks();

  books.forEach((book) => {
    const ui = new UI();

    //Add bbok to Ui
    ui.addBookToTableList(book);
  });
};

Store.prototype.addBooks = function (book) {
  const books = this.getBooks();
  books.push(book);

  localStorage.setItem("books", JSON.stringify(books));
};

Store.prototype.removeBook = function (isbn) {
  const books = this.getBooks();

  books.forEach((book, index) => {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });

  localStorage.setItem("books", JSON.stringify(books));
};

UI.prototype.addBookToTableList = function (book) {
  //get book list
  const bookList = document.getElementById("book-list");

  const row = document.createElement("tr");

  row.innerHTML = `
   <td>${book.title}</td>
   <td>${book.author}</td>
   <td>${book.isbn}</td>
   <td><a href="#" class="delete">X</a></td>
  `;
  bookList.appendChild(row);
};

UI.prototype.clearInputFields = function () {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
};

UI.prototype.displayMessageToUI = function (className, msg) {
  const parentDiv = document.querySelector(".container");
  const bookForm = document.getElementById("book-form");

  const Div = document.createElement("div");
  Div.className = `alert ${className}`;
  Div.appendChild(document.createTextNode(msg));

  parentDiv.insertBefore(Div, bookForm);

  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 3000);
};

//deleteBOOK
UI.prototype.deleteBook = function (target) {
  const ui = new UI();
  if (target.className == "delete") {
    target.parentElement.parentElement.remove();
    //show alert
    ui.displayMessageToUI("success", "Book removed successfully");
  }
};

document.addEventListener("DOMContentLoaded", () => {
 const store = new Store();

 store.displayBooks();
});

document.getElementById("book-form").addEventListener("submit", (e) => {
  //get the values of inputs
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  //instantiate a new Book object
  const book = new Book(title, author, isbn);

  // instantiate a new UI OBJECT
  const ui = new UI();

  const store = new Store();

  //add a new book to table list
  if (
    isNaN(title) !== false ||
    isNaN(author) !== false ||
    isNaN(isbn) !== false
  ) {
    //add error message to dom
    ui.addBookToTableList(book);

    //add to local storage
    store.addBooks(book);

    ui.displayMessageToUI("success", "Book added successfully");
  } else {
    ui.displayMessageToUI("error", "Make sure you fill all the fields.");
  }

  //clear UI input values

  ui.clearInputFields();

  e.preventDefault();
});

document.querySelector("#book-list").addEventListener("click", function (e) {
  console.log(e.target.className);
  //event delegation
  const ui = new UI();
  const store = new Store();

  ui.deleteBook(e.target);

  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  e.preventDefault();
});
