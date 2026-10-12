# BuildPilot AI Pro — Production Deployment Guide

**Organization:** Orbytes Global Solutions  
**Owner:** Kirthik  
**Date:** 2026-10-12  

---

## 1. Production Artifacts Generated & Ready
Both full-stack tiers are built into standalone production artifacts:

- **Frontend Production Bundle:** `frontend/dist/` (Nginx/Vercel/S3 ready static assets)
  - `dist/index.html`
  - `dist/assets/index-iJVSv093.css`
  - `dist/assets/index-C-NTehaP.js`
- **Backend Production Executable:** `backend/target/buildpilot-api-1.0.0.jar` (Self-contained Spring Boot runnable JAR with embedded Tomcat)

---

## 2. Option A: Cloud / VM Deployment (Ubuntu, Debian, EC2, DigitalOcean)

### Step 1: Install JRE & MySQL
```bash
sudo apt update
sudo apt install -y openjdk-17-jre-headless mysql-server nginx
```

### Step 2: Configure MySQL
```sql
CREATE DATABASE buildpilot;
CREATE USER 'buildpilot'@'localhost' IDENTIFIED BY 'YourSecurePassword@123';
GRANT ALL PRIVILEGES ON buildpilot.* TO 'buildpilot'@'localhost';
FLUSH PRIVILEGES;
```

### Step 3: Run Backend as Systemd Service (`/etc/systemd/system/buildpilot.service`)
```ini
[Unit]
Description=BuildPilot AI Pro Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/opt/buildpilot/backend
ExecStart=/usr/bin/java -jar /opt/buildpilot/backend/buildpilot-api-1.0.0.jar
Restart=always
Environment="SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/buildpilot?useSSL=false&allowPublicKeyRetrieval=true"
Environment="SPRING_DATASOURCE_USERNAME=buildpilot"
Environment="SPRING_DATASOURCE_PASSWORD=YourSecurePassword@123"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now buildpilot
```

### Step 4: Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/buildpilot`)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /opt/buildpilot/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/buildpilot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 3. Option B: Docker Compose Deployment (1-Command Containerization)

1. Start **Docker Desktop** on your machine or server.
2. In the project root, run:
```bash
docker compose up --build -d
```
All three tiers (MySQL 8.0, Spring Boot Backend, and Nginx Frontend) will spin up automatically on ports `3306`, `8080`, and `5173`.

---

## 4. Option C: Managed Cloud (Render / Railway / AWS App Runner)

- **Frontend:** Deploy `frontend/dist` or link the repository to **Vercel** / **Netlify** / **Cloudflare Pages** (Build command: `npm run build`, Output directory: `dist`).
- **Backend:** Deploy `backend/target/buildpilot-api-1.0.0.jar` or the backend repository to **Render** / **Railway** / **AWS App Runner** with environment variable `PORT=8080`.
- **Database:** Connect managed **AWS RDS MySQL** or **Railway MySQL**.
