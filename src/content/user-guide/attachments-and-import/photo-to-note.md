---
title: "Photo to note"
category: "attachments-and-import"
updated: 2026-10-25
summary: "How to photograph a page, whiteboard or slide on your phone and turn the text it contains into a note, why the text always arrives as an editable draft, and what the reading cannot do."
tags: ["attachments", "notes"]
---

Photo to note turns a photograph of a page into text in a note. You take the picture with your phone's own camera app or pick one you already have, Myne reads the text on the device, and the reading opens in a sheet you can correct before anything is saved. The photograph is kept in the note, with the text directly under it.

This flow is on the phone client. The desktop app adds images through the normal attach path, and has no capture entry of its own.

## Photographing a page

1. Open a note in the editor on your phone.
2. Tap the camera icon in the formatting bar above the keyboard, labelled **Photo to note**.
3. Choose **Take Photo** or **Photo Library** in the sheet your phone shows. The camera is your phone's own camera app, so the first photo may ask for camera permission and no camera preview ever opens inside Myne.
4. Wait for the reading. The sheet opens immediately with your photograph while the picture is being saved, and the text appears in the field when the on-device reader finishes, which takes a few seconds on a full page.
5. Correct anything the reader got wrong. The text is an editable field, and what you leave in it is what gets saved. If you start typing before the reading arrives, your text stays and the reading waits underneath it, one tap away.
6. Choose where it goes: **This note** adds the photograph and its text to the note you have open; **New note** creates a note titled from the first line of the text.
7. Confirm. The photograph is inserted first and the text sits immediately below it, as one block you can undo in a single step.

Cancelling writes nothing to any note, and removes the photograph that this flow had just imported, so an abandoned draft leaves nothing behind in your attachments. Two honest exceptions: if you picked a picture your vault already held, cancelling leaves it alone because it was not this flow's to remove; and if the vault locks before you choose, the photograph stays in your attachments rather than being deleted behind a locked vault.

## What the reading is worth

The text is a machine reading, and the sheet says so. Printed pages, slides and clean whiteboards read well. Handwriting is the weak case: the reader often gets most words and misreads some, which is why the sheet exists rather than inserting the text for you. Treat the field as a draft you are finishing, not as a verification step.

The reading happens on your device. The reader runs inside Myne, using a model that ships with the app, so no OCR service is contacted and no account is involved. What you keep does travel the way the rest of your vault travels: the photograph becomes an ordinary encrypted attachment and the corrected text becomes part of the note, and both sync as ciphertext exactly like anything else you add. The server stores them and cannot read them.

The photograph is deliberately kept. The reading is tied to the version of the reader that produced it, so a better reader later can only re-read a page whose picture is still in the vault. Deleting the image after copying its text throws that away.

If the reader finds nothing, the sheet says so and still offers the photograph alone, which is the right answer for a blank board, a diagram or a page you wanted for its shape rather than its words.

## Turning the reader off

Reading images happens in the app on your phone, so it costs battery and processor time on the device that imports the picture, and the switch is per device. Turn it off in **Settings → Data → Search inside images and scanned documents**. With it off, a photograph imported through this flow still opens the sheet, which explains that reading is off instead of pretending the page had no text, and you can still add the image. Turning it back on applies to the next photograph you take.

## Limits

- **Handwriting is unreliable.** The reader is tuned for printed text. Expect to correct words in a page of handwriting, and do not rely on the reading as a record of what someone wrote.
- **One photograph per capture.** The flow is a single picture: open, capture, review, done. A multi-page document is several captures, or an import from the attachments library.
- **The text is not verified against the image.** Myne does not know what the page really said; it shows you what it read. Correcting is your step, not a background check.
- **Large photographs are compressed on import**, as every image attachment is, so the stored picture may be smaller than the one your camera took. The reading is taken from the stored picture.
- **PDFs are not read this way on the phone.** Text extraction for PDF and word-processing documents is not available in the phone client at all, so a scanned PDF imported there stays a file with no reading, and the flow is for photographs.
- **The photographs are ordinary attachments.** They are encrypted in your vault, they sync, and they appear in the attachments library on every client. A photo of a page is exactly as sensitive as the page.
