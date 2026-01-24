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

function setMsg(obj) {
    document.getElementById("msg").textContent = JSON.stringify(obj, null, 2);
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
