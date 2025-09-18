# ORDER-PRODUCTION API BACK-END FOR BAKERY HOME PRODUCTION APP.

This is a back-end program for my personal project. i develop a order system and admin dashboard for small business. in this program provide bussiness logic and control data by restful API. 

## Tech-Stack
| Category             | Technology/Tools                            | Explanation                                |
|----------------------|---------------------------------------------|-------------------------------------------|
| Backend              | Node.js, Express.js, TypeScript   | Runtime + framework + type safety         |
| Database             | PostgreSQL + Prisma   | Relasional + ORM                  |
| Authentication       | JWT, bcrypt                       | Token-based auth & password hashing       |
| Security             | soon                            | HTTP security headers & akses domain      |
| File/Media Storage   | MinIO                  | Penyimpanan file/gambar/video             |
| Logging & Monitoring | Winston      | Logging request & error tracking          |
| Testing              | Postman             | Unit test & endpoint test                 |
| DevOps/Deployment    | Vercel, Neon    | Containerization & deployment             |
| Documentation        | Postman, Markdown                 | Documentation & pengujian API               |


## 1. Auth API Spec
## Register
**Description** : api for register user 

**Endpoint** : [POST] http://localhost:5000/auth/register

[Body]
``` json
body :
{
    "name" : "Zahid Aja",
    "email" : "zahidaja@example.com",
    "password" : "zahidaja"
}
```

**Response 201 : success**
``` json
body :
{
    "name" : "Zahid Aja",
    "email" : "zahidaja@example.com",
    "password" : "zahidaja"
}

response :
{
    "massage": "User registered successfully",
    "user": {
        "id_user": "usr-6a83dd01-d787-41c7-9aac-806eb4e930d3",
        "name": "Mahfudz aja",
        "email": "mahfudzaja@contoh.com",
        "role": "CUSTOMER"
    }
}
```

**Response 400 : register with same credentials**
``` json
body :
{
    "name" : "Zahid Aja",
    "email" : "zahidaja@example.com",
    "password" : "zahidaja"
}

response :
{
    "message": "Email sudah terdaftar"
}
```

**Response 400 : email not valid**
``` json
Body :
{
    "name" : "mahfudz aja",
    "email" : "mahfudzaja@ example.com",
    "password" : "mahfudzaja"
}

response :
{
    "message": "Validasi Gagal",
    "errors": [
        {
            "message": "Email tidak valid"
        }
    ]
}
```

**Response 400 : field name empty**
```json
Body 
{
    "name" : "",
    "email" : "mahfudzaja@example.com",
    "password" : "mahfudzaja"
}

response :
{
    "message": "Validasi Gagal",
    "errors": [
        {
            "message": "Nama wajib diisi"
        },
        {
            "message": "Nama minimal 3 karakter"
        }
    ]
}
```

**Response 400 : field password empty**
```json
Body 
{
    "name" : "Mahfudz aja",
    "email" : "mahfudzaja@example.com",
    "password" : ""
}

response :
{
    "message": "Validasi Gagal",
    "errors": [
        {
            "message": "Password wajib diisi"
        },
        {
            "message": "Password minimal 6 karakter"
        }
    ]
}
```

**Response 400 : field email empty**
```json
Body 
{
    "name" : "Mahfudz aja",
    "email" : "",
    "password" : "mahfudzaja"
}

response : 
{
    "message": "Validasi Gagal",
    "errors": [
        {
            "message": "Email wajib diisi"
        },
        {
            "message": "Email tidak valid"
        }
    ]
}
```