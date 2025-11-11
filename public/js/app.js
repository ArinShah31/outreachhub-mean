// public/js/app.js

const API_BASE = "http://localhost:3000";
const LS_AUTH_KEY = "ohub.auth";

const authStore = {
  get() {
    try { return JSON.parse(localStorage.getItem(LS_AUTH_KEY) || "null"); }
    catch { return null; }
  },
  set(obj) { localStorage.setItem(LS_AUTH_KEY, JSON.stringify(obj)); },
  clear() { localStorage.removeItem(LS_AUTH_KEY); }
};

// --- Universal fetch wrapper with JWT token ---
async function apiFetch(path, opts = {}) {
  const auth = authStore.get();
  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", "application/json");
  if (auth?.token) headers.set("Authorization", `Bearer ${auth.token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (res.status === 401) {
    authStore.clear();
    location.href = "index.html";
    throw new Error("Unauthorized or expired token");
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.json()).message || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// --- AUTH APIs ---
const authApi = {
  // POST /auth/login { username, password }
  async login(username, password) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    // expects: { token, user: { username, role } }
    authStore.set({ token: data.token, user: data.user, ts: Date.now() });
    return data;
  },
  async logout() {
    try { await apiFetch("/auth/logout", { method: "POST" }); } catch {}
    authStore.clear();
  }
};

// --- CONTACTS APIs ---
const contactsApi = {
  // GET /contacts?page&limit&sortBy&sortOrder
  list({ page = 1, limit = 10, sortBy = "name", sortOrder = "asc" } = {}) {
    const params = new URLSearchParams({ page, limit, sortBy, sortOrder });
    return apiFetch(`/contacts?${params.toString()}`);
  },
  details(id) { return apiFetch(`/contacts/${id}`); },
  // POST /contacts
  create(contact) { return apiFetch(`/contacts`, { method: "POST", body: JSON.stringify(contact) }); },
  // PUT /contacts/:id
  update(id, contact) { return apiFetch(`/contacts/${id}`, { method: "PUT", body: JSON.stringify(contact) }); },
  // DELETE /contacts/:id
  remove(id) { return apiFetch(`/contacts/${id}`, { method: "DELETE" }); }
};

// --- Role helpers ---
function isEditor() { return authStore.get()?.user?.role === "editor"; }
function isViewer() { return authStore.get()?.user?.role === "viewer"; }

// --- Convenience selectors ---
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function html(strings, ...vals) { return strings.map((s, i) => s + (vals[i] ?? "")).join(""); }

// --- Logout wiring for nav ---
function wireHeader() {
  const nav = qs("header nav");
  if (!nav) return;
  const logout = qsa("a", nav).find(a => /logout/i.test(a.textContent));
  if (logout) {
    logout.addEventListener("click", async e => {
      e.preventDefault();
      await authApi.logout();
      location.href = "index.html";
    });
  }
}

// --- PAGE BOOTSTRAPS --- //
async function bootLoginPage() {
  const form = qs("form[action='home.html'],form[action='index.html']");
  if (!form) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const username = qs("#username").value.trim();
    const password = qs("#password").value;
    try {
      await authApi.login(username, password);
      location.href = "home.html";
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  });
}

// --- Contacts List (contacts-list.html) ---
async function bootContactsList() {
  await ensureAuthOrRedirect();
  const table = qs("table");
  if (!table) return;
  const url = new URL(location.href);
  let page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 10;

  // Hide 'Add contact' if not editor
  const addBtn = qsa("a.btn.btn--primary").find(a => /add contact/i.test(a.textContent));
  if (addBtn && !isEditor()) addBtn.style.display = "none";

  async function load() {
    try {
      const data = await contactsApi.list({ page, limit });
      renderRows(data.items || []);
      renderPager(data.total || 0);
    } catch (err) {
      alert(`Failed to load contacts: ${err.message}`);
    }
  }

  function renderRows(items) {
    const tbody = qs("tbody", table);
    tbody.innerHTML = items.map(c => html`
      <tr>
        <td>${c.name}</td>
        <td>${c.phone || ""}</td>
        <td>${Array.isArray(c.tags) ? c.tags.join(", ") : c.tags || ""}</td>
        <td>
          <a class="btn" href="contact-view.html?id=${encodeURIComponent(c.id)}">View</a>
          ${isEditor() ? html`
            <a class="btn" href="contact-edit.html?id=${encodeURIComponent(c.id)}">Edit</a>
            <a class="btn btn--danger" href="#" data-del="${encodeURIComponent(c.id)}">Delete</a>
          ` : ""}
        </td>
      </tr>
    `).join("");

    qsa("a[data-del]").forEach(a => {
      a.addEventListener("click", async e => {
        e.preventDefault();
        const id = a.getAttribute("data-del");
        if (!confirm("Delete this contact?")) return;
        try {
          await contactsApi.remove(id);
          await load();
        } catch (err) {
          alert(`Delete failed: ${err.message}`);
        }
      });
    });
  }

  function renderPager(total) {
    let pager = qs("nav.pager") || (() => {
      const n = document.createElement("nav");
      n.setAttribute("aria-label", "Pagination");
      n.className = "pager";
      table.after(n);
      return n;
    })();
    const pages = Math.max(1, Math.ceil(total / limit));
    const links = [];
    for (let p = 1; p <= pages && p <= 10; p++) {
      links.push(html`<a href="?page=${p}" class="${p === page ? "active" : ""}">${p}</a>`);
    }
    if (page < pages) links.push(html`<a href="?page=${page + 1}">Next »</a>`);
    pager.innerHTML = links.join(" ");
    qsa("a", pager).forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const u = new URL(a.href, location.href);
        page = parseInt(u.searchParams.get("page") || "1", 10);
        history.pushState({}, "", `?page=${page}`);
        load();
      });
    });
  }

  await load();
}

// --- Contact View ---
async function bootContactView() {
  await ensureAuthOrRedirect();
  const id = new URL(location.href).searchParams.get("id");
  if (!id) return;
  try {
    const c = await contactsApi.details(id);
    const section = qsa("section").find(Boolean) || document.body;
    section.innerHTML = html`
      <p><strong>Name:</strong> ${c.name}</p>
      <p><strong>Phone:</strong> ${c.phone || ""}</p>
      <p><strong>Tags:</strong> ${Array.isArray(c.tags) ? c.tags.join(", ") : c.tags || ""}</p>
      <p style="margin-top:12px;">
        ${isEditor() ? `<a href="contact-edit.html?id=${encodeURIComponent(id)}" class="btn">Edit</a>` : ""}
        <a href="contacts-list.html" class="btn">Back to list</a>
      </p>
    `;
  } catch (err) {
    alert(`Failed to load contact: ${err.message}`);
  }
}

// --- Contact Edit ---
async function bootContactEdit() {
  await ensureAuthOrRedirect();
  if (!isEditor()) {
    alert("You do not have permission to edit contacts.");
    location.href = "contacts-list.html";
    return;
  }

  const form = qs("form");
  if (!form) return;

  const id = new URL(location.href).searchParams.get("id");

  // If editing, fill the form
  if (id) {
    try {
      const c = await contactsApi.details(id);
      if (qs("#name")) qs("#name").value = c.name || "";
      if (qs("#phone")) qs("#phone").value = c.phone || "";
      if (qs("#tags")) qs("#tags").value = Array.isArray(c.tags) ? c.tags.join(", ") : c.tags || "";
    } catch (err) {
      alert("Failed to load contact");
    }
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const payload = {
      name: qs("#name").value.trim(),
      phone: qs("#phone").value.trim(),
      tags: (qs("#tags").value || "").split(",").map(x => x.trim()).filter(Boolean)
    };
    try {
      if (id) await contactsApi.update(id, payload);
      else await contactsApi.create(payload);
      location.href = "contacts-list.html";
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  });
}

// --- Auth guard ---
async function ensureAuthOrRedirect() {
  const auth = authStore.get();
  if (!auth?.token) {
    location.href = "index.html";
    throw new Error("Not authenticated");
  }
}

// --- Boot setup by page ---
document.addEventListener("DOMContentLoaded", () => {
  wireHeader();
  const path = location.pathname;
  if (path.endsWith("index.html")) bootLoginPage();
  if (path.endsWith("contacts-list.html")) bootContactsList();
  if (path.endsWith("contact-view.html")) bootContactView();
  if (path.endsWith("contact-edit.html")) bootContactEdit();
});
