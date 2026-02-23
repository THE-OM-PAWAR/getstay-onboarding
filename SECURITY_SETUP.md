# Security Gate Setup

This application now has a password-protected security gate that prevents unauthorized access.

## Configuration

### Password
- Current Password: `Sky47@GetStay`
- Hash Algorithm: bcrypt with 12 rounds
- Session Duration: 24 hours

### Environment Variable
The password hash is stored in `.env`:
```
APP_PASSWORD_HASH=$2b$12$vPdUZXBIaZmcpiI7IxYMDusTR992KibVBP/AooyK01N8cfmdFb1JS
```

## How It Works

1. When users visit the application, they see a password prompt
2. The password is sent to `/api/auth/verify` for validation
3. Backend compares the password with the stored hash using bcrypt
4. On success, a secure HTTP-only cookie is set with 24-hour expiration
5. The cookie is checked on subsequent visits via `/api/auth/check`

## Changing the Password

To change the password:

1. Edit `scripts/generate-password-hash.js` with your new password
2. Run: `node scripts/generate-password-hash.js`
3. Copy the generated hash to `.env` as `APP_PASSWORD_HASH`
4. Restart the development server

## Security Features

- Password is hashed with bcrypt (12 rounds)
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production
- SameSite strict policy prevents CSRF
- 24-hour session expiration
- Password never stored in plain text

## API Endpoints

- `POST /api/auth/verify` - Verify password and create session
- `GET /api/auth/check` - Check if user is authenticated
- `POST /api/auth/logout` - Clear authentication session
