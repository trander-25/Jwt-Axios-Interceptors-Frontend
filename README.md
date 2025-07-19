# Jwt-Axios-Interceptors-Frontend

A React frontend demonstrating modern JWT authentication with automatic access token renewal using Axios interceptors. This project is designed to integrate with a compatible backend (see [Jwt-Axios-Interceptors-Backend](https://github.com/trander-25/Jwt-Axios-Interceptors-Backend)), handling login, logout, protected routes, and seamless token refresh for a smooth user experience.

---

## Features

- **JWT Authentication (Access & Refresh Tokens):** Secure login flow with access and refresh token handling, stored in localStorage.
- **Axios Interceptors:** Automatic attachment of access token to requests and transparent token refresh on expiration (handles 410/401 status codes from backend).
- **Protected Routing:** React Router v6-based route guards to restrict dashboard access to authenticated users.
- **Login/Logout Flows:** Form-based login and logout with demo credentials.
- **Toast Notifications:** User-friendly error and status messages via `react-toastify`.
- **Material UI Integration:** Stylish UI built using Material UI components.
- **Demo Credentials Provided:** Ready-to-use login for demonstration/testing.

---

## Demo User

- **Email:** `trander@gmail.com`
- **Password:** `trander@123`

---

## Tech Stack

- React (with Vite)
- Axios
- React Router v6
- Material UI (MUI)
- React Hook Form
- React Toastify

---

## Project Structure

```
src/
├── apis/                # API utility functions (login, logout, refresh)
├── pages/               # Login & protected Dashboard pages
├── utils/
│   ├── authorizedAxios.js # Configured Axios instance with interceptors
│   └── constants.js       # API root URL and other constants
├── App.jsx              # Routing setup
├── main.jsx             # App entrypoint
```

---

## How JWT + Axios Interceptors Work

- **Login:**  
  User logs in via `/v1/users/login` API. Access and refresh tokens, and user info, are stored in localStorage.
- **Authenticated Requests:**  
  Access token is automatically attached to request headers (`Authorization: Bearer ...`) via Axios request interceptor.
- **Access Token Expiry:**  
  If backend returns 410 (token expired), the response interceptor automatically calls the refresh token API, updates the access token, and retries the original request.
- **Logout or Re-authentication:**  
  If backend returns 401 (invalid/expired session), user is logged out and redirected to login.
- **Protected Routing:**  
  Dashboard route is guarded; users must be logged in to access it.

---

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/trander-25/Jwt-Axios-Interceptors-Frontend.git
   cd Jwt-Axios-Interceptors-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (default Vite port).

4. **Connect to Backend**
   - Ensure [Jwt-Axios-Interceptors-Backend](https://github.com/trander-25/Jwt-Axios-Interceptors-Backend) is running at `http://localhost:8020` (default, see `src/utils/constants.js`).

---

## Customization

- **API Root:**  
  Change backend API URL in `src/utils/constants.js` if needed.

- **UI:**  
  Built with Material UI, easily customizable.

- **Environment Variables:**  
  For production, use environment variables and secure token storage strategies.

---

## Security Notes

- This project is for demonstration/educational purposes.  
- **Token Storage:** Uses localStorage for access/refresh tokens; for production, consider secure cookie strategies.
- **CORS:** Backend must allow credentials for cookie-based auth.
- **Demo Credentials:** No registration or real database in demo setup.

---

## License

No license specified.

---

## Author

[Trander](https://github.com/trander-25)
