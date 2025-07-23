import { settings } from "replugged";
import { React, fluxDispatcher } from "replugged/common";

const tokenStore = settings.registerSettings("accountSwitcher", {
  tokens: {},
});

let switchAccountModal = null;

function reloadWithToken(token) {
  window.localStorage.token = `\"${token}\"`;
  location.reload();
}

function openSwitcher() {
  const savedTokens = tokenStore.get("tokens", {});
  const entries = Object.entries(savedTokens);

  switchAccountModal = replugged.webpack.getModule((m) => m?.showAlertModal);
  if (!switchAccountModal) return;

  switchAccountModal.showAlertModal(
    "Account Switcher",
    React.createElement("div", {},
      entries.length === 0
        ? "No saved tokens. Use /addtoken <name> <token> in chat."
        : React.createElement("ul", {},
            entries.map(([name, token]) =>
              React.createElement(
                "li",
                {
                  style: { marginBottom: "10px", cursor: "pointer", color: "#00b0f4" },
                  onClick: () => reloadWithToken(token),
                },
                `Switch to ${name}`
              )
            )
          )
    )
  );
}

function addTokenCommand() {
  fluxDispatcher.subscribe("MESSAGE_CREATE", ({ message }) => {
    if (!message?.content?.startsWith("/addtoken ")) return;

    const [_, name, token] = message.content.trim().split(" ");
    if (!name || !token) return;

    const current = tokenStore.get("tokens", {});
    current[name] = token;
    tokenStore.set("tokens", current);

    // Confirm in chat
    fluxDispatcher.dispatch({
      type: "MESSAGE_CREATE",
      message: {
        id: Date.now().toString(),
        content: `Saved token as '${name}'!`,
        channel_id: message.channel_id,
        author: message.author,
      },
    });
  });
}

export function start() {
  addTokenCommand();

  replugged.quicksettings.registerButton({
    label: "Switch Account",
    icon: "🔁",
    action: openSwitcher,
  });
}

export function stop() {
  replugged.quicksettings.unregisterButton("Switch Account");
  tokenStore.unregister();
}
