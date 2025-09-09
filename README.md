Here’s a drop-in guide you can add to your repo as `README_DESIGNER.md`.

---

# Designer Setup Guide (WordPress + React/Tailwind)

This repo tracks **only `wp-content/`** (theme, plugins, uploads). You’ll run a local WordPress, then point it at this `wp-content` so you can see your CSS/JS and PHP template changes live.

## 1) Install the basics

* **Git**
* **Node.js** (LTS) + **npm**
* A code editor (VS Code)
* A local WordPress app:

  * **Local by Flywheel** (easiest), or MAMP/XAMPP if you prefer

## 2) Clone the repo

```bash
git clone <REPO_URL> tsb-wpcontent
cd tsb-wpcontent
```

You should see `wp-content/themes/...`, `wp-content/plugins/...`, etc.

## 3) Create a local WordPress site

Using **Local by Flywheel**:

1. Create a new site (PHP 8+, MySQL 8+, Nginx or Apache).
2. Open the site’s **app folder** (Local → right-click site → “Show in Finder/Explorer”) and find:

   ```
   <LocalSite>/app/public/wp-content
   ```

### Point the site at this repo’s `wp-content`

#### macOS / Linux

```bash
rm -rf "<LocalSite>/app/public/wp-content"
ln -s "$(pwd)/wp-content" "<LocalSite>/app/public/wp-content"
```

#### Windows (PowerShell as Administrator)

```powershell
rmdir "<LocalSite>\app\public\wp-content" -Recurse -Force
cmd /c mklink /D "<LocalSite>\app\public\wp-content" "<FULL\PATH\TO>\tsb-wpcontent\wp-content"
```

Now when you load the local site in a browser, it uses the repo’s theme/plugins.

> If you’re using MAMP/XAMPP, do the same: delete the `wp-content` in your local WP root and create a **directory symlink** to this repo’s `wp-content`.

## 4) Install and run the front-end

From the theme folder (adjust if your theme name differs):

```bash
cd wp-content/themes/brads-boilerplate-theme-tailwind
npm install
npm run dev   # starts the dev build/watch (Vite/webpack)
```

Common scripts:

* `npm run dev` – watch + HMR during development
* `npm run build` – production build (minified)

> Styling must use our tokens only (no ad-hoc colors):
>
> * `/wp-content/themes/.../index.css`
> * `/wp-content/themes/.../colour-classes.css`
> * `/wp-content/themes/.../font-classes.css`

## 5) Workflow

1. **Create a branch**

   ```bash
   git checkout -b feat/header-tweaks
   ```
2. Make changes (CSS, JSX, PHP templates).
3. **Preview** in your Local site (refresh the browser).
4. **Commit & push**

   ```bash
   git add .
   git commit -m "Header spacing: match design; fix focus ring"
   git push origin feat/header-tweaks
   ```
5. Open a **Pull Request** on GitHub for review.

## 6) What you can safely edit

* **Theme**: `/wp-content/themes/brads-boilerplate-theme-tailwind`

  * React components in `/scripts`
  * PHP templates in the theme
  * CSS tokens and utilities (`index.css`, `colour-classes.css`, `font-classes.css`)
* **Do not** edit WordPress core or server config.
* **Do not** commit large binaries (videos/PSDs). Ask before adding big assets.

## 7) Troubleshooting

**I don’t see my changes**

* Make sure `npm run dev` is running in the theme folder.
* Clear Local’s page cache if using Nginx/Redis (Site → Tools).
* Confirm the symlink points to the correct `wp-content` (not a copy).

**Styles look wrong / tokens not applied**

* Use only the provided token classes and variables.
* Avoid inline styles or random hex values unless asked.

**React mount not rendering**

* The PHP template must output the mount container with `data-props` JSON (double quotes) and the correct `id`.
* If you see “Uncaught (in promise) …”, check your browser console Network tab for missing chunks (404); then re-run `npm run dev` or `npm run build`.

**Yoast / SEO / head tags missing**

* The theme’s `header.php` must include `<?php wp_head(); ?>` and `footer.php` must include `<?php wp_footer(); ?>`.

**Permissions / symlink failure on Windows**

* Run your terminal as **Administrator**.
* Use `mklink /D` exactly as shown above.

## 8) Commit rules (lightweight)

* Small, focused commits.
* Branch names: `feat/*`, `fix/*`, `chore/*`.
* PR titles should describe the visible change (e.g., “Calendar tooltip styling + spacing match Figma”).

---

That’s it. If anything here doesn’t work on your machine, ping in the PR or Slack and we’ll tweak the setup.
