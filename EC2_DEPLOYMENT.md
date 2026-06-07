# AWS EC2 Deployment Guide: TicketFlow

This guide provides step-by-step instructions for deploying both the Node/Express backend and Vite/React frontend onto a single **AWS EC2 Ubuntu Instance** using Nginx as a reverse proxy, PM2 for process management, and Let's Encrypt for SSL certificates.

---

## 1. AWS EC2 Instance Provisioning

1. Log into your **AWS Console** and navigate to the **EC2 Dashboard**.
2. Click **Launch Instance**:
   - **Name**: `ticketflow-production`
   - **OS Images**: `Ubuntu Server 22.04 LTS (HVM), SSD Volume Type`
   - **Instance Type**: `t2.micro` (Free-tier eligible) or `t3.micro`
   - **Key Pair**: Create or select an existing `.pem` key pair for SSH access.
3. **Configure Security Group**:
   - Create a new security group and add these inbound security rules:
     - **SSH** (Port 22) -> Source: `My IP` (recommended) or `Anywhere (0.0.0.0/0)`
     - **HTTP** (Port 80) -> Source: `Anywhere (0.0.0.0/0)`
     - **HTTPS** (Port 443) -> Source: `Anywhere (0.0.0.0/0)`
4. Launch the instance.

---

## 2. Connect and Install Dependencies

Connect to your EC2 instance via SSH:
```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip
```

Update system dependencies and install **Node.js (LTS)**, **Nginx**, and **Git**:
```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install Node.js LTS (v18 or v20) via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
node -v
npm -v

# Install PM2 globally (Process Manager for Node.js)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

---

## 3. Clone and Configure the Application

1. Clone your GitHub repository onto the server (usually in `/var/www/` or home folder):
   ```bash
   cd /var/www
   sudo git clone https://github.com/maryamnawas03/ticker_management_system.git ticketflow
   sudo chown -R ubuntu:ubuntu /var/www/ticketflow
   cd ticketflow
   ```

2. **Configure Backend Environment**:
   - Create a `.env` production file:
     ```bash
     cd backend
     cp .env.example .env
     nano .env
     ```
   - Set the variables for production:
     ```env
     PORT=5000
     NODE_ENV=production
     MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ticket_management
     JWT_SECRET=your-highly-secure-production-jwt-key
     JWT_EXPIRY=7d
     FRONTEND_URL=https://your-domain.com
     ```
   - Install backend dependencies:
     ```bash
     npm install
     ```

3. **Configure Frontend Environment**:
   - Update the API base URL in the frontend config:
     ```bash
     cd ../frontend
     cp .env.example .env
     nano .env
     ```
   - Set the production API URL (point it to your domain's `/api` path, which Nginx will proxy):
     ```env
     VITE_API_BASE_URL=https://your-domain.com/api
     ```
   - Install frontend dependencies and build:
     ```bash
     npm install
     npm run build
     ```
     *This generates static files inside `/var/www/ticketflow/frontend/dist`.*

---

## 4. Run Backend with PM2

Start the backend Node server and set it to auto-restart on system reboots:
```bash
cd ../backend
pm2 start src/server.js --name "ticketflow-backend"

# Generate PM2 startup script to restart on boot
pm2 startup systemd
# Copy-paste the command printed by the output of the startup command, then run:
pm2 save
```

---

## 5. Configure Nginx Reverse Proxy

Nginx will serve the frontend React application static assets directly, and reverse-proxy any request containing `/api` to the backend running locally on port `5000`.

1. Open the default Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

2. Replace the server block with the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com; # Replace with your EC2 public IP if no domain is connected yet

       # Frontend - Serve static assets
       location / {
           root /var/www/ticketflow/frontend/dist;
           try_files $uri $uri/ /index.html;
           index index.html;
       }

       # Backend API - Reverse Proxy
       location /api/ {
           proxy_pass http://localhost:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Test the Nginx configuration and reload the service:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 6. Secure the Site with SSL (HTTPS)

Secure the connection using Let's Encrypt certificates via Certbot:

```bash
# Install Certbot and the Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Request and install SSL certificate (replacing with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot will automatically verify your domain, retrieve the certificates, update Nginx config blocks to enforce HTTPS (redirecting port 80 requests), and schedule auto-renewals.

---

## 7. Verifying Deployment
- Go to `https://your-domain.com` in your browser.
- Verify the frontend loads, and the API requests resolve correctly under `https://your-domain.com/api/health` or `/api/auth/me`.
