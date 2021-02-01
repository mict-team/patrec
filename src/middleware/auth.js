// src/middleware/auth.js
import { LS } from "../shared/config.js";
export default function auth({ next, router }) {
  if (!LS.get("user")) {
    return router.push({ name: "logins" });
  }

  return next();
}
