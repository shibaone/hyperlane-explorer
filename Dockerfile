# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS builder
WORKDIR /app

# Install git for private dependencies
RUN apk add --no-cache git

# Copy only the files needed for install/build
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install all dependencies (including dev for build)
RUN yarn install --immutable --network-timeout 300000

# Copy source
COPY . .

# Build the Next.js app
ARG NEXT_PUBLIC_VERSION
ARG NEXT_PUBLIC_API_URL
ARG GRAPHQL_API_URL
ARG REGISTRY_AUTH_TOKEN
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV GRAPHQL_API_URL=$GRAPHQL_API_URL
ENV REGISTRY_AUTH_TOKEN=$REGISTRY_AUTH_TOKEN
RUN yarn build

# --- Production image ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tailwind.config.js ./
COPY --from=builder /app/postcss.config.js ./

# Only install production dependencies
RUN yarn install --immutable --network-timeout 300000

EXPOSE 3000
CMD ["yarn", "start"]