const myForm = document.querySelector(".login-form");
const msg = document.querySelector(".msg");
const Email = document.querySelector("#email");
const Password = document.querySelector("#password");
let url = "http://localhost:4000/user/login";

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();
  try {
    const user = {
      email: Email.value,
      password: Password.value,
    };
    const response = await axios.post(url, user);
    console.log(response.data);
    if (response === 200) {
      localStorage.setItem("token", response.data.token);
      alert("LogIn Successful!!!");
      window.location.href = "../ExpenseTracker/index.html";
    } else {
      throw new Error("Failed to login");
    }
  } catch (err) {
    msg.classList.add("warning");
    alert("Something went Wrong");
    msg.textContent = err.response.data.error;
    setTimeout(() => msg.remove(), 3000);
  }
}
