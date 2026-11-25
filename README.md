# The Pump Room (`pumproom.democrat`)

A fast, zero-build dark-mode studio showcase site deployed privately via **GitHub + Cloudflare Pages**.

## Privacy & Security Model
- **Zero origin server exposure:** Served statically from Cloudflare's edge network; your server IP is never in DNS and no inbound ports are needed.
- **Zero Cloudflare tokens on this machine:** Cloudflare pulls directly from a private GitHub repository.
- **Scoped Git access:** Uses a repo-only SSH Deploy Key (`id_ed25519_pumproom`) that can access only this repository.

## Updating the Site (Auto-Deploy)

1. Edit `content.js` (or any file in this folder).
2. Commit and push:
   ```bash
   cd /root/pumproom-democrat
   git add -A
   git commit -m "Update showcase"
   git push
   ```
Cloudflare Pages automatically detects the push and publishes the updated site within seconds.

## Cloudflare Pages Setup Settings
- **Repository:** Your private GitHub repo
- **Production branch:** `main`
- **Framework preset:** `None`
- **Build command:** *(leave blank)*
- **Build output directory:** `/`
- **Custom domains:** `pumproom.democrat` (and optionally `www.pumproom.democrat`)
