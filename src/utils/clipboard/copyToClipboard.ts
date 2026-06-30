/**
 * Copy text to the clipboard with a fallback that also works outside a secure
 * context (plain HTTP). `navigator.clipboard` is only available on HTTPS or
 * localhost; when it is missing or rejects, we fall back to a hidden textarea +
 * `document.execCommand('copy')` so the clipboard is still overridden.
 *
 * Returns `true` only when the copy genuinely succeeded, so callers can show a
 * success toast only on real success.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  const value = text ?? "";

  // Preferred path: async Clipboard API (secure contexts only).
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // fall through to the legacy path below
    }
  }

  // Legacy fallback: works over HTTP and when the Clipboard API is blocked.
  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    // Keep it out of view and non-disruptive to scroll/focus.
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
};
