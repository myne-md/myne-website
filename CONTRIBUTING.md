# Contributing to the Myne website

Thanks for helping. Open an issue first so the change has a tracked reason. Work
on `develop`; `release` is the image-publishing branch and is updated from
`develop` when the site should go live.

Every commit needs a DCO sign-off:

```bash
git commit -s -m "docs: explain the change"
```

Build and test:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

The site is source-only: do not add installer downloads or claims that installers
exist. Marketing and user-guide copy must not exceed the guarantees in
`myne-md/myne`'s `docs/threat-model.md`. Never commit credentials, tokens or
private repository references.
