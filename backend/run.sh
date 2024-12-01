#!/bin/bash

# Configurar o diretório de assets
export ASSETS_DIR="$(pwd)/assets"

# Navegar para o diretório dist
cd dist/src

# Iniciar a aplicação
node main.js
