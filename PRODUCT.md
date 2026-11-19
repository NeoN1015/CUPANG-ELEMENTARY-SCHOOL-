# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: community members and DepEd visitors — residents of Barangay Cupang, alumni, and Schools Division of Muntinlupa officials — learning about the school's history, record and upcoming events.
Secondary: parents/guardians and pupils (view events, contact the school); staff (principal and teachers) who use the private dashboards to post memos and events.

## Product Purpose
The public face of Cupang Elementary School (CESMAIN), a DepEd public elementary school in Barangay Cupang, Muntinlupa City. It shows who the school is, what it has achieved, what is coming up on the school calendar, and how to reach it. Behind it, role-based dashboards let the principal issue memos and approve events and let teachers read memos and propose events.

## Positioning
One of the oldest public schools in Muntinlupa (established 1932 by official record; school research suggests roots as Cupang Barrio School as early as 1905), still serving its barangay. Its calendar and announcements come straight from the principal's office.

## Operating Context
- Public pages: Home, About, Achievements, Contact. Event calendar is read-only for visitors; contact form messages go to the principal's inbox.
- Dashboards: `/principal` (memos, events + approval, accounts, messages) and `/teacher` (memo inbox, events).
- Announcements are made as graphic posters (chalkboard style, SY-labelled), e.g. `pics/announcement1-3.jpg`.

## Capabilities and Constraints
- Stack: static HTML/CSS/JS served by Express (`server.js`), SQLite, FullCalendar 5 from CDN. No build step.
- Roles: principal (email login), teacher (employee ID), student (12-digit LRN), visitor (no login).
- Language: English.

## Brand Commitments
- Official school seal (`pics/ces.png`, `pics/ceslogo.png`): torch, open book, laurel, "1932", "Muntinlupa City". Must be kept.
- School green as the school colour.
- Motto: "Culture of Excellence in Service and Management".
- DepEd core values section: Maka-Diyos, Maka-Tao, Maka-Kalikasan, Maka-Bansa; DepEd Vision and Mission text as published.

## Evidence on Hand
- Facts: established 1932, School ID 136912, address C2JX+5R4, Manuel L. Quezon, Muntinlupa, Metro Manila (site shows postal code "63017", which looks wrong; confirm the real ZIP), Facebook page.
- Photos: `pics/fac1-6.jpg` (facilities), `pics/achievement2.jpg`, `pics/achievements1.jpg`, `pics/news2.jpg`, `pics/announcement1-3.jpg`, `pics/bg1-3.jpg`, `pics/cesbg*.jpg`.
- One real achievement: Keesalyn De Castro, Poster Making, 3rd place (venue/date unknown).
- Placeholders to keep as clearly labelled samples: organization names/heads, extra achievements, news items beyond National Women's Month, "Achievements: NUMBERS" stat. Do not present any of these as real.
- No enrolment figures, rankings or testimonials exist; do not invent them.

## Product Principles
1. The school's own record first: real dates, real names, real posters over generic stock.
2. Visitors read; staff act. Public pages never expose staff controls.
3. Sample content is always visibly marked as sample until replaced.
4. Works on a phone on a mobile data connection.

## Accessibility & Inclusion
WCAG 2.1 AA contrast and keyboard access; readable for older community members (generous text size).
