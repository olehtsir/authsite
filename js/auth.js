const translations = {
    uk: {
        "login.title": "Вхід",
        "login.button": "Увійти",
        "login.noAccount": "Немає акаунту?",
        "login.toRegister": "Зареєструватись",

        "register.title": "Реєстрація",
        "register.button": "Створити акаунт",
        "register.haveAccount": "Вже є акаунт?",
        "register.toLogin": "Увійти",

        "profile.title": "Профіль",
        "profile.loggedAs": "Ти залогінений як:",
        "profile.logout": "Вийти",
        "profile.home": "На головну",

        "form.email": "Email",
        "form.password": "Пароль",
        "form.passwordMin": "Пароль (мін 6 символів)",

        // повідомлення (для API)
        "msg.registered": "Реєстрація успішна ✅",
        "msg.loggedIn": "Вхід успішний ✅",
        "msg.loggedOut": "Ви вийшли ✅",
        "msg.invalid": "Неправильний email або пароль",
        "msg.emailUsed": "Цей email вже зареєстрований",
        "msg.badEmail": "Невірний email",
        "msg.shortPass": "Пароль мінімум 6 символів",
        "msg.notAuth": "Ви не авторизовані",
    },

    en: {
        "login.title": "Login",
        "login.button": "Sign in",
        "login.noAccount": "No account?",
        "login.toRegister": "Create one",

        "register.title": "Register",
        "register.button": "Create account",
        "register.haveAccount": "Already have an account?",
        "register.toLogin": "Sign in",

        "profile.title": "Profile",
        "profile.loggedAs": "You are logged in as:",
        "profile.logout": "Logout",
        "profile.home": "Home",

        "form.email": "Email",
        "form.password": "Password",
        "form.passwordMin": "Password (min 6 characters)",

        "msg.registered": "Registered successfully ✅",
        "msg.loggedIn": "Logged in ✅",
        "msg.loggedOut": "Logged out ✅",
        "msg.invalid": "Wrong email or password",
        "msg.emailUsed": "This email is already used",
        "msg.badEmail": "Invalid email",
        "msg.shortPass": "Password must be at least 6 characters",
        "msg.notAuth": "Not authorized",
    },

    fr: {
        "login.title": "Connexion",
        "login.button": "Se connecter",
        "login.noAccount": "Pas de compte ?",
        "login.toRegister": "Créer un compte",

        "register.title": "Inscription",
        "register.button": "Créer un compte",
        "register.haveAccount": "Déjà un compte ?",
        "register.toLogin": "Se connecter",

        "profile.title": "Profil",
        "profile.loggedAs": "Connecté en tant que :",
        "profile.logout": "Déconnexion",
        "profile.home": "Accueil",

        "form.email": "Email",
        "form.password": "Mot de passe",
        "form.passwordMin": "Mot de passe (min 6 caractères)",

        "msg.registered": "Inscription réussie ✅",
        "msg.loggedIn": "Connexion réussie ✅",
        "msg.loggedOut": "Déconnecté ✅",
        "msg.invalid": "Email ou mot de passe incorrect",
        "msg.emailUsed": "Cet email est déjà utilisé",
        "msg.badEmail": "Email invalide",
        "msg.shortPass": "Mot de passe min 6 caractères",
        "msg.notAuth": "Non autorisé",
    },
};

function getLanguage() {
    return localStorage.getItem("lang") || "uk";
}

function t(key) {
    const lang = getLanguage();
    return translations[lang]?.[key] || translations.uk[key] || key;
}

function applyTranslations() {
    // тексти
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        el.textContent = t(key);
    });

    // placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.setAttribute("placeholder", t(key));
    });

    // селект мови в правильному стані
    const sel = document.getElementById("langSelect");
    if (sel) sel.value = getLanguage();
}

function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    applyTranslations();
}

// запуск при відкритті сторінки
document.addEventListener("DOMContentLoaded", applyTranslations);

async function post(path, body) {
    const res = await fetch(`/authsite/api/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
}

async function get(path) {
    const res = await fetch(`/authsite/api/${path}`, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
}

function setMsg(serverData) {
    const el = document.getElementById("msg");
    if (!el) return;

    if (serverData.messageKey) {
        el.textContent = t(serverData.messageKey);
    } else if (serverData.message) {
        el.textContent = serverData.message; // fallback
    } else {
        el.textContent = "";
    }
}

async function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const result = await post("register.php", { email, password });
    setMsg(result.data);

    if (result.ok) window.location.href = "/authsite/profile.html";
}

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const result = await post("login.php", { email, password });
    setMsg(result.data);

    if (result.ok) window.location.href = "/authsite/profile.html";
}

async function loadProfile() {
    const result = await get("me.php");

    if (!result.ok) {
        window.location.href = "/authsite/index.html";
        return;
    }

    document.getElementById("who").textContent = result.data.user.email;
}

async function logoutUser() {
    const result = await post("logout.php", {});
    setMsg(result.data);

    setTimeout(() => {
        window.location.href = "/authsite/index.html";
    }, 300);
}
