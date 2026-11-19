# Cupang Elementary School Website

**Live demo:** [Visit the visitor-only website](https://neon1015.github.io/CUPANG-ELEMENTARY-SCHOOL-/)

The public demo shares information about Cupang Elementary School without requiring visitors to sign in or create an account.

## Visitor pages

- Browse school information, facilities, achievements, and public announcements.
- View the school calendar. The demo has no database, so live event data is not available.
- Find the school's location and public contact details.
- Use the website on desktop and mobile devices.

The demo does not include staff dashboards, account management, private memos, or event approval. It does not collect or store visitor messages; use the school's Facebook page or the contact details on the Contact page.

## Deployment

GitHub Pages hosts the static visitor site. A GitHub Actions workflow builds it from the public HTML, CSS, JavaScript, and images whenever changes are pushed to `main`. GitHub Pages does not run the Node.js server or SQLite database used by the full application.

The Pages build removes login controls and replaces the database-backed contact form with public contact information. No visitor submissions or private account data are part of the demo.

## Privacy and publishing

Only publish information intended for the public. Do not upload `.env` files, database files, passwords, private messages, or student/staff records. Review all photos and school details before publishing.

Created by Gerald C. Esplana
