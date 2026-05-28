# OpenPlotter Certificate Management

## Overview

OpenPlotter uses a **local Certificate Authority (CA)** to provide trusted HTTPS access across multiple access scenarios:
- **Local network**: `https://openplotter.local:3443`
- **Tailscale remote**: `https://openplotter.salmon-komodo.ts.net:3443`
- **Tailscale IP**: `https://100.77.140.121:3443`

## Certificate Architecture

```
OpenPlotter-Local-CA (Self-signed root CA)
    ↓
OpenPlotter Server Certificate (signed by Local CA)
    ├── CN: openplotter.local
    └── SANs: localhost, 127.0.0.1, openplotter.local, 
              openplotter.salmon-komodo.ts.net, 100.77.140.121
```

## Certificate Details

### Certificate Authority
- **Path**: `~/.signalk/ca-cert.pem` (on Pi)
- **Type**: Self-signed root CA
- **Validity**: 10 years (2026-2036)
- **Subject**: CN=OpenPlotter-Local-CA

### Server Certificate
- **Path**: `~/.signalk/ssl-cert.pem` (on Pi)
- **Type**: X.509 certificate signed by Local CA
- **Validity**: 10 years (2026-2036)
- **Subject**: CN=openplotter.local
- **Subject Alternative Names**:
  - DNS: localhost, openplotter.local, openplotter.salmon-komodo.ts.net
  - IPs: 127.0.0.1, 100.77.140.121

### Server Private Key
- **Path**: `~/.signalk/ssl-key.pem` (on Pi)
- **Type**: RSA 2048-bit private key
- **Permissions**: 600 (readable only by pi user)

## Eliminating Browser Warnings

To eliminate "not private" certificate warnings in your browser, you must **import the CA certificate** as trusted on each device.

### Browser: Chrome/Edge (Windows/Mac/Linux)

1. **Download the CA certificate**:
   - Copy `openplotter-ca-cert.pem` to your computer
   - Or access it from: `~/.signalk/ca-cert.pem` on the Pi

2. **Import into Chrome**:
   - Open `chrome://settings/security`
   - Click "Manage certificates"
   - Go to "Authorities" tab
   - Click "Import"
   - Select `openplotter-ca-cert.pem`
   - Check "Trust this certificate for identifying websites"
   - Click OK

3. **Verify**: Visit `https://openplotter.local:3443` - no warnings!

### Browser: Firefox (Windows/Mac/Linux)

1. **Download CA certificate** (as above)

2. **Import into Firefox**:
   - Open `about:preferences#privacy`
   - Scroll to "Certificates"
   - Click "View Certificates"
   - Go to "Authorities" tab
   - Click "Import"
   - Select `openplotter-ca-cert.pem`
   - Check "Trust this CA to identify websites"
   - Click OK

3. **Verify**: Visit `https://openplotter.local:3443` - no warnings!

### Mobile: iOS (Safari)

1. **Email CA certificate to yourself** or download via iOS browser

2. **Install certificate**:
   - Open Settings → General → VPN & Device Management
   - Tap the certificate file
   - Tap "Install" → "Install" → "Install"

3. **Trust the CA**:
   - Settings → General → About
   - Scroll to "Certificate Trust Settings"
   - Enable trust for "OpenPlotter-Local-CA"

### Mobile: Android (Chrome/Firefox)

1. **Download CA certificate**

2. **Install as system certificate**:
   - Open Settings → Security → Install certificate from storage
   - Select the CA certificate file
   - Name it "OpenPlotter-CA"

3. **Verify**: Visit `https://openplotter.local:3443` in Chrome/Firefox

### Enterprise: Google Workspace Admin Console

For managed Chrome devices on a Google Workspace domain, you can deploy the CA certificate to all devices automatically:

1. **Navigate to Google Admin Console**:
   - Go to https://admin.google.com/ac/networks/certificates/server-ca-certs
   - Sign in with your domain admin account

2. **Add the certificate**:
   - Click "Add server CA certificate"
   - Upload `openplotter-ca-cert.pem`
   - Give it a name (e.g., "OpenPlotter-Local-CA")

3. **Verify**: All managed Chrome devices on your domain will automatically trust the certificate for internal sites

## Getting the CA Certificate

### From the Pi (SSH)

```bash
scp -i ~/.ssh/id_claude_pi pi@openplotter.local:~/.signalk/ca-cert.pem ~/Downloads/openplotter-ca-cert.pem
```

### From SENA Repository

The CA certificate is stored in `/signalk/certificates/ca-cert.pem` for reference (non-sensitive, safe to distribute).

## Certificate Renewal

Certificates are valid for **10 years** (until May 2036). To renew:

1. SSH into the Pi
2. Run the certificate generation script:
   ```bash
   ~/.signalk/renew-certificates.sh
   ```
3. Restart SignalK: `sudo systemctl restart signalk`
4. Re-import CA certificate if CA key was regenerated

## Security Notes

⚠️ **Important**: The CA private key (`ca-key.pem`) should **never be shared or exposed**. It only exists on the Pi.

✅ **Safe to share**: The CA certificate (`ca-cert.pem`) is safe to distribute - it contains only the public key.

✅ **SignalK restart**: Changes to certificate files require restarting SignalK (`sudo systemctl restart signalk`).

## Troubleshooting

### Certificate not trusted after import
- Verify the CA certificate was imported into the correct store
- On some browsers, you may need to restart after importing
- Check that "OpenPlotter-Local-CA" appears in trusted certificates list

### Browser shows "Subject Alternate Name Missing"
- This indicates the certificate doesn't include the domain you're accessing
- The current certificate includes all expected SANs
- Try a different browser/device to rule out caching issues

### SignalK won't start with certificate error
- Check file permissions: `ls -la ~/.signalk/ssl-*.pem`
- Certificate files should have mode 600 (readable only by pi user)
- Fix with: `chmod 600 ~/.signalk/ssl-*.pem`

## Files Reference

| File | Purpose | Location | Permissions |
|------|---------|----------|-------------|
| ca-cert.pem | CA public certificate | ~/.signalk/ | 644 (readable) |
| ca-key.pem | CA private key | ~/.signalk/ | 600 (private) |
| ssl-cert.pem | Server certificate (signed by CA) | ~/.signalk/ | 600 (private) |
| ssl-key.pem | Server private key | ~/.signalk/ | 600 (private) |

## Related Documentation

- [SignalK Server Documentation](https://signalk.org/docs/server)
- [Let's Encrypt Alternative](https://letsencrypt.org/) (for public domains)
- [OpenSSL Documentation](https://www.openssl.org/docs/)
