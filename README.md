# Sugam Kashyap — Portfolio

A scroll-driven ascent-themed portfolio built with Next.js 14, TypeScript, and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

Build a production bundle:

```bash
npm run build
```

## Deployment

Pushes to `main` auto-deploy via `.github/workflows/deploy.yml` to https://sugamkashyap05.github.io/portfolio/. The site is statically exported (`output: "export"`) with `basePath: "/portfolio"`, which must match the repository name.
