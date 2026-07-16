# Google Search Console — Osislightkleen

Use this checklist after the site is live at https://osislightkleen.com

## 1. Files already in this project (upload to your live site root)

| File | Purpose |
|------|---------|
| `sitemap.xml` | List of pages for Google to crawl — submit this in Search Console |
| `robots.txt` | Tells Google it may crawl the site and where the sitemap is |

Both must sit at the domain root:

- https://osislightkleen.com/sitemap.xml
- https://osislightkleen.com/robots.txt

## 2. Add the property in Google Search Console

1. Go to https://search.google.com/search-console
2. Click **Add property** → choose **URL prefix**
3. Enter: `https://osislightkleen.com`
4. Verify ownership (pick one):
   - **HTML tag** (easiest): Google gives you a `<meta name="google-site-verification" content="...">` tag — paste it into the `<head>` of `index.html`, then redeploy and click Verify
   - **HTML file**: download the HTML file Google gives you, upload it to the site root, then Verify
   - **DNS**: add a TXT record at your domain registrar (Namecheap, GoDaddy, etc.)

## 3. Submit the sitemap

1. In Search Console → left menu → **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**
4. Wait for status **Success** (can take hours to a few days)

## 4. Request indexing for key pages

In Search Console → **URL Inspection**, paste each URL and click **Request indexing**:

- https://osislightkleen.com/
- https://osislightkleen.com/about.html
- https://osislightkleen.com/services.html
- https://osislightkleen.com/contact.html

## 5. Brand search tip (“Osis light” / Osislightkleen)

Ranking first for your own brand name usually happens once Google knows the site is real. Help it by:

- Keeping the domain and business name consistent: **Osislightkleen**
- Using Google Business Profile (Maps) with the same name, address, and phone
- Linking the website from Instagram, LinkedIn, WhatsApp business, and directories
- Waiting — brand searches often show your site within days/weeks after indexing; competitive keywords take longer

## 6. After verification (optional but recommended)

- Link **Google Analytics** if you use it
- Create a **Google Business Profile** for Lagos / Ikoyi
- Share the live site URL on social so Google sees real traffic and mentions
