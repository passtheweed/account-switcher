import { React, storage } from "replugged"; // or whatever import system Revenge uses
import { showToast } from "somewhere-in-revenge"; // replace with actual utility

type Token = string;

export function AccountSwitcher(): JSX.Element {
  const [tokens, setTokens] = React.useState<Token[]>(() => {
    return JSON.parse(localStorage.getItem("switcher_tokens") || "[]");
  });

  const addToken = () => {
    const input = prompt("Enter token:");
    if (input) {
      const newTokens = [...tokens, input];
      localStorage.setItem("switcher_tokens", JSON.stringify(newTokens));
      setTokens(newTokens);
    }
  };

  const switchToken = (token: string) => {
    localStorage.token = `"${token}"`;
    showToast("Switched accounts. Please restart the app.", { type: "info" });
  };

  return (
    <div style={{
      position: "absolute",
      top: 50,
      left: 10,
      backgroundColor: "#1e1e1e",
      padding: 12,
      borderRadius: 10,
      zIndex: 9999,
    }}>
      <h3 style={{ color: "#fff", marginBottom: 10 }}>Account Switcher</h3>

      {tokens.map((token, i) => (
        <button
          key={i}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
          onClick={() => switchToken(token)}
        >
          Switch to Account {i + 1}
        </button>
      ))}

      <button onClick={addToken} style={{ marginTop: 10, backgroundColor: "#3a3" }}>
        ➕ Add New Token
      </button>
    </div>
  );
}
