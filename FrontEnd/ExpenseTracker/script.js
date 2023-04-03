const myForm = document.getElementById("my-form");
const amount = document.getElementById("expense-amount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const expense = document.getElementById("collection");
const msg = document.querySelector(".msg");
const token = localStorage.getItem("token");
const razorpayBtn = document.getElementById("razorpay");
const razorpayPr = document.getElementById("razorpay-pr");
const boardbtn = document.getElementById("board-btn");
const leaderBoard = document.getElementById("collection-board");
const leaderBoard1 = document.getElementById("leaderboard");
const boardSection = document.getElementById("leadership-br");

function showOnScreen(user) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.setAttribute("id", user.id);
  const textNode = `₹ ${user.amount}-  ${user.description}-  ${user.category}`;
  li.appendChild(document.createTextNode(textNode));
  expense.appendChild(li);

  var deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm float-end delete";
  // Append text node
  deleteBtn.appendChild(document.createTextNode("DELETE"));
  // Append delete btn to li
  li.appendChild(deleteBtn);
  expense.appendChild(li);

  // Add Edit Button//
  var editBtn = document.createElement("button");
  editBtn.className = "btn btn-secondary btn-sm float-end edit";
  editBtn.appendChild(document.createTextNode("EDIT"));
  li.appendChild(editBtn);
  expense.appendChild(li);
}

async function isPremium() {
  try {
    const user = await axios.get("http://localhost:4000/user/status", {
      headers: { Authorization: token },
    });
    // console.log(user)
    if (user.data === true) {
      razorpayBtn.style.display = "none";
      razorpayPr.style.display = "flex";
      boardbtn.style.display = "inline";
      boardSection.style.display = "block";
      // boardSection.style.display = "flex";
    }
  } catch (err) {
    console.log(err);
  }
}

boardbtn.addEventListener("click", showLeaderBoard);

async function showLeaderBoard(e) {
  e.preventDefault();
  try {
    leaderBoard1.style.display = "block";
    const users = await axios.get(
      "http://localhost:4000/premium/leadershipboard",
      { headers: { Authorization: token } }
    );
    // console.log(users);
    users.data.forEach((user) => {
      // console.log(user)
      showBoard(user);
    });
  } catch (err) {
    console.log(err);
  }
}

function showBoard(user) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  // li.setAttribute('id', user.id);
  const textNode = `Name: ${user.name}-  Total Expense:${user.totalExpense}`;
  li.appendChild(document.createTextNode(textNode));
  leaderBoard.appendChild(li);
}

async function showTotalExpense() {
  let sum = 0;
  const title = document.getElementById("expense-title");
  try {
    const response = await axios.get("http://localhost:4000/user/expense", {
      headers: { Authorization: token },
    });
    // console.log(response)
    response.data.forEach((user) => {
      sum += user.amount;
    });
    title.innerText = `Total Expenditure: ${sum}`;
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await axios.get("http://localhost:4000/user/expense", {
      headers: { Authorization: token },
    });
    // console.log(response)
    response.data.forEach((user) => {
      showOnScreen(user);
    });
    showTotalExpense();
    isPremium();
  } catch (err) {
    console.error(err);
  }
});
// listen on submit
myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  if (amount.value === "" || description.value === "") {
    // alert('Please enter all fields');
    msg.classList.add("error");
    msg.innerHTML = "Please enter all fields";

    // Remove error after 3 seconds
    setTimeout(() => msg.remove(), 3000);
  } else {
    var userExpense = {
      amount: amount.value,
      description: description.value,
      category: category.value,
    };
    try {
      const response = await axios.post(
        "http://localhost:4000/user/expense",
        userExpense,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      showOnScreen(response.data);
      //clear fields
      amount.value = "";
      description.value = "";
    } catch (err) {
      console.log(err);
    }
  }
}
//Remove item
expense.addEventListener("click", removeItem);

async function removeItem(e) {
  try {
    if (e.target.classList.contains("delete")) {
      if (confirm("Are You Sure?")) {
        var li = e.target.parentElement;
        id = li.id;
        await axios.delete(`http://localhost:4000/user/delete/${id}`, {
          headers: { Authorization: token },
        });
        expense.removeChild(li);
        showTotalExpense();
      }
    }
  } catch (err) {
    console.log(err);
  }
}
//Edit item//
expense.addEventListener("click", editUser);

async function editUser(e) {
  try {
    if (e.target.classList.contains("edit")) {
      var li = e.target.parentElement;
      id = li.id;
      const response = await axios.get(
        `http://localhost:4000/user/edit/${id}`,
        { headers: { Authorization: token } }
      );
      console.log(response);
      expense.removeChild(li);
      amount.value = response.data.amount;
      description.value = response.data.description;
      category.value = response.data.category;
      id = response.data.id;
      console.log(id);
      myForm.removeEventListener("submit", onSubmit);
      myForm.addEventListener("submit", updateItem);
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateItem(e) {
  // e.preventDefault();
  var updatedExpense = {
    amount: amount.value,
    description: description.value,
    category: category.value,
  };
  try {
    const response = await axios.put(
      `http://localhost:4000/user/edit/${id}`,
      updatedExpense,
      { headers: { Authorization: token } }
    );
    showOnScreen(response.data);
    myForm.removeEventListener("submit", updateItem);
    myForm.addEventListener("submit", onSubmit);
    showTotalExpense();
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}

razorpayBtn.addEventListener("click", payment);

async function payment(e) {
  try {
    if (e.target.classList.contains("membership")) {
      const response = await axios.get(
        "http://localhost:4000/purchase/premium",
        { headers: { Authorization: token } }
      );
      // console.log(response.data.order.id)
      var options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: async function (response) {
          await axios.post(
            "http://localhost:4000/purchase/updatetransactionstatus",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          );

          alert("You are a premium User");
          razorpayBtn.style.display = "none";
        },
      };
    }
  } catch (err) {
    console.log(err);
  }
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    axios.post(
      "http://localhost:4000/purchase/transactionfailstatus",
      response.error.metadata,
      { headers: { Authorization: token } }
    );
    alert("Transaction Failed");
  });
}
