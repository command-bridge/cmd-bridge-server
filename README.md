# Command-Bridge Server

Command-Bridge is a client-server application designed to enable centralized control of distributed workstations or servers through a central control panel.

---

## Features
- Centralized management of distributed systems.
- Easy setup and configuration through a user-friendly UI.
- RESTful API for seamless integration with external tools.

---

## Getting Started

Follow these steps to download, configure, and run Command-Bridge Server.

### 1. **Download the Source Code**
Clone or download the repository to your local machine.

### 2. **Install Dependencies**
Run the following command in the project directory to install all required dependencies:
```bash
npm install
```

### 3. **Configuration**
Set up the application using the configuration UI.

1. Start the configuration process:
   ```bash
   npm run configure
   ```
2. Open your browser and navigate to [http://localhost:8080](http://localhost:8080).
3. Complete the configuration steps in the UI.
4. Once finished, close the application by pressing `Ctrl + C`.

### 4. **Start the Backend**
Start the backend application using:
```bash
npm run start:backend
```

---

## Verifying the Application
- Once running, the API will be available at the IP and port specified during configuration.
- The admin user can log in using the `/user/login` endpoint.

---

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to see.

---

## License
This project is licensed under the [MIT License](LICENSE).