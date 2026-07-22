# Nox — Privacy Policy

**Nox** is a browser extension that forces dark mode on every website. This
policy explains, plainly and completely, what data the extension handles, how it
is used, and the choices you have.

> **Last updated:** 2026-07-21 · **Effective:** 2026-07-21

Nox is built to be private by default. It makes **no network requests**, sends
nothing to any server, and collects no analytics. The entire source code is
public in the [Nox repository](https://github.com/kjshuvo/nox) — this document
describes exactly what that code does, nothing more.

---

## The data we handle

Nox handles only the two pieces of information needed to do its job:

1. **Your on/off preference** — a single true/false value for whether dark mode
   is enabled.
2. **Your ignore list** — a list of website hostnames (e.g. `example.com`) that
   **you explicitly choose** to keep in their original theme, by clicking the
   *“Ignore this site”* button in the popup.

That is all. Specifically, Nox does **not** handle:

- Accounts, names, email addresses, or any other personally identifiable
  information.
- Your broader browsing history. The only hostnames ever stored are the ones you
  deliberately add to the ignore list.
- Page content, form data, messages, or media.
- Authentication data, cookies, passwords, or financial/payment information.

To decide whether to apply dark mode, Nox does read the hostname of the page you
are currently viewing — but that hostname is only **stored** when you add it to
the ignore list. It is never recorded anywhere else.

## How we use it

- The **on/off preference** decides whether the dark-mode filter is applied.
- The **ignore list** decides which sites stay in their original theme.

Both are core, user-facing features of the extension. The data is never used for
any other purpose.

## Where it is stored

Your preference and ignore list are stored **locally in your browser** and, if
you have syncing enabled, synced through **your own Google account via Chrome
Sync**. Chrome Sync is governed by [Google’s Privacy Policy](https://policies.google.com/privacy)
and remains under your control. **Nox never sends your data to any
developer-run server** — there is no server to send it to.

## Data we do **not** collect

To be explicit, Nox does **not** collect, transmit, or share:

- Telemetry, analytics, or usage statistics.
- Crash or error reports.
- Advertising identifiers or device identifiers.
- Any information for advertising, profiling, or market research.

The extension works fully offline. There is no code in it that makes a network
request on your behalf.

## Limited Use disclosure

Nox complies with the Chrome Web Store [User Data Policy](https://developer.chrome.com/docs/webstore/program-policies),
including the **Limited Use** requirements. Specifically:

- **Allowed use.** Any data Nox handles is used **only** to provide or improve
  its single purpose and user-facing features (applying dark mode and remembering
  your ignored sites). It is not used for any unrelated purpose.
- **Allowed transfer.** Nox does **not** transfer your data to others. The only
  movement of data is through Chrome Sync, which you control via your Google
  account and which is necessary to provide the sync feature itself.
- **Prohibited advertising.** Nox **never** uses or transfers user data to serve
  personalized, re-targeted, or interest-based advertising.
- **Prohibited human interaction.** No human ever reads your data. There is no
  service on the receiving end, and nothing leaves your browser/account.

## Security

- **Strict Content Security Policy** — `script-src 'self'; object-src 'self'`.
  No remote code, no `eval`, and inline scripts cannot execute.
- **No dependencies and no build step** — the files in the repository are exactly
  what run in your browser. Nothing is fetched or loaded from the network.
- **Public source** — everything Nox does is auditable in the open repository.

## Retention and your control

Your preference and ignore list are kept only for as long as you use Nox. You
can view, change, or delete them at any time:

- **On/off:** toggle the switch in the popup.
- **Ignore list:** click *“Stop ignoring this site”* on any ignored site, or
  remove sites by clearing the extension’s storage.
- **Everything:** remove the extension entirely from `chrome://extensions`, or
  turn off / clear Chrome Sync in your browser to remove synced copies.

Because no data is transmitted to the developer, uninstalling the extension (and,
if applicable, clearing Chrome Sync) fully removes everything Nox has stored.

## Children’s privacy

Nox is not directed at children and does not knowingly collect any data from
them. No age-related information is collected.

## Changes to this policy

If Nox’s data practices change in a material way, this page will be updated with
a new “Last updated” date, and the change will ship with a new extension version.

## Contact

Questions about this policy or Nox’s data practices? Please open an issue on the
[Nox GitHub repository](https://github.com/kjshuvo/nox/issues) or reach the
maintainer via the [KJ Shuvo GitHub profile](https://github.com/kjshuvo).
