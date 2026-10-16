---
title: "When a page asks for your recovery phrase"
category: "safety-and-recovery"
updated: 2026-08-24
summary: "Myne's browser client asks for your 24 words in exactly one situation: a recovery you started yourself after forgetting your password. It never asks for them to sign you in and never to add a device. How to apply that rule, and what Myne cannot check for you."
tags: ["recovery", "security", "privacy"]
---

A page asking for your 24 recovery words is either a recovery you started yourself, or it is not Myne. That is the whole rule. This article covers where the rule applies, what someone gains if they get the words out of you, what to check before you type them, and the one thing on that page Myne cannot protect you from.

## The rule

In a browser, Myne asks for your recovery phrase in exactly one situation: an **unlock with recovery phrase** that you started yourself, after forgetting your master password. Two things follow from that, and they are the half you can act on:

- **Myne never asks for your phrase to sign you in.** Signing in to a browser takes your account number and your master password.
- **Myne never asks for your phrase to add a device.** Adding a device in a browser takes your account number and your master password, and nothing else.

The browser does show you the phrase once, when you create a vault there. That is the same rule seen from the other side: Myne shows the words in a creation you started, and asks for them in a recovery you started. There is no third occasion.

That rule is worth trusting because it is a property of the code rather than a promise about intent. The phrase-as-a-credential path for joining a device is left out of the browser build entirely rather than switched off, so the 24-cell grid the desktop app uses for that is not in what your browser downloads. Outside a recovery you began, an honest Myne page has neither a reason nor a means to ask.

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
- **The apps ask for the phrase in places the browser does not**, and that is expected rather than suspicious: adding a device from a device that already holds the vault, and the one-time [vault format upgrade](/user-guide/safety-and-recovery/upgrade-your-vault-format/). Both happen inside an app you installed and opened yourself.
- **Nothing about how your notes are encrypted is affected.** This page is about a credential being talked out of you, not about the vault's protection failing.

## Limits

**Myne cannot tell you that a page is fake.** There is no check in the app, no warning, and no list of bad addresses. The rule at the top of this page is one you apply; it is not one the software applies for you. What Myne can do is keep the rule true and narrow, by asking for the phrase in exactly one place and keeping the device-joining phrase grid out of the browser build rather than merely hidden inside it. That is containment, not prevention, and the difference is worth being clear about: it makes the rule learnable, and it stops nobody who types 24 words into a lookalike address.

The protections that make the real client trustworthy do not touch this. Reproducible builds, the bundle-hash record, the strict content policy, and the certificate check against public authorities all address a Myne bundle or a Myne connection being tampered with. A phishing page is neither: it is an ordinary web page at an address that is not Myne's, and it can be served over a perfectly valid, perfectly secure connection. Likewise, the measures that bind the honest address to an encrypted connection say nothing at all about a different address that merely resembles it.

Myne holds no copy of your phrase, so it cannot verify one, cancel one, or reissue one, and it cannot tell that someone else has used yours. A recovery performed with a valid phrase and account number is indistinguishable from you doing it, which is what makes the phrase work at all and what makes losing it final. See [How Myne protects your notes](/user-guide/settings-and-privacy/privacy-model/) and [What Myne doesn't do](/user-guide/settings-and-privacy/what-myne-doesnt-do/).
