# 📋 Changelog / تغییرات

All notable changes to this project will be documented in this file.

تمام تغییرات مهم این پروژه در این فایل ثبت می‌شود.

---

## [2.0.0] - 2025-12-19

### 🇬🇧 English

#### Added
- **HTTPS API Support**: Switched from `ip-api.com` (HTTP only) to `ipwho.is` (HTTPS)
- **Cloudflare Support**: Full support for Cloudflare proxy with `CF-Connecting-IP` header
- **IPv4/IPv6 Detection**: API now returns `ipType` field indicating IP version
- **Separate IP Fields**: Added `ipv4` and `ipv6` fields in API response
- **Complete Documentation**: Comprehensive README with step-by-step installation guide
- **Nginx Configuration**: Added complete nginx config for both direct and Cloudflare setups
- **Troubleshooting Guide**: Added common issues and solutions section
- **PM2 Integration**: Added PM2 commands and auto-startup configuration

#### Changed
- **IP API Provider**: Changed from `ip-api.com` to `ipwho.is` for HTTPS support
- **IP Parsing Logic**: Improved IPv6 address handling and localhost detection
- **CSP Headers**: Updated Content-Security-Policy to use relative API paths
- **README Structure**: Complete rewrite with table of contents and better organization

#### Fixed
- **Invalid Query Error**: Fixed IP parsing that caused "invalid query" errors with IPv6
- **Cloudflare IP Detection**: Fixed real client IP detection when behind Cloudflare
- **IPv6 Localhost Bug**: Fixed `::1` being incorrectly processed causing API errors

#### Security
- Added Cloudflare IP ranges (IPv4 & IPv6) to nginx trusted proxies
- Enabled `real_ip_recursive` for proper IP chain resolution
- Improved rate limiting with client IP detection

---

### 🇮🇷 فارسی

#### اضافه شده
- **پشتیبانی از HTTPS**: تغییر از `ip-api.com` (فقط HTTP) به `ipwho.is` (HTTPS)
- **پشتیبانی از Cloudflare**: پشتیبانی کامل از پروکسی Cloudflare با header `CF-Connecting-IP`
- **تشخیص IPv4/IPv6**: API حالا فیلد `ipType` را برمی‌گرداند که نوع IP را نشان می‌دهد
- **فیلدهای جداگانه IP**: اضافه شدن فیلدهای `ipv4` و `ipv6` در پاسخ API
- **مستندات کامل**: README جامع با راهنمای نصب قدم به قدم
- **کانفیگ Nginx**: کانفیگ کامل nginx برای اتصال مستقیم و Cloudflare
- **راهنمای رفع مشکلات**: بخش مشکلات رایج و راه‌حل‌ها
- **یکپارچگی با PM2**: دستورات PM2 و تنظیم راه‌اندازی خودکار

#### تغییر یافته
- **ارائه‌دهنده API**: تغییر از `ip-api.com` به `ipwho.is` برای پشتیبانی HTTPS
- **منطق پردازش IP**: بهبود مدیریت آدرس IPv6 و تشخیص localhost
- **هدرهای CSP**: بروزرسانی Content-Security-Policy برای استفاده از مسیرهای نسبی API
- **ساختار README**: بازنویسی کامل با فهرست مطالب و سازماندهی بهتر

#### رفع شده
- **خطای Invalid Query**: رفع مشکل پردازش IP که باعث خطای "invalid query" با IPv6 می‌شد
- **تشخیص IP Cloudflare**: رفع تشخیص IP واقعی کاربر وقتی پشت Cloudflare است
- **باگ IPv6 Localhost**: رفع پردازش نادرست `::1` که باعث خطای API می‌شد

#### امنیت
- اضافه شدن IP ranges کلادفلر (IPv4 و IPv6) به proxy های مورد اعتماد nginx
- فعال‌سازی `real_ip_recursive` برای تشخیص صحیح زنجیره IP
- بهبود rate limiting با تشخیص IP کاربر

---

## [1.0.0] - 2025-12-18

### 🇬🇧 English

#### Initial Release
- Basic IP lookup functionality
- React 19 frontend with Persian UI
- Express 5 backend API
- Dark theme with green accent
- PWA support with offline capability
- Basic rate limiting (100 req/min)
- Security headers implementation
- Mobile responsive design

---

### 🇮🇷 فارسی

#### انتشار اولیه
- قابلیت پایه جستجوی IP
- فرانت‌اند React 19 با رابط کاربری فارسی
- API بک‌اند Express 5
- تم تیره با رنگ سبز
- پشتیبانی PWA با قابلیت آفلاین
- Rate limiting پایه (100 درخواست در دقیقه)
- پیاده‌سازی هدرهای امنیتی
- طراحی واکنش‌گرا برای موبایل

---

## Version History / تاریخچه نسخه‌ها

| Version | Date | Description |
|---------|------|-------------|
| 2.0.0 | 2025-12-19 | HTTPS API, Cloudflare support, IPv4/IPv6 |
| 1.0.0 | 2025-12-18 | Initial release |

---

<div dir="rtl">

## راهنمای نسخه‌بندی

این پروژه از [Semantic Versioning](https://semver.org/) پیروی می‌کند:

- **MAJOR** (X.0.0): تغییرات ناسازگار با نسخه‌های قبلی
- **MINOR** (0.X.0): قابلیت‌های جدید سازگار با نسخه‌های قبلی  
- **PATCH** (0.0.X): رفع باگ‌ها و بهبودهای جزئی

</div>
