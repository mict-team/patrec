// src/middleware/auth.js
export default function auth({ next, router }) {
  if (!localStorage.getItem("me")) {
    return router.push({ name: "login" });
  }

  return next();
}
