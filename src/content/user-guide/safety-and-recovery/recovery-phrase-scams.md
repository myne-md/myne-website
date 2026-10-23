---
title: "When a page asks for your recovery phrase"
category: "safety-and-recovery"
updated: 2026-10-22
summary: "Where Myne's browser client asks for your 24 words now that one phrase is the account: the deliberate identity and unlock actions it belongs to, the situations it does not belong to, what someone gains if they get the words, and what Myne cannot check for you."
tags: ["recovery", "security", "privacy"]
---

One phrase now opens every vault you own, so there is no longer a single situation in which a browser asks for your 24 words. This article says where the words belong, where they do not, what someone gains if they get them out of you, and what Myne cannot check for you.

## Where the words belong

In a browser, Myne asks for your phrase only inside an action **you** started, and only for one of these:

- **Creating your identity**, and typing four of its words back to prove you wrote them down.
- **Registering the identity** with a sync server, where the words prove the identity is yours.
- **Unlocking a vault** whose recovery credential is your identity rather than a vault phrase. On such a vault the recovery link under the password field reads **Use your identity phrase**.
- **Joining a device** to your account, where the words prove the device belongs to you.
- **A recovery you started yourself**, after forgetting a password.

Two situations the words do not belong to, and they are the half you can act on:

- **Signing in to an existing account to reach its notes** takes the account number and a password, not the phrase.
- **The vault of someone who invited you** opens with the password you set for this device. Your phrase is the portable way back in, not the everyday door.

A page that asks outside those actions is not Myne. That inference is weaker than it used to be, because the list is longer than one line, and this article will not pretend otherwise: **read the address, and never type the words into a page a message or an email sent you to.**

This rule is newer than the app. The browser client could not create an account or recover one until recently, so it had no reason to ask for the phrase at all, and for a while "a web page asking for your Myne phrase is fake" needed no thought. It can create and recover now. The rule above replaces what used to be a plain fact, which is why it is worth learning rather than assuming.

## What someone gains if you type them

This comes before the advice, because it is what the advice is for. Anyone holding your 24 words and your account number can open your vault from anywhere in the world, read everything in it, and keep reading it:

- **Your device is not involved.** They do not need a machine of yours, and nothing on your side approves the access or notices it.
- **Changing your password does not help.** The phrase is a second, independent key to the same vault, and a password change rewrites only the password's copy. The words keep working.
- **There is no revoke and no rotate.** Myne cannot cancel a recovery phrase, replace it with a new one, or recover it for you, because it never held a copy. See [Your recovery phrase](/user-guide/getting-started/your-recovery-phrase/).
- **It reaches backwards too.** The phrase opens every backup ever made of that vault, including ones taken before today.

If you have already typed your phrase into a page you are not sure about, treat the phrase as exposed. Because it cannot be changed, the only way to stop it opening your vault is to create a new vault and move your notes into it.

## Before you type the words

1. **Check the address bar**, character by character, before the first word goes in. There is no Myne-run address to memorise any more: the browser client is one you or somebody you know runs, so the address is one you were told out of band. A lookalike address is the entire attack.
2. **Distrust the way you arrived.** If a link in a message, an email, a chat, or a search result put you on that page, do not type the phrase there. Close it, type the address yourself, or use a bookmark you made.
3. **Ask who started this.** A recovery is something you begin, from the unlock screen, by choosing **Forgot your password? Unlock with recovery phrase**. A page that offers to recover your account before you asked is answering a question you did not ask.
4. **When in doubt, use an app instead.** Do the recovery in the desktop or mobile app, where no web address can impersonate the app. The flow is the same and ends the same way. See [If you forget your password](/user-guide/safety-and-recovery/if-you-forget-your-password/).

Nothing here is urgent in the way a fake page will tell you it is. A recovery that waits ten minutes while you check the address costs you nothing.

## A browser extension can read the page

This one is not about a fake page, and no rule you apply prevents it. A browser extension you have granted access to a site reads everything that site shows and everything you type into it: your recovery phrase while it is on screen at creation, the words you type while recovering, and your master password every time you unlock.

That is how extensions work. No setting in Myne changes it, and the page cannot detect it or shield itself from it. Myne says so on the phrase step when you create a vault in a browser; it cannot say so usefully everywhere the exposure exists.

The remedy is to move the sensitive steps somewhere an extension is not: create your account and do any recovery in the desktop or mobile app, or use a clean browser profile for those steps. It matters most for the phrase, because it is the one credential a password change does not rotate.

## What this does not change

- **The desktop and mobile apps do not have this problem.** An app installed on your machine cannot be impersonated by a web address: it is a file you downloaded once and kept, rather than code re-delivered from an address on every visit. See [Myne in your browser](/user-guide/getting-started/myne-in-your-browser/) for how the two differ.
- **A browser asks in more places than it used to**, and that is expected rather than suspicious: the identity actions above became possible when one phrase became the account. The [vault format upgrade](/user-guide/safety-and-recovery/upgrade-your-vault-format/) is still offered only in the desktop and mobile apps.
- **Nothing about how your notes are encrypted is affected.** This page is about a credential being talked out of you, not about the vault's protection failing.

## Limits

**Myne cannot tell you that a page is fake.** There is no check in the app, no warning, and no list of bad addresses. The rule at the top of this page is one you apply; it is not one the software applies for you. What Myne can do is state where it asks and where it does not, because the browser now asks in several deliberate situations: creating or registering an identity, joining a device, and unlocking a vault whose recovery credential is the identity. There is no longer a one-place rule to learn, and this page will not pretend there is. That is disclosure, not prevention, and the difference is worth being clear about: it stops nobody who types 24 words into a lookalike address.

The protections that make the real client trustworthy do not touch this. Reproducible builds, the bundle-hash record, the strict content policy, and the certificate check against public authorities all address a Myne bundle or a Myne connection being tampered with. A phishing page is neither: it is an ordinary web page at an address that is not Myne's, and it can be served over a perfectly valid, perfectly secure connection. Likewise, the measures that bind the honest address to an encrypted connection say nothing at all about a different address that merely resembles it.

Myne holds no copy of your phrase, so it cannot verify one, cancel one, or reissue one, and it cannot tell that someone else has used yours. A recovery performed with a valid phrase and account number is indistinguishable from you doing it, which is what makes the phrase work at all and what makes losing it final. See [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/) and [What Myne doesn't do](/user-guide/settings-and-privacy/what-myne-doesnt-do/).
