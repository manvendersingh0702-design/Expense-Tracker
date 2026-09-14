// ==========================================
// GET HTML ELEMENTS
// ==========================================

const form = document.getElementById("transactionForm");

const title = document.getElementById("title");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
const category = document.getElementById("category");
const date = document.getElementById("date");

const submitBtn = document.getElementById("submitBtn");

const transactionList = document.getElementById("transactionList");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");


// ==========================================
// VARIABLES
// ==========================================

let totalIncome = 0;
let totalExpense = 0;

// Agar null hai -> Add mode
// Agar ID hai -> Update mode
let editTransactionId = null;


// ==========================================
// ADD / UPDATE TRANSACTION
// ==========================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const transactionData = {
        title: title.value,
        amount: Number(amount.value),
        type: type.value,
        category: category.value,
        date: date.value
    };


    try {

        let response;


        // ==================================
        // UPDATE TRANSACTION
        // ==================================

        if (editTransactionId !== null) {

            response = await fetch(
                `http://localhost:5000/api/transactions/${editTransactionId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(transactionData)
                }
            );

        }


        // ==================================
        // ADD TRANSACTION
        // ==================================

        else {

            response = await fetch(
                "http://localhost:5000/api/transactions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(transactionData)
                }
            );

        }


        const data = await response.json();

        console.log("Server Response:", data);


        // ==================================
        // SUCCESS
        // ==================================

        if (response.ok) {

            if (editTransactionId !== null) {

                alert("Transaction updated successfully!");

            } else {

                alert("Transaction added successfully!");

            }


            // Reset edit mode
            editTransactionId = null;


            // Clear form
            form.reset();


            // Change button back to Add
            submitBtn.textContent = "Add Transaction";


            // Reload transactions
            loadTransactions();

        } else {

            alert(data.message || "Something went wrong");

        }

    } catch (error) {

        console.log("Transaction error:", error);

        alert("Unable to connect to backend");

    }

});


// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/transactions"
        );


        const data = await response.json();

        console.log("Transactions:", data);


        if (!response.ok) {

            console.log("Failed to load transactions");

            return;

        }


        // ==================================
        // RESET TOTALS
        // ==================================

        totalIncome = 0;
        totalExpense = 0;


        // ==================================
        // CLEAR TABLE
        // ==================================

        transactionList.innerHTML = "";


        // ==================================
        // DISPLAY TRANSACTIONS
        // ==================================

        data.data.forEach(function (transaction) {

            const row = document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${transaction.date.substring(0, 10)}
                </td>

                <td>
                    ${transaction.title}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ${transaction.type}
                </td>

                <td>
                    ₹${transaction.amount}
                </td>

                <td>

                    <button class="edit-btn">
                        Edit
                    </button>

                    <button class="delete-btn">
                        Delete
                    </button>

                </td>

            `;


            transactionList.appendChild(row);


            // ==================================
            // CALCULATE INCOME / EXPENSE
            // ==================================

            if (transaction.type === "Income") {

                totalIncome += transaction.amount;

            } else {

                totalExpense += transaction.amount;

            }


            // ==================================
            // EDIT BUTTON
            // ==================================

            const editBtn = row.querySelector(".edit-btn");


            editBtn.addEventListener("click", function () {

                // Store MongoDB ID
                editTransactionId = transaction._id;


                // Put data into form
                title.value = transaction.title;

                amount.value = transaction.amount;

                type.value = transaction.type;

                category.value = transaction.category;

                date.value = transaction.date.substring(0, 10);


                // Change button text
                submitBtn.textContent = "Update Transaction";


                // Scroll to form
                form.scrollIntoView({
                    behavior: "smooth"
                });

            });


            // ==================================
            // DELETE BUTTON
            // ==================================

            const deleteBtn = row.querySelector(".delete-btn");


            deleteBtn.addEventListener("click", async function () {

                const confirmDelete = confirm(
                    "Are you sure you want to delete this transaction?"
                );


                if (!confirmDelete) {

                    return;

                }


                try {

                    const response = await fetch(
                        `http://localhost:5000/api/transactions/${transaction._id}`,
                        {
                            method: "DELETE"
                        }
                    );


                    const data = await response.json();

                    console.log("Delete Response:", data);


                    if (response.ok) {

                        alert("Transaction deleted successfully!");


                        // Remove row
                        row.remove();


                        // Update totals
                        if (transaction.type === "Income") {

                            totalIncome -= transaction.amount;

                        } else {

                            totalExpense -= transaction.amount;

                        }


                        // Update balance
                        updateBalance();

                    } else {

                        alert(
                            data.message || "Failed to delete transaction"
                        );

                    }

                } catch (error) {

                    console.log("Delete error:", error);

                    alert("Unable to delete transaction");

                }

            });

        });


        // ==================================
        // UPDATE BALANCE
        // ==================================

        updateBalance();


    } catch (error) {

        console.log("Load transactions error:", error);

    }

}


// ==========================================
// UPDATE BALANCE
// ==========================================

function updateBalance() {

    income.textContent = "₹" + totalIncome;

    expense.textContent = "₹" + totalExpense;

    balance.textContent =
        "₹" + (totalIncome - totalExpense);

}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

loadTransactions();