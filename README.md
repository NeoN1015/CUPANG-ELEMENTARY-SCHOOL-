# Cupang Elementary School Website

## Visitor-only live demo proposal

This project can be published as a public, read-only website for visitors to learn about Cupang Elementary School. The demo would focus on public information and would not require visitors to sign in or create an account.

### Proposed visitor experience

- Browse school information, facilities, achievements, and public announcements.
- View public event information when it is provided as static website content.
- Find the school's location and public contact details.
- Use the website on desktop and mobile devices.

### Not included in this demo

- Principal, teacher, or student logins and dashboards.
- Account management, event approval, and private staff memos.
- A database or storage of visitor-submitted information.
- A working contact form unless a separate form service is configured.

## Hosting approach

GitHub Pages can host a static website at no cost. It serves HTML, CSS, JavaScript, and image files, but it does not run the Node.js server or SQLite database used by the full application.

The current project includes server-backed features. Before publishing a visitor-only version on GitHub Pages, those features should be removed or replaced with static public content. API-dependent event and contact features will not work on GitHub Pages without a separate backend or an external form service.

Once the site is prepared as a static version:

1. Push the public website files to this GitHub repository.
2. In the repository settings, open **Pages**.
3. Choose the deployment branch and folder containing the static site files.
4. Open the published Pages URL and test the visitor experience.

## Privacy and publishing

Only publish information intended for the public. Do not upload `.env` files, database files, passwords, private messages, or student/staff records. Review all photos and school details before publishing.

## Current status

This README describes the visitor-only live-demo proposal. The repository needs a static-ready version of the website before it can be published as a working GitHub Pages demo.
