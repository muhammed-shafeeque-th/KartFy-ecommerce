ARG NODE_VERSION=22-alpine

# ---- 1. all dependencies (cached until package files change) -----------------
FROM node:${NODE_VERSION} AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ---- 2. compile TypeScript ---------------------------------------------------
FROM deps AS build

COPY src ./src
COPY public ./public

# ---- 3. production-only dependencies ------------------------------------------
FROM node:${NODE_VERSION} AS prod-deps

WORKDIR /app
COPY package.json package-lock.json ./
# RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
RUN  npm ci --omit=dev

 # ---- 4. minimal runtime image ------------------------------------------------
FROM node:${NODE_VERSION} AS runner

ARG GIT_SHA=unknown
ENV NODE_ENV=production \
   PORT=4000 \
   APP_VERSION=${GIT_SHA} \
   NODE_EXTRA_CA_CERTS=/etc/ssl/rds-global-bundle.pem
LABEL org.opencontainers.image.revision=${GIT_SHA}

# tini = proper PID 1 (forwards SIGTERM, reaps zombies)
RUN apk add --no-cache tini

# RDS CA bundle so TLS to PostgreSQL is verified
ADD --chmod=644 https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
 /etc/ssl/rds-global-bundle.pem

WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/src ./src
COPY --from=build --chown=node:node /app/public ./public
COPY --chown=node:node package.json ./

USER node
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
 CMD wget -qO- http://127.0.0.1:4000/health >/dev/null || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "./src/bin/www"]
