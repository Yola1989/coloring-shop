# LawenBook — الملفات المصحّحة

الدومين: `https://www.lawenbook.online`
صور R2: `pub-9b3678fddf8742c68c9ecd54cbc648da.r2.dev`

---

## كيفاش تحطهم

1. دير backup: `git commit -am "before fixes"`
2. فكّ الـZIP ونقل الملفات فوق القدام (نفس المسارات)
3. `npm run dev` — جرّب الصفحة الرئيسية، صفحة كتاب، السلة، والـadmin
4. `git commit -am "fixes" && git push` → Vercel يدير deploy

## ⚠️ زيد هاد المتغير فVercel

**Settings → Environment Variables** (Production + Preview + Development):

```
NEXT_PUBLIC_SITE_URL = https://www.lawenbook.online
```

---

## الملفات الجديدة (4)

| الملف | الفائدة |
|---|---|
| `app/sitemap.ts` | sitemap أوتوماتيكي من DB |
| `app/robots.ts` | robots.txt |
| `app/not-found.tsx` | صفحة 404 بالعربية |
| `app/error.tsx` | صفحة خطأ بالعربية |

## الملفات المبدّلة (23)

### SEO والمحتوى
| الملف | شنو تبدل |
|---|---|
| `app/layout.tsx` | metadata كامل + `lang="ar"` + `force-dynamic` |
| `app/page.tsx` | age/pages للـBookCard + نصوص عربية |
| `app/books/[id]/page.tsx` | `<Header/>` + `generateMetadata` |
| `components/Header.tsx` | نص السلة بالعربية |
| `components/Footer.tsx` | حيد جوج `<h1>` + ترجمة |

### الأمان
| الملف | شنو تبدل |
|---|---|
| `lib/auth.ts` | `timingSafeEqual` |
| `lib/orderNumber.ts` | `LB-` + `crypto.randomBytes` |
| `app/api/admin/login/route.ts` | rate limiting (5/10دق) |
| `app/api/admin/books/route.ts` | auth على GET |
| `app/api/admin/books/[id]/route.ts` | try/catch على DELETE |
| `app/api/admin/offers/route.ts` | auth على GET |
| `app/api/admin/offers/[id]/route.ts` | try/catch على DELETE |
| `app/api/admin/orders/[id]/route.ts` | try/catch على DELETE |
| `app/api/admin/promotion/route.ts` | حماية رسائل الخطأ |
| `app/api/admin/settings/route.ts` | حماية رسائل الخطأ |

### الصور — next/image (13 صورة)
| الملف | عدد |
|---|---|
| `next.config.ts` | remotePatterns + AVIF/WebP |
| `components/BookCard.tsx` | 1 (fill) |
| `components/PromotionSection.tsx` | 1 (fill) |
| `components/SpecialOffersSection.tsx` | 1 (fill) |
| `components/PreviewGallery.tsx` | 2 (fill + lightbox) |
| `app/books/[id]/page.tsx` | 1 (priority) |
| `app/offers/[id]/page.tsx` | 1 (priority) |
| `app/cart/page.tsx` | 1 |
| `app/admin/(dashboard)/page.tsx` | 1 |
| `app/admin/(dashboard)/offers/page.tsx` | 1 |
| `app/admin/(dashboard)/books/BookForm.tsx` | 2 |
| `app/admin/(dashboard)/offers/OfferForm.tsx` | 1 |

---

## مامسيتش عمداً

- `context/CartContext.tsx` — ماكانش فالـZIP ديالك
- `package.json` — نفس الشي
- `dir="rtl"` على `<html>` — غادي يقلب التصميم ويكسر الـadmin

---

## ⚠️ إلا بدّلتي خدمة الصور من بعد

خاصك تزيد الدومين الجديد ف`next.config.ts` تحت `remotePatterns`، وإلا الصور غادي يوليو مكسّرين.

والصور القدام اللي محفوظين فقاعدة البيانات بالرابط القديم خاصهم يتبدلو حتا هوما.
