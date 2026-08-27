// Lógica exclusiva da tela de login (DOM). Regras de sessão ficam em auth.js.

import { login, getCurrentUser } from "./auth.js";
import { showAlert, clearAlert } from "./ui.js";

if (getCurrentUser()) {
    window.location.href = "pages/dashboard.html";
}

const form = document.getElementById("login-form");
const alertBox = document.getElementById("login-alert");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAlert(alertBox);

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Entrando...";

    try {
        await login(email, senha);
        window.location.href = "pages/dashboard.html";
    } catch (error) {
        showAlert(alertBox, error.message || "Não foi possível entrar.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Entrar";
    }
});
