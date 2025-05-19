![3](https://github.com/user-attachments/assets/e30e3a5e-7b10-4295-9c44-a7c0d5782d58)

# ByteBeast-Tamagotchi Dojo 
# Running Locally  

### 1️⃣ Start Katana (Terminal 1)  
Make sure this is running before proceeding:  

```bash
# Start Katana with disabled fees and open origins
katana --dev --dev.no-fee
```

### 2️⃣ Build, Migrate, and Start Torii (Terminal 2)  

```bash
# Build the example
sozo build

# Migrate the example (deploy the world locally)
sozo migrate

# Start Torii
# Replace <WORLD_ADDRESS> with the deployed world address from the previous step
torii --world <WA> --http.cors_origins "*"
```

---

# 🚀 Deploying to Sepolia  

### 1️⃣ Set Up Environment Variables  

Set environment variables for Sepolia deployment:  
   ```bash
      export STARKNET_RPC_URL="https://api.cartridge.gg/x/starknet/sepolia"
      export DEPLOYER_ACCOUNT_ADDRESS="<your_deployer_account_address_here>"
      export DEPLOYER_PRIVATE_KEY="<your_deployer_private_key_here>"
   ```

> ⚠️ **Important:** Ensure this account is **funded** before deploying.  

### 2️⃣ Update seed

Go to the file `dojo_sepolia.toml` and update the seed by incrementing the last number here: `seed = "tamagotchi1"`

### 3️⃣ Deploy to Sepolia using command

Run the following command to deploy your world on Sepolia:  

```bash
scarb run sepolia
```
Once the deployment is complete, it will return the **world address**, which you will use to interact with the deployed game.  

