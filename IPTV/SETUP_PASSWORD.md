# Setting Up Password Protection

This guide explains how to set up password protection for your IPTV application.

## Quick Setup

### Option 1: Environment Variable (Recommended)

Set the password using an environment variable before starting the server:

```bash
export IPTV_PASSWORD="your-secure-password-here"
cd backend
python app.py
```

### Option 2: .env File

Create a `.env` file in the `backend` directory:

```bash
cd backend
echo "IPTV_PASSWORD=your-secure-password-here" > .env
python app.py
```

**Note:** The `.env` file is already in `.gitignore` so it won't be committed to GitHub.

### Option 3: System Environment Variable (Persistent)

Add to your shell profile (`~/.zshrc` or `~/.bash_profile`):

```bash
export IPTV_PASSWORD="your-secure-password-here"
```

Then reload your shell:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

## Disabling Password Protection

If you want to disable password protection, simply don't set the `IPTV_PASSWORD` environment variable, or set it to an empty string:

```bash
unset IPTV_PASSWORD
# or
export IPTV_PASSWORD=""
```

## How It Works

1. When `IPTV_PASSWORD` is set, the application requires authentication
2. Users will see a login screen when accessing the application
3. The password is hashed using SHA-256 before comparison
4. Sessions are maintained using Flask sessions (stored in cookies)
5. All API endpoints (except `/api/auth/*` and `/api/health`) require authentication

## Security Notes

- The password is hashed using SHA-256 (not bcrypt) for simplicity
- For production use, consider using a more secure hashing algorithm
- The password is never stored in plain text
- Sessions expire when the browser is closed (by default)
- Use a strong password for better security

## Testing

1. Start the server with a password set:
   ```bash
   export IPTV_PASSWORD="test123"
   cd backend
   python app.py
   ```

2. Open the frontend in your browser
3. You should see a login screen
4. Enter the password you set
5. You should be logged in and see the application

## Troubleshooting

### Login screen doesn't appear
- Check that `IPTV_PASSWORD` is set: `echo $IPTV_PASSWORD`
- Restart the Flask server after setting the password
- Check browser console for errors

### Can't login
- Verify the password matches exactly (case-sensitive)
- Check that the API URL is correct in settings
- Check browser console and server logs for errors

### Password not working after restart
- Make sure you're setting the environment variable before starting the server
- If using `.env`, ensure the file is in the `backend` directory
- Check that the Flask server is reading the environment variable

