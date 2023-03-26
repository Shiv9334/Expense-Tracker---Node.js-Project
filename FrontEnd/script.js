const myForm = document.querySelector(".signup-form");
const msg = document.querySelector(".msg");
const Name = document.querySelector("#name");
const Email = document.querySelector("#email");
const Password = document.querySelector("#password");
const Password2 = document.querySelector("#password2");

let url = "http://localhost:4000/user/signup";

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault(e);
  try {
    if (Password.value !== Password2.value) {
      msg.classList.add("error");
      msg.textContent = "Please Check Your Password";
      setTimeout(() => msg.remove(), 3000);
    } else {
      const user = {
        name: Name.value,
        email: Email.value,
        password: Password.value,
      };
      const response = await axios.post(url, user);
    }
  } catch (err) {
    console.log(err);
  }
}
