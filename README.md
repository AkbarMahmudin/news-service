# Mini Project Sistem Manajemen Berita

Sistem **microservices News** berbasis **NestJS**, **PostgreSQL (Prisma)**, **RabbitMQ**, dan **Elasticsearch**. Arsitektur dirancang mengikuti prinsip **SOLID**, event-driven, dan scalable.

---

## 1. Cara Clone & Menjalankan Project

### Prerequisites

* Node.js >= 18 (disarankan 20)
* Docker & Docker Compose
* Git

### Clone Repository

```bash
git clone https://github.com/AkbarMahmudin/news-service
cd news-service
```

### Menjalankan dengan Docker

```bash
docker compose up --build
```

### Menjalankan migration
```bash
docker compose run api npx prisma migrate deploy
```

Service yang tersedia:

| Service       | URL                                              |
| ------------- | ------------------------------------------------ |
| API           | [http://localhost:3000](http://localhost:3000)   |
| RabbitMQ UI   | [http://localhost:15672](http://localhost:15672) |
| Elasticsearch | [http://localhost:9200](http://localhost:9200)   |

> Catatan:
>
> - Pastikan file `.env` telah dibuat
> - Ikuti step **2** untuk menyiapkan file `.env`

---

## 2. Konfigurasi Environment

Buat file `.env` di root project atai copy paster file `.env.example`:

```env
# API PORT
PORT=3000

# DATABASE
DATABASE_URL="postgresql://root:password123!@postgres:5432/news_app"

# RABBITMQ
RABBIT_MQ_URI=amqp://rabbitmq:5672
RABBIT_MQ_NEWS_QUEUE=news

# ELASTICSEARCH
ELASTIC_URL=http://elasticsearch:9200
```

> Catatan:
>
> * Jangan gunakan `localhost` untuk komunikasi antar container
> * Gunakan nama service sesuai `docker-compose.yml`

---

## 3. Penjelasan Arsitektur (Singkat)

```
CLIENT
  ↓ HTTP
API SERVICE (NestJS)
  ↓ Prisma ORM
PostgreSQL
  ↓ publish event
RabbitMQ
  ↓ consume
WORKER SERVICE (NestJS)
  ↓ index
Elasticsearch
```

### Tanggung Jawab Service

* **API Service**

    * HTTP endpoint
    * Validasi request
    * Simpan data ke PostgreSQL
    * Publish event ke RabbitMQ

* **Worker Service**

    * Consume event dari RabbitMQ
    * Index data ke Elasticsearch
    * Retry & idempotent processing

---

## 4. Cara Menguji API

### 4.1 Create News

```http
POST /api/news
Content-Type: application/json
```

Body:

```json
{
  "title": "Breaking News",
  "content": "This is news content",
  "author": "Admin",
  "source": "twitter"
}
```

Response sukses:

```json
{
  "status": "ok",
  "message": "News stored and queued",
  "id": 1
}
```

---

### 4.2 Get News (Pagination)

```http
GET /api/news?page=1&limit=10
```

Response:

```json
{
  "page": 1,
  "limit": 10,
  "total": 1,
  "data": []
}
```

---

### 4.3 Search News (Elasticsearch)

```http
GET /api/search?q=breaking
```

Response:

```json
[
  {
    "id": 1,
    "title": "Breaking News",
    "content": "This is news content",
    "author": "Admin",
    "source": "twitter",
    "createdAt": "2025-12-19T02:00:00.000Z"
  }
]
```

---

## 5. Cara Menguji Worker

Worker **tidak memiliki endpoint HTTP**.

### Langkah Pengujian

1. Jalankan API dan Worker
2. Lakukan request `POST /api/news`
3. Pantau log worker:

```bash
docker compose logs -f worker
```

Contoh log sukses:

```
[ConsumersService] Message received
[ConsumersService] Indexed document id=1
```

4. Verifikasi data di Elasticsearch:

```bash
curl http://localhost:9200/news/_search
```

---

## 6. Troubleshooting Umum

| Error                                 | Penyebab           | Solusi                        |
| ------------------------------------- | ------------------ | ----------------------------- |
| `exit code 137`                       | Memory ES kurang   | Atur `ES_JAVA_OPTS`           |
| `getaddrinfo EAI_AGAIN elasticsearch` | ES belum siap      | Tambahkan healthcheck / retry |
| Prisma tidak connect                  | DATABASE_URL salah | Gunakan `postgres:5432`       |

---

## 7. Development Notes

* Prisma Client digenerate saat build (Prisma v7 compatible)
* Elasticsearch menggunakan single-node (development only)
* RabbitMQ menggunakan durable queue

---

## 8. License

UNLICENSED
