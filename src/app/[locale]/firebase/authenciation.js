"use client";

// All auth goes through PersonalHub-Back via Next.js rewrites (/api/* → backend).
// No backend URL or Supabase keys are ever exposed to the browser.

const apiFetch = (path, options = {}) =>
  fetch(path, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });

// Normalize the backend /auth/user response to match the Firebase user shape.
const normalizeUser = (data) => {
  if (!data) return null;
  return {
    uid: data.id,
    id: data.id,
    email: data.email,
    displayName: data.username || data.full_name || null,
    photoURL: data.avatar_url || null,
    metadata: { creationTime: data.created_at },
    // Keep the raw backend fields accessible too
    username: data.username,
    avatar_url: data.avatar_url,
  };
};

// ── Internal auth state ───────────────────────────────────────────────────────

let _currentUser = null;
let _listeners = [];
let _initPromise = null;

const notifyListeners = (user) => _listeners.forEach((cb) => cb(user));

const initAuth = () => {
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    if (typeof window === "undefined") return;
    try {
      const res = await apiFetch("/api/auth/user");
      _currentUser = res.ok ? normalizeUser(await res.json()) : null;
    } catch {
      _currentUser = null;
    }
    notifyListeners(_currentUser);
  })();
  return _initPromise;
};

// Kick off the session check as soon as the module loads.
initAuth();

// ── auth object (drop-in for firebase's `auth`) ───────────────────────────────

export const auth = {
  get currentUser() {
    return _currentUser;
  },
  onAuthStateChanged(callback) {
    _listeners.push(callback);
    // Fire immediately: either with current state or after init resolves.
    initAuth().then(() => callback(_currentUser));
    return () => {
      _listeners = _listeners.filter((l) => l !== callback);
    };
  },
};

// ── Named function exports (match firebase/auth named imports) ────────────────

export const onAuthStateChanged = (authObj, callback) =>
  authObj.onAuthStateChanged(callback);

export const signInWithEmailAndPassword = async (_authObj, email, password) => {
  const res = await apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Login failed");
  }
  const data = await res.json();
  const user = normalizeUser(data.user);
  _currentUser = user;
  notifyListeners(user);
  return { user };
};

export const createUserWithEmailAndPassword = async (
  _authObj,
  email,
  password,
  username
) => {
  const res = await apiFetch("/api/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Signup failed");
  }
  const data = await res.json();
  const user = normalizeUser(data.user);
  _currentUser = user;
  notifyListeners(user);
  return { user };
};

export const signOut = async (_authObj) => {
  await apiFetch("/api/logout", { method: "POST" });
  _currentUser = null;
  notifyListeners(null);
};

// Updates displayName → username, photoURL → avatar_url via the backend.
export const updateProfile = async (_user, { displayName, photoURL } = {}) => {
  const body = {};
  if (displayName !== undefined) body.username = displayName;
  if (photoURL !== undefined) body.avatarUrl = photoURL;
  const res = await apiFetch("/api/update-profile", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Profile update failed");
  }
  if (_currentUser) {
    if (displayName !== undefined) _currentUser.displayName = displayName;
    if (photoURL !== undefined) _currentUser.photoURL = photoURL;
    notifyListeners({ ..._currentUser });
  }
};

// Note: the backend /change-password requires both old and new password.
// The setting page already has both inputs; the calling code should pass currentPassword too.
// Signature: updatePassword(user, newPassword, currentPassword)
export const updatePassword = async (_user, newPassword, currentPassword) => {
  const res = await apiFetch("/api/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Password change failed");
  }
};

export const updateEmail = async (_user, newEmail) => {
  const res = await apiFetch("/api/update-profile", {
    method: "PATCH",
    body: JSON.stringify({ email: newEmail }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Email update failed");
  }
};

export const reauthenticateWithCredential = async () => {};
export const getAuth = () => auth;

// Stubs for imports that still reference these — replaced in Step 2.
export const provider = null;
export const db = null;
export const storage = null;
export const firestore = null;
export const storageRef = null;
export const getStorageRef = () => null;

export default auth;
