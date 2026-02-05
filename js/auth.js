const BASE = "/authsite";
const DEFAULT_LANG = "uk";

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

const normalizeText = (text) =>
    String(text || "")
        .trim()
        .replace(/\s+/g, " ");

const messageLookup = new Map();
Object.entries(translations).forEach(([, dict]) => {
    Object.entries(dict).forEach(([key, value]) => {
        if (key.startsWith("msg.")) {
            messageLookup.set(normalizeText(value), key);
        }
    });
});

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function getLanguage() {
    return localStorage.getItem("lang") || DEFAULT_LANG;
}

function t(key) {
    const lang = getLanguage();
    return (
        translations[lang]?.[key] ||
        translations[DEFAULT_LANG]?.[key] ||
        key
    );
}

function applyTranslations() {
    $$("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        el.textContent = t(key);
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.setAttribute("placeholder", t(key));
    });

    const sel = $("#langSelect");
    if (sel) sel.value = getLanguage();

    if (lastMsgKey) {
        setMsg({ messageKey: lastMsgKey });
    }
}

function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    applyTranslations();
}

document.addEventListener("DOMContentLoaded", init);

let lastMsgKey = "";

function init() {
    applyTranslations();

    const langSelect = $("#langSelect");
    if (langSelect) {
        langSelect.addEventListener("change", (e) =>
            setLanguage(e.target.value)
        );
    }

    const form = $("#authForm");
    if (form) {
        form.addEventListener("submit", onAuthSubmit);
    }

    const logoutBtn = $("[data-action='logout']");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }

    $$("[data-nav]").forEach((el) => {
        el.addEventListener("click", () => {
            window.location.href = el.dataset.nav;
        });
    });

    if ($("#who")) loadProfile();
}

async function api(path, options = {}) {
    const method = options.method || "GET";
    const body = options.body;
    const headers = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const res = await fetch(`${BASE}/api/${path}`, {
        method,
        headers,
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
}

function setMsg(serverData = {}) {
    const el = document.getElementById("msg");
    if (!el) return;

    if (serverData.messageKey) {
        lastMsgKey = serverData.messageKey;
        el.textContent = t(serverData.messageKey);
    } else if (serverData.message) {
        const normalized = normalizeText(serverData.message);
        const key =
            normalized.startsWith("msg.") ? normalized : messageLookup.get(normalized);
        lastMsgKey = key || "";
        el.textContent = key ? t(key) : serverData.message;
    } else {
        lastMsgKey = "";
        el.textContent = "";
    }
}

async function onAuthSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const action = form.dataset.action;
    if (!action) return;

    const email = (form.elements.email?.value || "").trim();
    const password = form.elements.password?.value || "";

    const result = await api(`${action}.php`, {
        method: "POST",
        body: { email, password },
    });

    setMsg(result.data);

    if (result.ok) window.location.href = `${BASE}/profile.html`;
}

async function loadProfile() {
    const result = await api("me.php");
    const email = result.data?.user?.email;

    if (!result.ok || !email) {
        window.location.href = `${BASE}/index.html`;
        return;
    }

    $("#who").textContent = email;
}

async function logoutUser() {
    const result = await api("logout.php", { method: "POST", body: {} });
    setMsg(result.data);

    setTimeout(() => {
        window.location.href = `${BASE}/index.html`;
    }, 300);
}
