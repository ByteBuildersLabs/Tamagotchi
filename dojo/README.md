![HORIZONTAL 1](https://github.com/user-attachments/assets/23cf4504-95b4-492a-ab0d-1e98ffd79154)

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

