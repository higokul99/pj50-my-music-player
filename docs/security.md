# Security Guidelines

Authentication

- Laravel Sanctum

Passwords

- Bcrypt Hashing

File Uploads

- Validate MP3 Files
- Validate Image Files

API Security

- Rate Limiting
- Token Validation
- **Resource Ownership**: Strict middleware and controller-level checks to ensure users can only update or delete songs they have uploaded or cloned.

Database Security

- Prepared Statements
- ORM Usage
- **Scoped Queries**: Defaulting library queries to current user context to prevent data leakage.

Data Privacy
- Sensitive user information (passwords) is never exposed via API resources.
- Personal libraries are private by default, with only basic metadata shared in the Global Explorer.

Transport Security

- HTTPS Only

Server Security

- Firewall Enabled
- SSH Key Authentication