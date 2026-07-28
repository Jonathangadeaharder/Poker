ARG PNPM_VERSION=10.12.1

FROM node:22-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# Supabase config is read by src/lib/supabase.ts via import.meta.env, so it must
# be baked into the static bundle at build time (runtime env has no effect on a
# pre-built nginx image). Supply them with --build-arg / compose build.args.
ARG VITE_PUBLIC_SUPABASE_URL=
ARG VITE_PUBLIC_SUPABASE_ANON_KEY=
ENV VITE_PUBLIC_SUPABASE_URL=${VITE_PUBLIC_SUPABASE_URL}
ENV VITE_PUBLIC_SUPABASE_ANON_KEY=${VITE_PUBLIC_SUPABASE_ANON_KEY}
ENV PUBLIC_POSTHOG_HOST=${PUBLIC_POSTHOG_HOST:-https://eu.i.posthog.com}
ENV PUBLIC_POSTHOG_PROJECT_TOKEN=${PUBLIC_POSTHOG_PROJECT_TOKEN:-}
RUN pnpm run build

FROM nginx:alpine AS runner
RUN apk add --no-cache curl
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
