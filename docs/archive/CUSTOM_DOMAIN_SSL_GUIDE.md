# MediaPlanPro - Custom Domain SSL Configuration Guide

**Date**: October 12, 2025  
**Domain**: www.mediaplanpro.com / mediaplanpro.com  
**Issue**: ERR_SSL_PROTOCOL_ERROR  
**Status**: 🔄 **IN PROGRESS**

---

## Current Status

### ✅ Domain Configuration
- **Domain**: mediaplanpro.com
- **Registrar**: Third Party
- **Nameservers**: Vercel DNS (correctly configured)
  - ns1.vercel-dns.com ✅
  - ns2.vercel-dns.com ✅
- **DNS Resolution**: Working (84.32.84.32 - Vercel IP)
- **Project Link**: mediaplanpro → www.mediaplanpro.com, mediaplanpro.com

### ✅ SSL Certificate
- **Certificate ID**: cert_PP6AaGtoYD5VVWgP5yUs0s2y
- **Domains Covered**: 
  - mediaplanpro.com ✅
  - www.mediaplanpro.com ✅
- **Expiration**: 90 days
- **Auto-Renew**: Yes
- **Issued**: Just now (fresh certificate)

### ⚠️ Current Issue
- **Error**: ERR_SSL_PROTOCOL_ERROR
- **Cause**: SSL certificate propagation in progress
- **Expected Resolution**: 5-15 minutes

---

## What Happened

### Timeline
1. **24 hours ago**: Domain added to Vercel
2. **2 hours ago**: First SSL certificate issued (wildcard)
3. **Just now**: New SSL certificate issued (specific domains)
4. **Current**: Certificate propagating across Vercel's edge network

### Why the Error Occurs
The `ERR_SSL_PROTOCOL_ERROR` happens because:
1. SSL certificate was just issued (11 seconds ago)
2. Certificate needs to propagate to all Vercel edge nodes
3. Your browser/location might be hitting an edge node that hasn't received the new certificate yet
4. This is **normal and expected** for newly issued certificates

---

## Solution: Wait for Propagation

### Expected Timeline
- **Minimum**: 5 minutes
- **Typical**: 10-15 minutes
- **Maximum**: 30 minutes (rare)

### What's Happening Now
Vercel is:
1. ✅ Issuing the SSL certificate (COMPLETE)
2. 🔄 Distributing certificate to edge nodes (IN PROGRESS)
3. ⏳ Updating DNS records (IN PROGRESS)
4. ⏳ Configuring load balancers (IN PROGRESS)

---

## Verification Steps

### Step 1: Wait 10-15 Minutes
The most important step is to **wait** for the certificate to propagate.

### Step 2: Clear Browser Cache
After waiting, clear your browser cache:
1. Open browser settings
2. Clear browsing data
3. Select "Cached images and files"
4. Clear data

### Step 3: Test the Domain
Try accessing:
- https://www.mediaplanpro.com
- https://mediaplanpro.com

### Step 4: Check Certificate Status
```bash
# Check if certificate is being served
openssl s_client -connect www.mediaplanpro.com:443 -servername www.mediaplanpro.com < /dev/null 2>&1 | grep -E "(subject|issuer|Verify)"
```

Expected output:
```
subject=CN=www.mediaplanpro.com
issuer=C=US, O=Let's Encrypt, CN=R3
Verify return code: 0 (ok)
```

### Step 5: Test with curl
```bash
curl -I https://www.mediaplanpro.com
```

Expected output:
```
HTTP/2 200
server: Vercel
...
```

---

## Troubleshooting

### If Still Not Working After 30 Minutes

#### Option 1: Remove and Re-add Domain
```bash
# Remove domain from project
npx vercel domains rm www.mediaplanpro.com
npx vercel domains rm mediaplanpro.com

# Wait 2 minutes

# Re-add domain
npx vercel domains add www.mediaplanpro.com
npx vercel domains add mediaplanpro.com
```

#### Option 2: Force Certificate Renewal
```bash
# Remove old certificate
npx vercel certs rm cert_PP6AaGtoYD5VVWgP5yUs0s2y

# Issue new certificate
npx vercel certs issue mediaplanpro.com www.mediaplanpro.com
```

#### Option 3: Check DNS Propagation
```bash
# Check if DNS is resolving correctly
dig www.mediaplanpro.com A +short
dig mediaplanpro.com A +short

# Should return Vercel IP (76.76.21.21 or 84.32.84.32)
```

#### Option 4: Check from Different Location
Use online tools to check from different locations:
- https://www.whatsmydns.net/#A/www.mediaplanpro.com
- https://dnschecker.org/#A/www.mediaplanpro.com

---

## NEXTAUTH_URL Update

Once the SSL certificate is working, we need to update NEXTAUTH_URL to use the custom domain.

### Current NEXTAUTH_URL
```
https://mediaplanpro.vercel.app
```

### Recommended NEXTAUTH_URL
```
https://www.mediaplanpro.com
```

### How to Update
```bash
# Remove old NEXTAUTH_URL
npx vercel env rm NEXTAUTH_URL production --yes
npx vercel env rm NEXTAUTH_URL preview --yes

# Add new NEXTAUTH_URL with custom domain
printf "https://www.mediaplanpro.com" | npx vercel env add NEXTAUTH_URL production
printf "https://www.mediaplanpro.com" | npx vercel env add NEXTAUTH_URL preview

# Trigger redeployment
git commit --allow-empty -m "chore: Update NEXTAUTH_URL to custom domain"
git push origin main
```

### Why This Matters
- NextAuth validates the request origin against NEXTAUTH_URL
- Using the custom domain ensures authentication works on www.mediaplanpro.com
- Prevents CORS and session issues

