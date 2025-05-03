- ![3](https://github.com/user-attachments/assets/e30e3a5e-7b10-4295-9c44-a7c0d5782d58)

## 🌟 Overview
Welcome to ByteBeasts Tamagotchi Game! 🎮 This interactive web-based game brings to life the magical creatures of Etheria known as ByteBeast. 🐾 Players act as guardians responsible for nurturing and caring for their Beasts, building a unique bond, and ensuring their companion grows strong and healthy. 💖

## 💻 Client Setup (with HTTPS)

To run the frontend locally over HTTPS (required for Controller), follow these steps:

### 1️⃣ Install mkcert  

Open a terminal and run:

```bash
brew install mkcert
```

> _mkcert_ is a simple tool for making locally-trusted development certificates.

---

### 2️⃣ Generate Local Certificates  

Run the following commands in the project root (or in the `client` folder):

```bash
mkcert -install
mkcert localhost
```

This will generate the files:  
- `localhost.pem` (certificate)  
- `localhost-key.pem` (private key)

---

### 3️⃣ Update Vite Configuration  

In your `vite.config.ts`, add the following `server` configuration:

```ts
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
  },
});
```

---

### 4️⃣ Run the Development Server  

Make sure you're inside the `client` directory, then install dependencies and run the app:

```bash
cd client
pnpm install
pnpm run dev
```

> Ensure the HTTPS certificates (`localhost.pem` and `localhost-key.pem`) are present in the root of the `client` project.

---

### 🧱 Client Dependencies

- Node.js (make sure it’s installed)
- pnpm (recommended for managing dependencies)

---
## ⛩️ Dojo

### ✅ Prerequisites  
Ensure the following dependencies are installed:

- **Dojo**: `v1.2.1`  
- **Scarb**: `v2.9.2`

---

### 🔨 Building Contracts  
To compile the smart contracts:

```bash
sozo build
```

---

### 🧪 Running Tests  
To execute the test suite:

```bash
sozo test
```

---

### 📦 Deployment  
Instructions for local and testnet deployment are provided below.

---

## 🖥️ Running Locally  

### 1️⃣ Start Katana (Terminal 1)  
Launch a local Starknet node:

```bash
katana --disable-fee --allowed-origins "*"
```

---

### 2️⃣ Build, Migrate, and Start Torii (Terminal 2)  

```bash
# Build the contracts
sozo build

# Deploy the world locally
sozo migrate

# Start the Torii indexer
torii --world <WORLD_ADDRESS> --allowed-origins "*"
```

> Replace `<WORLD_ADDRESS>` with the address returned by `sozo migrate`.

---

## 🌍 Deploying to Sepolia  

### 1️⃣ Set Up Environment  

```bash
cp .env.example .env.sepolia
```

Edit `.env.sepolia` and provide the following:

- `STARKNET_RPC_URL` → `https://api.cartridge.gg/x/starknet/sepolia`  
- `DOJO_ACCOUNT_ADDRESS` → Your deployment account address  
- `DOJO_PRIVATE_KEY` → Your deployment private key  

> ⚠️ Ensure this account is **funded** before proceeding.

---

### 2️⃣ Load Environment Variables  

```bash
source .env.sepolia
```

---

### 3️⃣ Deploy to Sepolia  

```bash
scarb run sepolia
```

> After deployment, the CLI will output your **world address**, which is required to interact with the deployed game.


## Founders
<table>
  <tr>
    <td align="center">
      <img src="client/src/assets/img/rolo.jpg" width="100px;" alt="Maintainer: Rolando"/>
      <br />
      <a href="https://t.me/roloxworld">Rolando</a>
      <br />
    </td>
    <td align="center">
      <img src="client/src/assets/img/Luis.png" width="100px;" alt="Maintainer: Luis"/>
      <br />
      <a href="https://t.me/devjimenezz22">Luis</a>
      <br />
    </td>
    <td align="center">
      <img src="client/src/assets/img/marco.jpeg" width="100px;" alt="Maintainer: Marco"/>
      <br />
      <a href="https://t.me/coxmar23">Marco</a>
      <br />
    </td>
    <td align="center">
      <img src="client/src/assets/img/daniel.jpeg" width="100px;" alt="Maintainer: Daniel"/>
      <br />
      <a href="https://t.me/danielcdz">Daniel</a>
      <br />
    </td>
  </tr>
</table>
