# Vercel Support Ticket - SSL Certificate Error

**Date**: October 12, 2025  
**Priority**: High  
**Issue Type**: SSL/TLS Configuration

---

## Subject

SSL Certificate Error on Custom Domain - tlsv1 alert internal error

---

## Issue Description

I'm experiencing a persistent SSL handshake error on my custom domain that has not resolved after multiple troubleshooting attempts over 3+ hours.

### Affected Domains
- `www.mediaplanpro.com`
- `mediaplanpro.com`

### Error Message
```
ERR_SSL_PROTOCOL_ERROR
curl: (35) LibreSSL/3.3.6: error:1404B438:SSL routines:ST_CONNECT:tlsv1 alert internal error
```

### Working Domain
- `https://mediaplanpro.vercel.app` - Works perfectly with valid SSL

---

## Project Information

- **Project Name**: mediaplanpro
- **Team/Account**: anustups-projects-438c3483 (Hobby plan)
- **GitHub Repository**: https://github.com/rythmscape11/mediaplanpro
- **Framework**: Next.js 14.2.33
- **Node Version**: 22.x

---

## Domain Configuration

### Domain Registration
- **Domain**: mediaplanpro.com
- **Registrar**: Third Party
- **Age**: 1 day (added October 11, 2025)

### Nameservers (Correctly Configured)
- `ns1.vercel-dns.com` ✅
- `ns2.vercel-dns.com` ✅

### DNS Resolution
```bash
$ dig www.mediaplanpro.com +short
mediaplanpro.com.
84.32.84.32

$ dig mediaplanpro.com +short
84.32.84.32
```
✅ DNS resolving correctly to Vercel IP

### Vercel Project Domains (All Show "Valid Configuration")
1. `mediaplanpro.com` → Redirects to www.mediaplanpro.com (287 redirects)
2. `www.mediaplanpro.com` → Production
3. `mediaplanpro.vercel.app` → Production

---

## SSL Certificate Information

### Certificate 1
- **ID**: cert_PP6AaGtoYD5VVWgP5yUs0s2y
- **Domains**: mediaplanpro.com, www.mediaplanpro.com
- **Issued**: ~3 hours ago (Jan 10 2025 at 19:04)
- **Expiration**: 90 days
- **Auto-Renew**: Yes
- **Status**: Shows as "Active" in Vercel dashboard

### Certificate 2
- **ID**: cert_xSpYIIgjvPnEdHUbYcriwhhd
- **Domains**: *.mediaplanpro.com, mediaplanpro.com
- **Issued**: ~5 hours ago
- **Expiration**: 90 days
- **Auto-Renew**: Yes
- **Status**: Active

---

## Troubleshooting Steps Already Attempted

### 1. Deployment Protection ✅
- **Disabled**: Vercel Authentication
- **Status**: All deployment protection disabled
- **Result**: No change, SSL error persists

### 2. SSL Certificate Renewal ✅
- **Action**: Issued new certificate via CLI
  ```bash
  npx vercel certs issue mediaplanpro.com www.mediaplanpro.com
  ```
- **Result**: Certificate issued successfully but SSL handshake still fails

### 3. Waited for Propagation ✅
- **Duration**: 3+ hours
- **Expected**: 5-15 minutes
- **Result**: Error persists after extended wait time

### 4. Triggered New Deployments ✅
- **Action**: Multiple redeployments triggered
- **Latest Deployment**: https://mediaplanpro-eqwfqg228-anustups-projects-438c3483.vercel.app
- **Status**: Ready (Production)
- **Result**: Custom domain SSL still fails

### 5. Verified Configuration ✅
- **Domains**: All show "Valid Configuration" in dashboard
- **DNS**: Resolving correctly
- **Nameservers**: Correctly pointing to Vercel
- **Project Linking**: Domains properly assigned to project

### 6. Refreshed Domains ✅
- **Action**: Clicked "Refresh" button for both domains
- **Result**: Still shows valid configuration but SSL fails

---

## Technical Details

### SSL Handshake Failure
```bash
$ curl -v https://www.mediaplanpro.com 2>&1 | grep -A 5 "TLS handshake"
* ALPN: curl offers h2,http/1.1
* (304) (OUT), TLS handshake, Client hello (1):
*  CAfile: /etc/ssl/cert.pem
*  CApath: none
* LibreSSL/3.3.6: error:1404B438:SSL routines:ST_CONNECT:tlsv1 alert internal error
* Closing connection
```

### Error Analysis
- **Error Code**: 1404B438
- **SSL Routine**: ST_CONNECT
- **Error Type**: tlsv1 alert internal error
- **Meaning**: Server is actively rejecting the SSL handshake

This is **not** a certificate propagation issue (3+ hours passed). The server appears to be rejecting the SSL connection at the handshake stage.

