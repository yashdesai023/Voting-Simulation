# Deploying PocketBase on AWS EC2

This guide will help you set up PocketBase on a minimal AWS EC2 instance (Ubuntu).

## 1. Instance Setup
1.  Launch an **EC2 Instance**:
    *   **OS**: Ubuntu 22.04 LTS (or 24.04).
    *   **Type**: `t3.micro` or `t3.small` (free tier eligible mostly).
    *   **Security Group**: Open ports **80** (HTTP), **443** (HTTPS), and **22** (SSH).

2.  SSH into your instance:
    ```bash
    ssh -i your-key.pem ubuntu@your-ec2-ip
    ```

## 2. Install PocketBase
1.  Download and unzip PocketBase:
    ```bash
    # (Check https://pocketbase.io/docs/ for latest version)
    wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip
    sudo apt-get install unzip
    unzip pocketbase_0.22.21_linux_amd64.zip
    ```

2.  Test it:
    ```bash
    ./pocketbase serve --http="0.0.0.0:8090"
    ```
    *   Access `http://your-ec2-ip:8090/_/` in browser to set admin account.
    *   **Stop** it (`Ctrl+C`) after testing.

## 3. Run as Systemd Service (Keep it running)
1.  Create service file:
    ```bash
    sudo nano /etc/systemd/system/pocketbase.service
    ```

2.  Paste this content:
    ```ini
    [Unit]
    Description=PocketBase
    After=network.target

    [Service]
    User=ubuntu
    Group=ubuntu
    WorkingDirectory=/home/ubuntu
    ExecStart=/home/ubuntu/pocketbase serve --http="127.0.0.1:8090"
    Restart=always

    [Install]
    WantedBy=multi-user.target
    ```

3.  Enable and start:
    ```bash
    sudo systemctl enable pocketbase
    sudo systemctl start pocketbase
    sudo systemctl status pocketbase
    ```

## 4. Setup Nginx (Reverse Proxy) & SSL
1.  Install Nginx and Certbot:
    ```bash
    sudo apt update
    sudo apt install nginx python3-certbot-nginx
    ```

2.  Configure Nginx:
    ```bash
    sudo nano /etc/nginx/sites-available/pocketbase
    ```

3.  Paste content (replace `yourdomain.com` with your actual domain):
    ```nginx
    server {
        server_name yourdomain.com; # OR your IP if not using domain

        location / {
            proxy_pass http://127.0.0.1:8090;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

4.  Enable site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    ```

## 5. SSL (HTTPS) - Optional if you have a domain
```bash
sudo certbot --nginx -d yourdomain.com
```

## 6. Import Schema
1.  Go to `https://yourdomain.com/_/` (or IP).
2.  Go to **Settings > Import/Export**.
3.  Click **Import Collections**.
4.  Paste the content of `pb_schema.json` I provided.
5.  Click **Import**.

Done! Your Backend is ready.
