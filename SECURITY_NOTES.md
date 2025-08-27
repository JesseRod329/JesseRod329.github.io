# Security Notes

## Content Security Policy (CSP) Requirements

This portfolio implements strict security policies to protect against XSS, injection attacks, and other web vulnerabilities. The JavaScript file `/assets/cli.js` requires specific CSP directives to function properly.

### Baseline CSP Configuration

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
```

### Current Implementation

The site currently uses a slightly relaxed policy for compatibility with GitHub Pages:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self'; 
  style-src 'unsafe-inline'; 
  img-src 'self' data:; 
  font-src 'self'; 
  connect-src 'none'; 
  script-src 'self'; 
  object-src 'none'; 
  media-src 'none'; 
  child-src 'none'; 
  form-action 'none'; 
  base-uri 'self';
">
```

### Key Security Principles

1. **No Inline Scripts**: All JavaScript code lives in `/assets/cli.js`
2. **Self-Hosted Only**: No external script dependencies
3. **Safe DOM Manipulation**: Uses `textContent` instead of `innerHTML`
4. **No Dynamic Code Execution**: No `eval()`, `Function()`, or similar constructs

## Subresource Integrity (SRI)

### Why SRI Matters

Subresource Integrity protects against compromised CDNs and ensures script files haven't been tampered with. While this site is self-hosted, SRI provides additional security layers.

### Implementation Steps

#### 1. Generate SRI Hash

Once `/assets/cli.js` is stable and no longer changing frequently:

```bash
# Generate SHA384 hash
openssl dgst -sha384 -binary /assets/cli.js | openssl base64 -A

# Alternative using Node.js crypto
node -e "const crypto = require('crypto'); const fs = require('fs'); const content = fs.readFileSync('assets/cli.js'); console.log('sha384-' + crypto.createHash('sha384').update(content).digest('base64'));"
```

#### 2. Update Script Tag

Replace the current script tag:

```html
<!-- Current -->
<script src="/assets/cli.js" defer></script>

<!-- With SRI -->
<script src="/assets/cli.js" 
        integrity="sha384-[GENERATED_HASH]" 
        crossorigin="anonymous" 
        defer></script>
```

#### 3. Example Implementation

```html
<script src="/assets/cli.js" 
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC" 
        crossorigin="anonymous" 
        defer></script>
```

### SRI Best Practices

- **Use SHA384 or SHA512**: Stronger than SHA256
- **Include crossorigin attribute**: Required for SRI validation
- **Update hashes after changes**: SRI will fail if file contents change
- **Consider multiple hashes**: Can specify fallback algorithms

## Security Architecture

### Progressive Enhancement Model

The site implements a three-tier security model:

1. **Base Level (No JavaScript)**
   - Static terminal interface with CSS animations
   - Complete portfolio content accessible
   - Noscript fallback navigation

2. **Enhanced Level (JavaScript Enabled)**
   - Interactive CLI terminal
   - Command processing with safe output
   - PDF downloads and external links

3. **Hardened Level (Strict CSP + SRI)**
   - Subresource integrity verification
   - Stricter CSP without `unsafe-inline`
   - Complete protection against supply chain attacks

### JavaScript Security Features

#### Safe DOM Manipulation

```javascript
// ✅ Safe - Uses textContent
addOutput(text, className = '') {
  const outputLine = document.createElement('div');
  outputLine.className = `cli-output-line ${className}`;
  outputLine.textContent = text; // No XSS risk
  this.outputContainer.appendChild(outputLine);
}

// ❌ Unsafe - Would use innerHTML
// outputLine.innerHTML = userInput; // XSS vulnerability
```

#### Input Sanitization

```javascript
// All user input is safely handled
processCommand() {
  const command = this.currentInput.trim().toLowerCase();
  // Command lookup uses object property access, not eval
  if (this.commands[command]) {
    this.commands[command]();
  }
}
```

#### No Dynamic Code Execution

- No `eval()` calls
- No `Function()` constructor usage
- No `setTimeout(string)` or `setInterval(string)`
- All functionality uses static methods

## Deployment Security Checklist

### Pre-Deployment

- [ ] Verify CSP policy is correctly implemented
- [ ] Confirm no inline scripts or event handlers
- [ ] Test with JavaScript disabled (noscript fallback)
- [ ] Validate all external links use `rel="noopener noreferrer"`

### Post-Deployment (Optional SRI Implementation)

- [ ] Generate SRI hash for stable `cli.js`
- [ ] Update script tag with integrity attribute
- [ ] Test SRI validation works correctly
- [ ] Monitor for SRI violations in browser console

### Ongoing Maintenance

- [ ] Update SRI hash after any `cli.js` changes
- [ ] Regular security header validation
- [ ] Monitor CSP violation reports
- [ ] Audit dependencies (minimal in this case)

## Security Headers Verification

### Required Headers

All pages should include these security headers:

```html
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Content-Security-Policy" content="[CSP_POLICY]">
```

### Testing Tools

- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

## Threat Model

### Mitigated Threats

| Threat | Mitigation | Status |
|--------|------------|--------|
| XSS (Cross-Site Scripting) | Strict CSP + Safe DOM | ✅ Protected |
| Clickjacking | X-Frame-Options: DENY | ✅ Protected |
| MIME Confusion | X-Content-Type-Options | ✅ Protected |
| Code Injection | script-src 'self' + No eval | ✅ Protected |
| Supply Chain | SRI (when implemented) | ⚠️ Optional |
| Data Exfiltration | connect-src 'none' | ✅ Protected |

### Residual Risks

- **CSS Injection**: `style-src 'unsafe-inline'` allows some CSS-based attacks
- **File Upload**: Not applicable (static site)
- **SQL Injection**: Not applicable (no database)
- **CSRF**: Not applicable (no forms)

## Development Guidelines

### Adding New JavaScript

If additional JavaScript files are needed:

1. **Self-host all scripts** - No external CDNs
2. **Use same CSP principles** - No inline code
3. **Update SRI hashes** - For all modified files
4. **Test with strict CSP** - Verify compatibility

### Modifying Existing Code

When updating `/assets/cli.js`:

1. **Maintain safe patterns** - Continue using `textContent`
2. **Avoid dangerous functions** - No eval, innerHTML, etc.
3. **Test thoroughly** - Verify all commands work
4. **Update SRI** - Generate new hash if SRI is implemented

### Emergency Procedures

If a security issue is discovered:

1. **Immediate**: Remove affected files from deployment
2. **Short-term**: Implement temporary CSP restrictions
3. **Long-term**: Fix vulnerability and strengthen policies
4. **Follow-up**: Review and update security documentation

## Contact Information

For security-related questions or vulnerability reports:

- **Email**: jesse@jesserodriguez.me
- **Security Page**: [/security.html](/security.html)
- **Response Time**: Best effort within 48 hours

---

*Last Updated: 2024 - Review quarterly or after significant changes*
