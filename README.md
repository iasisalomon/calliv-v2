# Calliv v2

## Build Setup

Requires Node 26 LTS (see `.nvmrc`) and pnpm (version pinned in `package.json` → `packageManager`).

```bash
# install dependencies
$ pnpm install

# serve with hot reload at localhost:3000
$ pnpm dev

# build for production and launch server
$ pnpm build
$ pnpm start

# generate static project
$ pnpm generate
```

Nuxt 2 uses webpack 4, which fails on Node 17+ without the legacy OpenSSL provider.
`pnpm-workspace.yaml` sets `nodeOptions: --openssl-legacy-provider`, so pnpm scripts handle it
automatically. Running `nuxt` directly (outside pnpm) needs `NODE_OPTIONS=--openssl-legacy-provider`.

## Deploy to Cloudflare

The app is fully client-side, so it is deployed as static files (`nuxt generate` → `dist/`)
served by Cloudflare Workers static assets (config in `wrangler.jsonc`).

### From your machine

```bash
$ pnpm dlx wrangler login
$ pnpm run deploy
```

(`pnpm run deploy`, not `pnpm deploy`: the latter is a built-in pnpm command.)

### From Git (Cloudflare dashboard → Workers & Pages → Create → Import a repository)

- Build command: `pnpm generate`
- Deploy command: `pnpm dlx wrangler deploy`
- Environment variable (if the build image ignores `.nvmrc`): `NODE_VERSION=26`

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
