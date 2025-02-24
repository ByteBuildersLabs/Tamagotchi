![3](https://github.com/user-attachments/assets/e30e3a5e-7b10-4295-9c44-a7c0d5782d58)


# ByteBeast-Tamagotchi Dojo Engine

## Running Locally

#### Terminal one (Make sure this is running)

```bash
# Run Katana
katana --disable-fee --allowed-origins "*"
```

#### Terminal two

```bash
# Build the example
sozo build

# Migrate the example
sozo migrate

# Start Torii
# Replace <WORLD_ADDRESS> with the address of the deployed world from the previous step
torii --world <WORLD_ADDRESS> --allowed-origins "*"
```

