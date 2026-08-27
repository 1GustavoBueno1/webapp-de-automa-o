import { Api } from "./api.js";
import { requireAuth } from "./auth.js";
import { renderLayout, showAlert, clearAlert, handleApiError } from "./ui.js";

const user = requireAuth(["ADMIN"]);

if (user) {
    renderLayout("usuarios", "Usuários");

    const alertBox = document.getElementById("usuarios-alert");
    const form = document.getElementById("usuario-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAlert(alertBox);

        const payload = {
            nome: document.getElementById("usuario-nome").value.trim(),
            email: document.getElementById("usuario-email").value.trim(),
            senha: document.getElementById("usuario-senha").value,
            role: document.getElementById("usuario-role").value,
        };

        const submitBtn = form.querySelector("button[type=submit]");
        submitBtn.disabled = true;

        try {
            const resultado = await Api.cadastrarUsuario(payload);
            showAlert(alertBox, resultado.message || "Usuário cadastrado com sucesso.", "success");
            form.reset();
        } catch (error) {
            handleApiError(error, alertBox);
        } finally {
            submitBtn.disabled = false;
        }
    });
}
