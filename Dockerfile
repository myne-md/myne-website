# syntax=docker/dockerfile:1.7
# Build the static Astro site, then serve it with nginx.
#
# Build target is selected with --build-arg SITE (set by .woodpecker.yml):
#   release  → SITE=https://myne.md          (prod,    myne.md)
#   preview  → SITE=https://preview.example.com  (staging, preview.example.com)
# SITE feeds astro.config.mjs `site:` so canonical URLs + sitemap + RSS are
# absolute and correct per environment.

FROM node:22-alpine AS builder
WORKDIR /app
ARG SITE=https://myne.md
ENV SITE=$SITE
# pnpm-lock.yaml is lockfileVersion 9.0 → pnpm 9. No `packageManager` field,
# so install pnpm explicitly rather than relying on corepack.
RUN npm install -g pnpm@9
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
# nginx:alpine's default entrypoint runs `nginx -g 'daemon off;'`.
