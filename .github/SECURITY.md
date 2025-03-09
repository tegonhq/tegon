# Security Policy  

**Last Updated:** 2025-03-09  

## Reporting a Vulnerability  

We encourage responsible disclosure of security vulnerabilities to help keep the project secure. If you discover a security issue, follow these steps:  

1. **Do not open a public issue**  
   - Publicly disclosing a vulnerability before a fix is available can put users at risk. Please report the issue privately.  

2. **Contact the Tegon security team**  
   - Email **`harshith at tegon.ai`** with the subject line: **"Security Vulnerability Report"**.  
   - Provide a detailed description, including:  
     - Steps to reproduce  
     - Affected components  
     - Any supporting evidence (logs, proof-of-concept, screenshots, etc.)  

3. **Response and follow-up**  
   - You will receive an acknowledgement within **one business day**.  
   - The security team may request additional details or clarification.  

4. **Confidentiality**  
   - Do not publicly disclose the vulnerability until the team has resolved it.  
   - Tegon will notify you once a fix is available and coordinate a responsible disclosure timeline.  

## Out-of-Scope Vulnerabilities  

The following types of vulnerabilities are **not considered security issues** under this policy:  

- Clickjacking on pages without sensitive actions.  
- Unauthenticated/logout/login **CSRF**.  
- Attacks requiring **man-in-the-middle (MITM)** or **physical access** to a device.  
- **Denial-of-Service (DoS) attacks** or any activity that disrupts service availability.  
- Content spoofing or text injection issues **without a clear attack vector**.  
- **Email spoofing** (without direct exploitability).  
- Missing **DNSSEC, CAA, CSP headers**.  
- Lack of **Secure** or **HttpOnly** flags on non-sensitive cookies.  
- **Broken links (dead links)**.  

If you are unsure whether an issue qualifies, you may still reach out for clarification.  

## Testing Guidelines  

When testing for vulnerabilities, please adhere to the following rules:  

- **Do not run automated scanners** without prior approval, as they may cause unnecessary server load.  
- **Do not attempt to access, modify, or delete** any user data or sensitive information.  
- **Do not perform aggressive or disruptive testing** that could impact system availability.  

If you wish to conduct in-depth security testing, please contact the Tegon security team first to discuss the scope and obtain permission.  

## What to Expect  

- You will receive an **acknowledgement** within **one business day**.  
- The security team may request additional information or clarification.  
- The team will **work to resolve** the issue as quickly as possible and keep you informed.  
- Once a **fix is implemented**, you will be notified with details about the patch.  
- **No legal action** will be taken against researchers who report vulnerabilities responsibly.  
- You will be granted permission to **publicly disclose** the issue once users have had reasonable time to update.
