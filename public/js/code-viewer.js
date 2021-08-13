const ATTRIBUTE_PREFIX = "data-code-viewer";
const ATTRIBUTE_CODE = `${ATTRIBUTE_PREFIX}-code`;
const ATTRIBUTE_LANGUAGE = `${ATTRIBUTE_PREFIX}-language`;
const SELECTOR = `[${ATTRIBUTE_PREFIX}]`;

const escapeHTML = (code) => code.replace(/\</g, "&lt;").replace(/\</g, "&gt;");

function initCodeSamples() {
  const $els = document.querySelectorAll(SELECTOR);

  Array.prototype.forEach.call($els, ($el) => {
    const code = $el.getAttribute(ATTRIBUTE_CODE);
    const language = $el.getAttribute(ATTRIBUTE_LANGUAGE);

    $el.innerHTML = `
      <div class="code-viewer">
        <div class="code-viewer-label">${language}</div>
            <code class="language-${
              language !== "text" ? language : "plaintext"
            }">${escapeHTML(code)}</code>
      </div>
    `;

    setTimeout(() => {
      const $code = $el.querySelector("code");

      if (!$code) {
        return;
      }

      hljs.highlightElement($code);
    }, 0);
  });
}

initCodeSamples();
