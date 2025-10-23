# 🛒 E-Ticaret Mikroservis Mimarisi

Bu proje, **Node.js** ve **TypeScript** tabanlı, **Kafka** ile olay tabanlı iletişim (event-driven communication) sağlayan bir **mikroservis mimarisi** örneğidir.  
Amaç, ürün yönetimi, sipariş, ödeme, kullanıcı ve e-posta servislerinin birbirinden bağımsız fakat entegre şekilde çalıştığı ölçeklenebilir bir e-ticaret altyapısı kurmaktır.

---

## 🧩 Servislerin Genel Tanımı

| Servis | Açıklama |
|--------|-----------|
| **Catalog Service** | Ürünlerin yönetimi, listelenmesi ve stok bilgilerinden sorumludur. Stok değişikliklerini Kafka’ya yayınlar. |
| **Order Service** | Kullanıcı sepeti oluşturma, sepet yönetimi ve siparişe dönüştürme işlemlerini yürütür. Ürün stoklarını Catalog Service’ten kontrol eder. |
| **User Service** | Kullanıcı kayıt, giriş ve JWT tabanlı kimlik doğrulama işlemlerini sağlar. |
| **Payment Service** | **Stripe** üzerinden ödeme işlemlerini gerçekleştirir, sonuçları Kafka’ya yayınlar. |
| **Email Service** | Kafka üzerinden gelen ödeme ve sipariş olaylarını dinler, bilgilendirme e-postaları gönderir. |
| **Payment Frontend (React)** | Kullanıcının kart bilgilerini girip ödeme yapabildiği arayüzdür. Payment Service ile entegre çalışır. |

---

## 🧠 Mimarinin Akışı (Şemaya Göre)

1. **Catalog Service**
   - Ürün detaylarını ve stok bilgisini yönetir.  
   - Stok güncellemelerini **Kafka** aracılığıyla yayınlar.

2. **Order Service**
   - Kullanıcı sepetlerini oluşturur ve yönetir.  
   - Sepeti siparişe çevirir.  
   - Sipariş oluşturulduğunda Kafka’ya olay yayınlar.

3. **Payment Service**
   - Kafka’dan “order created” olayını dinler.  
   - Stripe üzerinden ödemeyi gerçekleştirir.  
   - Ödeme sonucunu Kafka’ya iletir.

4. **Email Service**
   - Ödeme ve sipariş olaylarını dinler.  
   - Kullanıcıya e-posta bildirimi gönderir.

5. **React Payment Frontend**
   - Kullanıcı kart bilgilerini girer.  
   - Ödeme işlemini Payment Service üzerinden tamamlar.

---

## ⚙️ Kullanılan Teknolojiler

- **Node.js**, **Express**, **TypeScript**
- **PostgreSQL**, **Prisma**, **Drizzle ORM**
- **Apache Kafka** (Event-driven iletişim)
- **Docker & Docker Compose**
- **JWT (JSON Web Token)** ile kimlik doğrulama
- **Stripe** (Ödeme altyapısı)
- **ElasticSearch** (Arama ve log analizi)
- **React** (Frontend ödeme ekranı)

---

## 🧰 Kurulum ve Çalıştırma

```bash
# 1. Depoyu klonla
git clone https://github.com/<kullanıcı-adın>/<repo-adın>.git
cd <repo-adın>

# 2. Docker servislerini başlat (Kafka, PostgreSQL, vb.)
docker-compose up -d

# 3. Her servisi başlat
cd catalog_service && yarn dev
cd order_service && yarn dev
cd user_service && yarn dev
cd payment_service && yarn dev
cd email_service && yarn dev

# 4. Frontend'i başlat
cd payment-frontend && yarn dev
