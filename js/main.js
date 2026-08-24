import "./tokens.js";
import "./components/ui-button.js";
import "./components/ui-textfield.js";
import "./components/ui-textarea.js";
import "./components/ui-checkbox.js";
import "./components/ui-toggle.js";
import "./components/ui-radio.js";
import "./components/ui-select.js";
import "./components/ui-badge.js";
import "./components/ui-card.js";
import "./components/ui-avatar.js";
import "./components/ui-alert.js";
import "./components/ui-tooltip.js";
import "./components/ui-spinner.js";
import "./components/ui-progress.js";
import "./components/ui-tabs.js";

const form = document.getElementById("demo-form");
const output = document.getElementById("demo-output");

function updateOutput() {
  const state = {
    name: document.getElementById("demo-name").value,
    bio: document.getElementById("demo-bio").value,
    color: document.getElementById("demo-color").value,
    plan: document.querySelector('ui-radio[name="demo-plan"][checked]')?.getAttribute("value") ?? null,
    subscribed: document.getElementById("demo-subscribe").checked,
    notify: document.getElementById("demo-notify").checked,
  };
  output.textContent = JSON.stringify(state, null, 2);
}

form.addEventListener("input", updateOutput);
form.addEventListener("change", updateOutput);

// Native form submission does not cross the shadow DOM boundary, so the
// submit button's click is handled directly rather than via a "submit" event.
document.getElementById("demo-submit").addEventListener("click", (e) => {
  e.preventDefault();
  updateOutput();
});

document.getElementById("hero-cta").addEventListener("click", () => {
  document.getElementById("components").scrollIntoView({ behavior: "smooth" });
});

updateOutput();
