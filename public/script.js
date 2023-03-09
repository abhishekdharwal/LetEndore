import { signup } from "../controller/admin";

function ChangeRoute() {
  window.location.href = "/login";
}

function ChangeRoutetoLogin() {
  window.location.href = "/";
}
let signupForm = document.getElementById("signupform");
console.log(signupForm);
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("asa");
  console.log();
});
