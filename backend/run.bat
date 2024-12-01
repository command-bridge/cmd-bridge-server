@echo off

:: Configurar o diretório de assets
set ASSETS_DIR=%~dp0assets

:: Navegar para o diretório dist
cd dist\src

:: Iniciar a aplicação
node main.js
