import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "site");
const pages = ["home.html", "about.html", "achievements.html", "facilities.html", "contact.html"];
const version = process.env.GITHUB_SHA || "local";

function replaceOnce(content, pattern, replacement, description) {
  const matches = content.match(pattern);
  if (!matches || matches.length !== 1) {
    throw new Error(`Expected exactly one ${description}.`);
  }
  return content.replace(pattern, replacement);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const page of pages) {
  let html = await readFile(path.join(root, page), "utf8");
  html = replaceOnce(html, /^[ \t]*<button class="login-btn".*?<\/button>[ \t]*\r?\n/m, "", `login button in ${page}`);
  html = replaceOnce(html, /^[ \t]*<div class="account-form"[^>]*><\/div>[ \t]*\r?\n/m, "", `login drawer in ${page}`);
  html = replaceOnce(html, /^[ \t]*<script src="login\.js"><\/script>[ \t]*\r?\n/m, "", `login script in ${page}`);
  html = html.replaceAll("Write to the principal", "Contact the school");

  if (page === "home.html") {
    html = html.replace(
      "Questions for the school? Your message goes straight to the principal's office.",
      "Questions for the school? Find public contact options on our Contact page."
    );
  }

  if (page === "contact.html") {
    html = html.replace("<h2>Write to the principal</h2>", "<h2>Contact the school</h2>");
    html = html.replace(
      '<p style="margin-bottom:20px">Your message goes straight to the principal\'s inbox. Please include an email address we can reply to.</p>',
      ""
    );
    html = replaceOnce(
      html,
      /<form class="contact-form" id="contactForm" novalidate>[\s\S]*?<\/form>/,
      '<p class="visitor-contact">This demo does not collect messages. <a class="wall-link" href="https://web.facebook.com/profile.php?id=100057127043044" rel="noopener">Contact the school on Facebook</a> or visit the address listed below.</p>',
      "contact form"
    );
    html = replaceOnce(
      html,
      /[ \t]*<script>\s*document\.getElementById\("contactForm"\)[\s\S]*?<\/script>/,
      "",
      "contact form script"
    );
  }

  html = html.replaceAll('src="js/site.js"', `src="js/site.js?v=${version}"`);
  html = html.replaceAll('src="js/calendar.js" defer', `src="js/calendar.js?v=${version}" defer`);
  await writeFile(path.join(output, page), html);
}

await writeFile(path.join(output, "index.html"), await readFile(path.join(output, "home.html")));
await cp(path.join(root, "css", "site.css"), path.join(output, "css", "site.css"), { recursive: true });
await mkdir(path.join(output, "js"), { recursive: true });
const siteJs = replaceOnce(
  await readFile(path.join(root, "js", "site.js"), "utf8"),
  /    fetch\("api\/events"\)[\s\S]*?(?=\r?\n  }\r?\n\}\)\(\);)/,
  '    const li = document.createElement("li");\n    li.className = "next-empty";\n    li.textContent = "No upcoming events posted yet. Check back soon.";\n    list.replaceChildren(li);',
  "home event API request"
);
await writeFile(path.join(output, "js", "site.js"), siteJs);

const calendarJs = replaceOnce(
  await readFile(path.join(root, "js", "calendar.js"), "utf8"),
  /    fetch\("api\/events"\)[\s\S]*?(?=\r?\n\}\);\s*$)/,
  '    if (eventTable) eventTable.innerHTML = \'<tr><td colspan="4" class="muted">No events posted yet.</td></tr>\';',
  "calendar event API request"
);
await writeFile(path.join(output, "js", "calendar.js"), calendarJs);
await cp(path.join(root, "pics", "web"), path.join(output, "pics", "web"), { recursive: true });

console.log(`Built visitor-only Pages site in ${output}`);
