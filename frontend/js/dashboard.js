import { requireAuth } from "./auth.js";
import { renderLayout } from "./ui.js";

const user = requireAuth();

if (user) {
    renderLayout("dashboard", "Dashboard");

    if (user.role === "ADMIN") {
        document.getElementById("dash-usuarios-card").hidden = false;
    }
}
