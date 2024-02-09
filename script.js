// accessing the JSON data from the local storage
const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
// formatting the currency type 
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  signDisplay: "always",
});


// collecting the DOM elements and storing them in a const variable to use them further
const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const list_state = document.getElementById("status"); 
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");


// Add an event listener to the form element, listening for the "submit" event.
// When the form is submitted, call the function addTransaction().
form.addEventListener("submit", addTransaction);


// function to update the total
function updateTotal() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income") // filter method is used to create a copy of the original list based on few conditions
    .reduce((total, trx) => total + trx.amount, 0); 

  const expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;
  // this is a condition to check if the balance stays positive or negative, based on that we are giving the sign in the balance
  if (balanceTotal <0 ){
    balance.textContent = formatter.format(balanceTotal);
  }else{
    balance.textContent = formatter.format(balanceTotal).substring(1);
  }
  // updating the values of income and expense indicators
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);
}

// This is a function that is used to render the transactions list to that it can be displayed 
function renderList() {
  list.innerHTML = "";

  // If there are no transactions then we have to display a message saying No transactions, so this condition
  list_state.textContent = "";
  if (transactions.length === 0) {
    list_state.textContent = "No transactions.";
    return;
  }
  // If there exists contents in the list then we will be updating then in the Document based on their transaction type
  transactions.forEach(({ id, name, amount, date, type }) => {
    const sign = "income" === type ? 1 : -1;

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
      </div>
    
      <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    `;

    list.appendChild(li);
  });
}

// calling the 2 functions
renderList();
updateTotal();


// This is a function to delete a transaction from the list of transactions
function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal();
  saveTransactions();
  renderList();
}

// this is a function to add transactions to the existing list and store them in the browser local storage
function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);

  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: "on" === formData.get("type") ? "income" : "expense",
  });

  this.reset();

  updateTotal();
  saveTransactions();
  renderList();
}

// When ever there is a change in the transactio list we will be using this function to make the list look properly, and always have them sorted
function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem("transactions", JSON.stringify(transactions));
}