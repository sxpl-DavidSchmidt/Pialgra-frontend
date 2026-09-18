# Run Pialgra on your Linux server

The production stack runs the HTTPS proxy, frontend, backend and PostgreSQL on
one Docker host. Only the proxy publishes ports to the host.

`compose.production.yaml` combines both repositories using Compose `extends`:
it imports `backend` and `postgres` from the backend's existing `compose.yaml`,
then adds `frontend` and `edge`. The backend Compose file stays the source of truth
for database settings, dependencies and the backend build. Production overrides
the password, HTTPS settings and networking, removing the inherited host ports
with `!reset []`. Use Docker Compose 2.24.4 or newer.

```text
Internet → pialgra.app → router TCP 80/443 → Linux server
                                            Caddy (HTTPS)
                                              ↓
                                         frontend:8081
                                          /api/ ↓
                                          backend:8080
                                              ↓
                                          postgres:5432
```

The browser calls `https://pialgra.app/api/...`. It never connects to `localhost:8080`
or a private Docker hostname. The backend needs no separate public domain.

## 1. Prepare the server and network

Install Docker Engine and the Docker Compose plugin on the Linux server. Keep
the two repositories next to each other, including these new deployment files:

```text
/opt/pialgra/Pialgra-frontend/
/opt/pialgra/Pialgra-backend/
```

Give the Linux server a stable LAN address, preferably through a DHCP reservation.
Create these router forwards to that address:

| Public port | Protocol | Linux server port |
| --- | --- | --- |
| 80 | TCP | 80 |
| 443 | TCP | 443 |
| 443 | UDP, optional HTTP/3 | 443 |

Allow TCP 80/443 through the server firewall as well. Keep SSH access available
when changing firewall rules. Do not forward 5432, 8080 or 8081. Another web server
already using ports 80/443 must be moved or integrated before starting this stack.

At the domain's DNS provider, create an **A record** for `pialgra.app` (`@` in many
DNS interfaces) pointing to your router's **public IPv4 address**, not the server's
LAN address. If the public address changes, configure dynamic DNS updates.
Only add an AAAA record when the server has working public IPv6 and its firewall
allows these ports; a stale AAAA record can break access and certificate issuance.
For initial setup, use direct/DNS-only records if your provider offers an HTTP proxy.

This file configures exactly one hostname. `www.pialgra.app` is not automatically
added; use `SERVICE_DOMAIN=www.pialgra.app` if that is the hostname you want instead.

## 2. Set the environment

From the frontend repository on the Linux server:

```sh
cd /opt/pialgra/Pialgra-frontend
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production
```

Set:

```dotenv
SERVICE_DOMAIN=pialgra.app
ACME_EMAIL=your-real-email@example.com
DB_PASSWORD=your-long-random-password
BACKEND_PATH=../Pialgra-backend
POSTGRES_VOLUME=pialgra-production-postgres
```

- `SERVICE_DOMAIN`: a bare hostname, without a scheme, path, port or trailing slash.
  Change this value to host the same image at another domain; no rebuild is needed.
- `ACME_EMAIL`: your certificate contact email.
- `DB_PASSWORD`: the database password. For a new database, `openssl rand -hex 32`
  generates a suitable value. Keep the `.env.production` file private and untracked.
- `BACKEND_PATH`: path to the backend checkout, relative to this Compose file.
- `POSTGRES_VOLUME`: a durable Docker volume. The default creates a new database.

The production stack automatically sets `CORS_ALLOWED_ORIGINS=https://<domain>`
and `SESSION_COOKIE_SECURE=true`. It uses same-origin API requests, so do not set
`VITE_API_BASE_URL` to the server's IP address or a Docker service name.

### Reusing existing data

If this server already runs the backend development Compose stack, back up the
database first. Find its existing volume with:

```sh
cd /opt/pialgra/Pialgra-backend
docker inspect "$(docker compose ps -q postgres)" --format '{{range .Mounts}}{{println .Name .Destination}}{{end}}'
```

Set `POSTGRES_VOLUME` to that volume's exact name and `DB_PASSWORD` to the existing
database password. The stack expects database/user `pialgra` and PostgreSQL 17,
matching the backend's development Compose setup. Stop the old stack with
`docker compose down` before starting production. **Do not use `down -v`**, and
never mount the same database volume in two running PostgreSQL containers.
Changing a password variable does not change the password inside an existing database.

For data on another machine, use a PostgreSQL dump/restore rather than assuming
the volume is shared between hosts.

## 3. Start the stack

```sh
cd /opt/pialgra/Pialgra-frontend
docker compose --env-file .env.production -f compose.production.yaml config --quiet
docker compose --env-file .env.production -f compose.production.yaml up -d --build
docker compose --env-file .env.production -f compose.production.yaml ps
docker compose --env-file .env.production -f compose.production.yaml logs --tail=100 edge
```

Caddy obtains and renews HTTPS certificates once public DNS and port forwarding
are working. HTTP requests redirect to HTTPS. Certificate state persists in the
`caddy-data` volume, so retain that volume across updates.

Open **https://pialgra.app** using a phone with Wi-Fi disabled to test access from
outside your LAN. Check signup/login, a direct reload of `/profile`, and an image
upload. If external access works but LAN access does not, enable NAT loopback on
the router or configure local DNS to resolve the same domain to the server's LAN IP.

## 4. Update or change the domain

For application updates, update both checkouts and run the same `up -d --build`
command. Back up PostgreSQL before backend updates that change database structure.

To change only the domain, point the new DNS record at your public IP, edit
`SERVICE_DOMAIN`, then run:

```sh
docker compose --env-file .env.production -f compose.production.yaml up -d
```

Compose recreates the services whose environment changed. Caddy obtains a
certificate for the new hostname. The old hostname is no longer configured;
existing browser cookies are domain-specific, so users log in again.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No connection from mobile data | DNS public IP, router forwards, server firewall, and whether the host is awake |
| Certificate fails | `edge` logs, public DNS propagation, stale AAAA records, ports 80/443, and ISP filtering |
| 502 from the site | `docker compose ... ps` and `logs backend frontend`; check the backend build path and DB password |
| Login/upload returns 403 | Access the configured HTTPS hostname; verify `SERVICE_DOMAIN` and recreate services after changes |
| Works outside, fails inside LAN | Router NAT loopback or split/local DNS |
| Database appears empty | `POSTGRES_VOLUME` points to a new volume instead of the existing one |

The environment variables configure the containers; they cannot create DNS
records, configure the router, or bypass an ISP's CGNAT. Your stated port-forwarding
setup supports this approach, provided the router has a reachable public address.

Reference: [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https)
and [Caddy environment variables](https://caddyserver.com/docs/caddyfile/concepts#environment-variables).

## Configuration checks performed

The Compose and Caddy configurations were validated for `pialgra.app`. An isolated
copy of the full stack was tested using local HTTPS: registration, login, same-origin
API calls, secure/HttpOnly cookies, a direct `/profile` reload, and HTTP-to-HTTPS
redirects passed. No backend or database host ports were published. Public DNS,
router forwarding and public certificate issuance must still be verified on your server.
The combined configuration was also checked after switching to `extends`: the
backend build still resolves to the backend repository, the database volume and
healthcheck are inherited, and backend/database host ports remain unpublished.