### Comparison with Working Domain
```bash
$ curl -I https://mediaplanpro.vercel.app
HTTP/2 200 ✅
server: Vercel
...
```

The Vercel subdomain works perfectly, indicating:
- ✅ Application is deployed correctly
- ✅ SSL works on Vercel infrastructure
- ❌ SSL fails specifically on custom domain

---

## What Makes This Unusual

1. **Extended Duration**: SSL propagation typically takes 5-15 minutes, not 3+ hours
2. **Valid Configuration**: Vercel dashboard shows all domains as "Valid Configuration"
3. **Correct DNS**: DNS resolving to correct Vercel IP
4. **Certificate Issued**: SSL certificates show as issued and active
5. **Server Rejection**: Server actively rejecting SSL handshake (not a timeout or propagation issue)

---

## Hypothesis

Based on the error pattern and troubleshooting attempts, this appears to be:

1. **Edge Network Configuration Issue**: The SSL certificate may not be properly bound to the custom domain at the edge network level
2. **Certificate Routing Issue**: Vercel's edge nodes may not be routing the custom domain to the correct SSL certificate
3. **Platform Bug**: Possible issue with how Vercel handles SSL for third-party registered domains with Vercel DNS

---

## Request for Vercel Support

Could you please:

1. **Investigate the SSL certificate binding** for www.mediaplanpro.com and mediaplanpro.com
2. **Check edge network configuration** for these domains
3. **Verify certificate routing** is correctly configured
4. **Review any platform-level issues** that might cause this specific error
5. **Manually refresh/rebind** the SSL certificate if needed

---

## Additional Information

### Environment Variables
- `NEXTAUTH_URL`: Currently set to `https://mediaplanpro.vercel.app`
- Will update to `https://www.mediaplanpro.com` once SSL is working

### Application Type
- Next.js application with authentication (NextAuth)
- Requires working SSL for production use
- Currently blocked from using custom domain due to SSL error

### Business Impact
- **High**: Cannot use custom domain for production
- **Workaround**: Using mediaplanpro.vercel.app temporarily
- **Urgency**: Need to resolve to launch production site

---

## Diagnostic Commands Output

### Certificate Status
```bash
$ npx vercel certs ls
id                             cns                     expiration  renew  age  
cert_PP6AaGtoYD5VVWgP5yUs0s2y  - mediaplanpro.com          in 90d   yes    3h  
                               - www.mediaplanpro.com                          
cert_xSpYIIgjvPnEdHUbYcriwhhd  - *.mediaplanpro.com        in 90d   yes    5h  
                               - mediaplanpro.com
```

### Domain Status
```bash
$ npx vercel domains inspect mediaplanpro.com
Name: mediaplanpro.com
Registrar: Third Party
Nameservers: ns1.vercel-dns.com, ns2.vercel-dns.com ✅
Edge Network: yes
Projects: mediaplanpro (www.mediaplanpro.com, mediaplanpro.com)
```

### DNS Records
```bash
$ npx vercel dns ls mediaplanpro.com
name    type     value                                       
*       ALIAS    cname.vercel-dns-017.com.                   
        ALIAS    b11be6511b22c03c.vercel-dns-017.com         
        CAA      0 issue "letsencrypt.org"
```

### Deployment Aliases
```bash
$ npx vercel alias ls | grep mediaplanpro.com
mediaplanpro-eqwfqg228...vercel.app    mediaplanpro.com           
mediaplanpro-eqwfqg228...vercel.app    www.mediaplanpro.com
```

---

## Expected Resolution

Once this issue is resolved, I expect:
- ✅ https://www.mediaplanpro.com to load with valid SSL
- ✅ SSL padlock icon in browser
- ✅ No security warnings
- ✅ Certificate issued by Let's Encrypt
- ✅ Successful SSL handshake

---

## Contact Information

- **GitHub**: rythmscape11
- **Vercel Account**: anustups-projects-438c3483
- **Project**: mediaplanpro
- **Preferred Contact**: Via Vercel dashboard support ticket

---

## Timeline

- **Oct 11, 2025 20:24**: Domain added to Vercel
- **Oct 12, 2025 14:00**: First SSL certificate issued
- **Oct 12, 2025 16:00**: Second SSL certificate issued
- **Oct 12, 2025 17:00**: Disabled Vercel Authentication
- **Oct 12, 2025 17:30**: Multiple troubleshooting attempts
- **Oct 12, 2025 18:00**: Creating support ticket (current)

**Total Time Spent**: 3+ hours of troubleshooting

---

## Attachments

If needed, I can provide:
- Screenshots of Vercel dashboard showing "Valid Configuration"
- Full curl verbose output
- OpenSSL s_client output
- Additional diagnostic information

---

Thank you for your assistance in resolving this issue!

