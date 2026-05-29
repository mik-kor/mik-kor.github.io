# Personal Academic Website

Built with [Jekyll](https://jekyllrb.com/) and hosted via [GitHub Pages](https://pages.github.com/).

---

## 🚀 Hosting on GitHub Pages — Step-by-Step

### 1. Create your GitHub repository

1. Go to [github.com](https://github.com) and sign in (or create a free account).
2. Click **New repository**.
3. Name it exactly: `yourusername.github.io`  
   *(replace `yourusername` with your actual GitHub username)*
4. Set it to **Public**.
5. Click **Create repository** — do NOT initialise with a README.

---

### 2. Customise the site content

Before pushing, open `_config.yml` and update:

```yaml
title: "Your Real Name"
url: "https://yourusername.github.io"

author:
  name: "Your Real Name"
  department: "Department of Politics and International Relations"
  college: "Your College Name"
  email: "yourname@politics.ox.ac.uk"
  twitter: "yourhandle"        # or remove this line
  bluesky: "you.bsky.social"  # or remove this line
  github: "yourusername"
  google_scholar: "XXXXXXX"   # from your Scholar URL
  cv_url: "/assets/cv.pdf"    # upload your CV as assets/cv.pdf
```

Then edit `index.html` to fill in your real bio, research description, news, and teaching.

---

### 3. Add your photo

Place a square photo at `assets/images/photo.jpg`.

Then in `index.html`, comment out the placeholder div and uncomment the `<img>` tag:

```html
<!-- Remove this: -->
<div class="hero-photo-placeholder">...</div>

<!-- Uncomment this: -->
<img src="{{ '/assets/images/photo.jpg' | relative_url }}" ... />
```

---

### 4. Add your CV

Place your CV PDF at `assets/cv.pdf`. It will be linked automatically via the CV button.

---

### 5. Push to GitHub

```bash
# In this folder:
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

---

### 6. Enable GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose branch: `main`, folder: `/ (root)`
4. Click **Save**

Your site will be live at `https://yourusername.github.io` within 1–2 minutes. 🎉

---

### 7. (Optional) Custom domain

To use `yourname.com` instead of the GitHub URL:

1. Buy a domain from Namecheap, Google Domains, etc.
2. In your repo, create a file called `CNAME` containing just your domain:
   ```
   yourname.com
   ```
3. In your domain registrar's DNS settings, add:
   - `A` records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Or a `CNAME` record: `www` → `yourusername.github.io`

---

## 🛠 Local Development (optional)

To preview the site locally before pushing:

```bash
# Install Ruby + Bundler if needed
gem install bundler

# Install dependencies
bundle install

# Start local server
bundle exec jekyll serve

# Visit http://localhost:4000
```

---

## 📁 File Structure

```
.
├── _config.yml          ← Site settings & author info (edit this first)
├── _layouts/
│   └── default.html     ← Page template (nav, footer)
├── assets/
│   ├── css/main.css     ← All styles
│   ├── js/main.js       ← Navigation JS
│   ├── images/
│   │   └── photo.jpg    ← Your profile photo (add this)
│   └── cv.pdf           ← Your CV (add this)
├── index.html           ← All page content (edit this)
└── Gemfile              ← Ruby dependencies
```

---

## ✏️ Updating Content

All content lives in two files:

- **`_config.yml`** — name, email, social links
- **`index.html`** — bio, news, research, teaching, contact

To add a news item, copy an existing `<li class="news-item">` block and edit the date and text.

To add a research project, copy an existing `<div class="project-card">` and edit the title, description, and tags.
