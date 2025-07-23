export default function AccountSwitcher() {
  const [tokens, setTokens] = React.useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("switcher_tokens") || "[]");
    } catch {
      return [];
    }
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
    try {
      localStorage.token = `"${token}"`;
      alert("Switched token! Restart the app.");
    } catch (e) {
      alert("Failed to switch token.");
    }
  };

  return (
    <div style={{
      position: "absolute",
      top: 50,
      left: 10,
      background: "#2f3136",
      padding: 10,
      borderRadius: 10,
      zIndex: 9999
    }}>
      <h3 style={{ color: "white" }}>Account Switcher</h3>
      {tokens.map((token, index) => (
        <button
          key={index}
          onClick={() => switchToken(token)}
          style={{ marginBottom: 5, display: "block" }}
        >
          Switch to Account {index + 1}
        </button>
      ))}
      <button onClick={addToken} style={{ marginTop: 10 }}>➕ Add Token</button>
    </div>
  );
}
