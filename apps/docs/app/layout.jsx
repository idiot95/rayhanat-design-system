/* The token stylesheet is imported ONCE, here, exactly as a product would. */
import "@al-rayhaanat/system/tokens.css";
import { Chrome } from "./chrome.jsx";

export const metadata = {
  title: "al-Rayhaanat Design System",
  description:
    "Tokens, components and layout for Daeratul Aqeeq products — every component, both themes, both directions."
};

/**
 * `data-theme`, `dir` and `lang` are set here as the server-rendered default and
 * mutated on the element by the chrome's toggles. Nothing else in the app reads
 * them: there is no provider and no useTheme(), which is the point being
 * demonstrated.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" data-theme="light">
      <body style={{ margin: 0, background: "var(--canvas)", color: "var(--text-primary)" }}>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