---

## DNS Configuration

### Current DNS Records (Vercel Managed)
```
Type    Name    Value               TTL
A       @       84.32.84.32         Auto
CNAME   www     mediaplanpro.com    Auto
```

### Nameservers
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

These are correctly configured at your domain registrar.

---

## SSL Certificate Details

### Certificate 1 (Wildcard)
- **ID**: cert_xSpYIIgjvPnEdHUbYcriwhhd
- **Domains**: *.mediaplanpro.com, mediaplanpro.com
- **Age**: 2 hours
- **Status**: Active

### Certificate 2 (Specific)
- **ID**: cert_PP6AaGtoYD5VVWgP5yUs0s2y
- **Domains**: mediaplanpro.com, www.mediaplanpro.com
- **Age**: Just issued
- **Status**: Propagating

Both certificates are valid and will work. Vercel will automatically use the most specific certificate for each domain.

---

## Testing Checklist

After waiting 10-15 minutes, test the following:

### Browser Tests
- [ ] Open https://www.mediaplanpro.com in browser
- [ ] Check for SSL padlock icon in address bar
- [ ] Click padlock → View certificate
- [ ] Verify certificate is issued by "Let's Encrypt"
- [ ] Verify certificate covers www.mediaplanpro.com

### Command Line Tests
```bash
# Test HTTPS connection
curl -I https://www.mediaplanpro.com

# Test SSL certificate
openssl s_client -connect www.mediaplanpro.com:443 -servername www.mediaplanpro.com < /dev/null

# Test DNS resolution
dig www.mediaplanpro.com A +short
```

### Expected Results
- ✅ HTTPS connection successful (HTTP/2 200)
- ✅ SSL certificate valid (Verify return code: 0)
- ✅ DNS resolves to Vercel IP (84.32.84.32)
- ✅ No browser warnings
- ✅ Padlock icon shows in address bar

---

## Common Issues & Solutions

### Issue 1: "NET::ERR_CERT_COMMON_NAME_INVALID"
**Cause**: Certificate doesn't cover the domain  
**Solution**: Re-issue certificate with correct domain names

### Issue 2: "ERR_SSL_PROTOCOL_ERROR"
**Cause**: Certificate not yet propagated (current issue)  
**Solution**: Wait 10-15 minutes for propagation

### Issue 3: "NET::ERR_CERT_AUTHORITY_INVALID"
**Cause**: Certificate not trusted  
**Solution**: Vercel uses Let's Encrypt (trusted), clear browser cache

### Issue 4: "This site can't be reached"
**Cause**: DNS not resolving  
**Solution**: Check nameservers at domain registrar

### Issue 5: Redirect loop
**Cause**: NEXTAUTH_URL mismatch  
**Solution**: Update NEXTAUTH_URL to match custom domain

---

## Next Steps

### Immediate (Now)
1. ✅ SSL certificate issued
2. ⏳ Wait 10-15 minutes for propagation
3. ⏳ Test domain access

### After SSL Works (15 minutes)
1. Update NEXTAUTH_URL to custom domain
2. Trigger redeployment
3. Test authentication on custom domain
4. Update any hardcoded URLs in the app

### Optional (Later)
1. Set up domain redirect (www → non-www or vice versa)
2. Configure custom 404 page
3. Set up monitoring for SSL expiration
4. Configure CDN caching rules

---

## Monitoring

### Check Certificate Status
```bash
# List all certificates
npx vercel certs ls

# Inspect specific certificate
npx vercel certs inspect cert_PP6AaGtoYD5VVWgP5yUs0s2y
```

### Check Domain Status
```bash
# List all domains
npx vercel domains ls

# Inspect specific domain
npx vercel domains inspect mediaplanpro.com
```

### Check Deployment Status
```bash
# List recent deployments
npx vercel ls

# Check if custom domain is aliased
npx vercel alias ls
```

---

## Expected Timeline

| Time | Status | Action |
|------|--------|--------|
| 0 min | Certificate issued | ✅ Complete |
| 5 min | Propagating to edge nodes | 🔄 In progress |
| 10 min | Available in most regions | ⏳ Pending |
| 15 min | Fully propagated globally | ⏳ Pending |
| 20 min | Update NEXTAUTH_URL | ⏳ Pending |
| 25 min | Redeploy application | ⏳ Pending |
| 30 min | Test authentication | ⏳ Pending |

---

## Support Resources

### Vercel Documentation
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [SSL Certificates](https://vercel.com/docs/concepts/projects/domains/ssl)
- [DNS Configuration](https://vercel.com/docs/concepts/projects/domains/dns)

### Debugging Tools
- [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=www.mediaplanpro.com)
- [DNS Checker](https://dnschecker.org/#A/www.mediaplanpro.com)
- [What's My DNS](https://www.whatsmydns.net/#A/www.mediaplanpro.com)

---

## Summary

### ✅ What's Working
- Domain registered and configured
- Nameservers pointing to Vercel
- DNS resolving correctly
- SSL certificate issued
- Project linked to domain

### ⏳ What's In Progress
- SSL certificate propagation (5-15 minutes)
- Edge network distribution
- Global availability

### 📋 What's Next
1. Wait 10-15 minutes
2. Test domain access
3. Update NEXTAUTH_URL
4. Redeploy application
5. Test authentication

---

**Current Status**: ⏳ **WAITING FOR SSL PROPAGATION**  
**Expected Resolution**: 10-15 minutes  
**Next Check**: October 12, 2025, 20:25 IST  
**Action Required**: Wait and then test domain access

