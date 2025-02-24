![3](https://github.com/user-attachments/assets/e30e3a5e-7b10-4295-9c44-a7c0d5782d58)

# ByteBeast-Tamagotchi Dojo 
# Running Locally  

### 1️⃣ Start Katana (Terminal 1)  
Make sure this is running before proceeding:  

```bash
# Start Katana with disabled fees and open origins
katana --disable-fee --allowed-origins "*"
```

### 2️⃣ Build, Migrate, and Start Torii (Terminal 2)  

```bash
# Build the example
sozo build

# Migrate the example (deploy the world locally)
sozo migrate

# Start Torii
# Replace <WORLD_ADDRESS> with the deployed world address from the previous step
torii --world <WORLD_ADDRESS> --allowed-origins "*"
```

---

# 🚀 Deploying to Sepolia  

### 1️⃣ Set Up Environment Variables  

1. Copy `.env.example` to `.env.sepolia`:  
   ```bash
   cp .env.example .env.sepolia
   ```
2. Open `.env.sepolia` and fill in the required values:  
   - `STARKNET_RPC_URL` → `https://api.cartridge.gg/x/starknet/sepolia`  
   - `DOJO_ACCOUNT_ADDRESS` → The address of the deployment account  
   - `DOJO_PRIVATE_KEY` → The private key of the deployment account  

> ⚠️ **Important:** Ensure this account is **funded** before deploying.  

### 2️⃣ Load Environment Variables  

Before deploying, load the environment variables into your session:  

```bash
source .env.sepolia
```

### 3️⃣ Deploy to Sepolia  

Run the following command to deploy your world on Sepolia:  

```bash
scarb run sepolia
```

Once the deployment is complete, it will return the **world address**, which you will use to interact with the deployed game.  

