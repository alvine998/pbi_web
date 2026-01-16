# API Reference Documentation - PBI Dashboard

Dokumen ini berisi panduan teknis lengkap untuk pengembangan backend API, mencakup spesifikasi endpoint dan contoh payload data (JSON) untuk integrasi frontend.

## Base URL & Authentication

- **Base URL**: `https://api.pbi-dashboard.example.com/v1`
- **Auth**: Bearer Token (JWT).
- **Header**: `Authorization: Bearer <token>`

---

## 1. Authentication & Profil

### Login

- **Endpoint**: `POST /auth/login`
- **Request Body**:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Edit Profile

- **Endpoint**: `PUT /auth/profile`
- **Content-Type**: `multipart/form-data`
- **Fields**: `name`, `email`, `phone`, `avatar` (File).

### Change Password

- **Endpoint**: `POST /auth/change-password`
- **Request Body**:

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

---

## 2. Manajemen Pengguna (Users)

### List Users

- **Endpoint**: `GET /users?page=1&limit=10&search=john`
- **Response**:

```json
{
  "totalItems": 45,
  "totalPages": 5,
  "currentPage": 1,
  "items": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Admin",
      "status": "Active",
      "lastLogin": "2026-01-08 10:00"
    }
  ]
}
```

### Create User

- **Endpoint**: `POST /users`
- **Request Body**:

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "Editor",
  "status": "Active",
  "password": "secretpassword"
}
```

---

## 3. Manajemen Produk (Products)

### Create Product

- **Endpoint**: `POST /products`
- **Content-Type**: `multipart/form-data`
- **Body**:

```json
{
  "name": "Properti XYZ",
  "price": 1500000000,
  "category": "Residential",
  "description": "Hunian mewah strategis...",
  "images": ["file1.jpg", "file2.jpg"]
}
```

---

## 4. Aspirasiku (No KYC)

### List Aspirations

- **Endpoint**: `GET /aspirations?status=Pending`
- **Response**:

```json
{
  "items": [
    {
      "id": 1,
      "userName": "Agus",
      "category": "Infrastruktur",
      "content": "Jalan berlubang...",
      "status": "Pending",
      "date": "2026-01-07"
    }
  ]
}
```

### Update Status

- **Endpoint**: `PATCH /aspirations/:id/status`
- **Request Body**:

```json
{
  "status": "Diproses"
}
```

---

## 5. Berita (News)

### Create News

- **Endpoint**: `POST /news`
- **Request Body**:

```json
{
  "title": "Update Pembangunan Tahap 2",
  "category": "Pembangunan",
  "content": "<p>Isi berita dalam HTML...</p>",
  "status": "Published",
  "image": "url-media-id"
}
```

---

## 6. Forum Diskusi

### Add Comment

- **Endpoint**: `POST /forum/:id/comments`
- **Request Body**:

```json
{
  "userId": 101,
  "content": "Sangat setuju dengan saran ini!"
}
```

---

## 7. Polling / Survey

### Create Poll

- **Endpoint**: `POST /polls`
- **Request Body**:

```json
{
  "question": "Puas dengan layanan kami?",
  "options": [
    { "text": "Sangat Puas" },
    { "text": "Puas" },
    { "text": "Buruk" }
  ],
  "endDate": "2026-02-01"
}
```

---

## 8. Notifikasi

### Mark Read

- **Endpoint**: `PATCH /notifications/:id/read`
- **Response**: `200 OK`

---

## 9. Live Chat

### Send Message

- **Endpoint**: `POST /chat/:sessionId/messages`
- **Request Body**:

```json
{
  "text": "Halo, ada yang bisa dibantu?",
  "type": "text"
}
```

---

## 10. Activity Log

- **Endpoint**: `GET /activity-log`
- **Response**:

```json
{
  "items": [
    {
      "id": 500,
      "user": "Admin",
      "action": "Delete Product",
      "target": "Properti XYZ",
      "timestamp": "2026-01-08 12:00",
      "ip": "192.168.1.1"
    }
  ]
}
```

---

## Standar Response Error

**Status 400 Bad Request**:

```json
{
  "error": "Validation Error",
  "message": "Email sudah digunakan",
  "fields": {
    "email": "Duplicate entry"
  }
}
```
