# Project review — 18 September 2026

## Implemented

- Restricted account listing to administrators and rejected study sessions using
  another account's category. Missing and foreign categories both return 404.
- Enabled session-bound CSRF protection for writes, including login/registration,
  and restricted credentialed CORS to configured exact origins. Login rotates the
  session ID and invalidates the old CSRF token.
- Made registration transactional and insert-only to prevent duplicate-username
  races from merging credentials into an existing account. Added UTF-8 password
  length validation matching bcrypt's byte limit.
- Validated category names, required session fields, and start/end ordering.
  Session timestamps now preserve UTC instants across the API.
- Removed cascading parent deletion from category/session relationships.
- Updated Spring Boot from 4.0.5 to 4.0.8 and applied compatible npm security
  updates. The npm audit reports zero known vulnerabilities after these updates.
- Removed the backend `.env` from Git tracking while retaining its local copy;
  excluded secrets from Git/build contexts and removed hardcoded Compose passwords.
  Database/backend host ports now bind to loopback and the backend image runs as
  an unprivileged user.
- Scoped study data and the timer to the authenticated account. Anonymous pages
  no longer fetch private study data, and expired sessions return to login.
- Fixed automatic timer saving, empty default category selection, duplicate-click
  saves, retrying failed saves, and changing categories mid-session. The active
  timer survives navigation between app pages. Work duration controls now work;
  removed the nonfunctional break controls.
- Displayed authentication/data-loading errors and added retry controls. Fixed
  Statistics navigation, missing-route feedback and narrow-screen overflow.
- Corrected activity totals across midnight, empty history and daylight-saving
  boundaries. Added regression tests for these calculations.
- Replaced the basic container web server with nginx SPA fallback and API proxy,
  preserving direct route reloads and the 10 MB upload limit. Production builds
  use same-origin API requests; the API address and CORS origins are configurable.

## Verification

- Backend integration/unit suite and executable JAR build.
- Frontend lint, production build, Node regression tests and npm audit.
- Browser checks for login errors, CSRF headers, timer completion and retries,
  account switching, Statistics navigation and responsive layout.
- Isolated PostgreSQL + backend + nginx browser test: registration, login, session
  saving, crop/upload persistence, restoring the default and direct page reloads.
- nginx configuration validation and container build.
- Real proxy upload boundary: exactly 10 MiB accepted; 10 MiB + 1 byte rejected
  with HTTP 413 and a readable error. Timer continuation across routes verified.

## Operational follow-up and limits

- Rotate any real secrets previously committed in `.env`. Removing tracking does
  not erase Git history or revoke credentials. History rewriting was not performed.
- Configure TLS, `SESSION_COOKIE_SECURE=true`, production CORS origins and
  login/registration rate limits at the public ingress. The app does not currently
  implement brute-force throttling, account recovery or multifactor authentication.
- Existing timestamps without offsets are interpreted as UTC, consistent with the
  original frontend's ISO uploads. Data written by other clients with local-time
  assumptions needs a separate migration decision.
- The timer survives in-app navigation, but a browser reload still clears an
  unsaved timer. Server acknowledgments lost in transit can make an explicit retry
  duplicate a write; persistent idempotency keys remain a follow-up.
- A privacy policy is still missing; no legal text was invented for the empty link.
- This review and dependency updates do not constitute a penetration test or a
  complete vulnerability scan of all Maven dependencies or the production host.

Security behavior follows the official Spring documentation:
[CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
and [session management](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html).
