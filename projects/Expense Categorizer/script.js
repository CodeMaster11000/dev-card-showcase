// Elements
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const expenseList = document.getElementById("expenseList");
const filterCategory = document.getElementById("filterCategory");
const totalAmountRight = document.getElementById("totalAmountRight");
const totalAmountHeader = document.getElementById("totalAmount");
const currencySelect = document.getElementById("currency");
const currencySymbol = document.getElementById("currencySymbol");
const currencySymbolRight = document.getElementById("currencySymbolRight");

// Load expenses
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let currency = localStorage.getItem("currency") || "$";
currencySelect.value = currency;
currencySymbol.textContent = currency;
currencySymbolRight.textContent = currency;

// Render expenses
function renderExpenses() {
  const filter = filterCategory.value;
  expenseList.innerHTML = "";

  const filtered = expenses.filter(exp => filter === "All" || exp.category === filter);

  if (!filtered.length) {
    expenseList.innerHTML = `<p style="text-align:center;color:#555;">No expenses found</p>`;
    updateTotal();
    return;
  }

  filtered.forEach((exp, index) => {
    const card = document.createElement("div");
    card.className = "expense-card";

    card.innerHTML = `
      <div class="expense-info">
        <h3>${exp.title}</h3>
        <p>${currency}${exp.amount}</p>
        <p>📅 ${exp.date}</p>
        <p>🏷️ ${exp.category}</p>
      </div>
      <div class="actions">
        <button onclick="editExpense(${index})" title="Edit">✏️</button>
        <button onclick="deleteExpense(${index})" title="Delete">🗑️</button>
      </div>
    `;

    expenseList.appendChild(card);
  });

  updateTotal();
}

// Update total
function updateTotal() {
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  totalAmountRight.textContent = total.toFixed(2);
  totalAmountHeader.textContent = total.toFixed(2);
}

// Add expense
addBtn.onclick = () => {
  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  const category = categoryInput.value;

  if (!title || !amount || !date || !category) {
    alert("Please fill all fields");
    return;
  }

  expenses.push({ title, amount, date, category });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  // Reset form
  titleInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
  categoryInput.value = "";

  renderExpenses();
};

// Delete
window.deleteExpense = (index) => {
  if (!confirm("Delete this expense?")) return;
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
};

// Edit
window.editExpense = (index) => {
  const exp = expenses[index];
  titleInput.value = exp.title;
  amountInput.value = exp.amount;
  dateInput.value = exp.date;
  categoryInput.value = exp.category;

  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
};

// Filter
filterCategory.onchange = renderExpenses;

// Currency change
currencySelect.onchange = () => {
  currency = currencySelect.value;
  localStorage.setItem("currency", currency);
  currencySymbol.textContent = currency;
  currencySymbolRight.textContent = currency;
  renderExpenses();
};

// Initial render
renderExpenses();
