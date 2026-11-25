# syntax=docker/dockerfile:1.7
# Build the static Astro site, then serve it with nginx.
#
# SITE is a build arg, set by .github/workflows/ci.yml:
#   release  → SITE=https://myne.md
# It feeds astro.config.mjs `site:` so canonical URLs, the sitemap and RSS are
# absolute and correct.

FROM node:22-alpine AS builder
WORKDIR /app
ARG SITE=https://myne.md
ENV SITE=$SITE
# pnpm comes from `package.json`'s `packageManager` field, which is the ONE
# place the version is written (myne-md/myne#584). This line said `pnpm@9` while
# `.woodpecker.yml` said `pnpm@10`, against the same `lockfileVersion: 9.0`, so
# the tests ran on a different package manager than the build and nothing tied
# the two together. Corepack is still not used: node:22-alpine does not ship it.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g "pnpm@$(node -p "require('./package.json').packageManager.split('@')[1]")"
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
# nginx:alpine's default entrypoint runs `nginx -g 'daemon off;'`.
