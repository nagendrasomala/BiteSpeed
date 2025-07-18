markdown
# Bitespeed Backend Task: Identity Reconciliation

This repository contains the backend implementation of the identity reconciliation task for Bitespeed.

## 🧠 Problem Statement

Bitespeed collects contact details (email and/or phoneNumber) from users, but users might use different contact info across different purchases. The goal is to **link all such identities** back to a single customer using a relational table (`Contact`), based on overlapping contact details.

## 📌 Requirements

Design an API endpoint:

```

POST /identify

````

### Request Payload (JSON):
```json
{
  "email": "example@example.com",
  "phoneNumber": "1234567890"
}
````

### Response Format:

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["example@example.com", "alt@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```

Refer to the task prompt for rules on:

* How and when to create a new contact
* When to mark a contact as `primary` or `secondary`
* When to merge contacts

## 🚀 Deployed API Endpoint

👉 https://bitespeed-lwp0.onrender.com

## ⚙️ Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **Prisma ORM**
* **Render.com** for deployment

## 🔧 How to Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/bitespeed-task.git
   cd bitespeed-task
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up `.env` file**

   ```
   DATABASE_URL=your_postgres_connection_url
   PORT=5000
   ```

4. **Run migrations** (if using Prisma)

   ```bash
   npx prisma migrate dev
   ```

5. **Start the server**

   ```bash
   npm start
   ```

6. **Test the API**
   Use tools like Postman or cURL:

   ```bash
   curl -X POST https://bitespeed-lwp0.onrender.com/identify \
   -H "Content-Type: application/json" \
   -d '{"email": "doc@flux.com", "phoneNumber": "123456"}'
   ```

## 🧠 Author

Nagendra Babu
Feel free to reach out for queries or suggestions!

```


I'm happy to help!
```
