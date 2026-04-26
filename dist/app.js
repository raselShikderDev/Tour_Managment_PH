"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const globalError_1 = require("./app/middleware/globalError");
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("./app/config/passportJs");
const env_1 = require("./app/config/env");
// import session from "express-session";
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// app.use(
//   session({
//     secret: envVars.EXPRESS_SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false,
//     },
//   })
// );
const frontUrl = env_1.envVars.FRONEND_URL;
app.use((0, cors_1.default)({
    origin: frontUrl,
    credentials: true,
}));
app.use(passport_1.default.initialize());
// app.use(passport.session());
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    // res.send("Here is the Tour managment Backend");
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tour Management API Docs</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800">
  <!-- Header -->
  <header class="bg-blue-600 text-white shadow">
    <div class="max-w-6xl mx-auto py-6 px-4">
      <h1 class="text-3xl font-bold">Tour Management API</h1>
      <p class="text-blue-100 mt-2">REST API for Tours, Bookings, Payments & User Management</p>
      <p class="mt-2"><strong>Base URL:</strong> <code>https://backend-tour-system.vercel.app/api/v1</code></p>
    </div>
  </header>

  <main class="max-w-6xl mx-auto py-10 px-4 space-y-12">
    <!-- Users -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">👤 User Routes</h2>
      <ul class="space-y-2">
        <li><code>GET /user/all-users</code> – Get all users (Admin, Super Admin)</li>
        <li><code>GET /user/me</code> – Get current logged-in user</li>
        <li><code>POST /user/register</code> – Register a new user</li>
        <li><code>GET /user/:userId</code> – Get single user (Admin, Super Admin)</li>
        <li><code>PATCH /user/:userId</code> – Update a user</li>
        <li><code>DELETE /user/:userId</code> – Delete a user (Admin, Super Admin)</li>
      </ul>
    </section>

    <!-- Auth -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">🔑 Auth Routes</h2>
      <ul class="space-y-2">
        <li><code>POST /auth/login</code> – Login with credentials</li>
        <li><code>POST /auth/refresh-token</code> – Get new access token</li>
        <li><code>POST /auth/logout</code> – Logout user</li>
        <li><code>POST /auth/forgot-password</code> – Forgot password</li>
        <li><code>POST /auth/chnage-password</code> – Change password</li>
        <li><code>POST /auth/set-password</code> – Set password</li>
        <li><code>POST /auth/reset-password</code> – Reset password</li>
        <li><code>GET /auth/google</code> – Google login</li>
        <li><code>GET /auth/google/callback</code> – Google callback</li>
      </ul>
    </section>

    <!-- OTP -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">📩 OTP Routes</h2>
      <ul class="space-y-2">
        <li><code>POST /otp/send</code> – Send OTP to email</li>
        <li><code>POST /otp/verify</code> – Verify OTP</li>
      </ul>
    </section>

    <!-- Tours -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">🗺️ Tour Routes</h2>
      <ul class="space-y-2">
        <li><code>POST /tour/create-tour-type</code> – Create a tour type</li>
        <li><code>GET /tour/tour-types</code> – Get all tour types</li>
        <li><code>GET /tour/tour-types/:id</code> – Get single tour type</li>
        <li><code>PATCH /tour/tour-types/:id</code> – Update tour type</li>
        <li><code>DELETE /tour/tour-types/:id</code> – Delete tour type</li>
        <li><code>POST /tour/create</code> – Create a new tour</li>
        <li><code>GET /tour</code> – Get all tours</li>
        <li><code>GET /tour/:slug</code> – Get single tour by slug</li>
        <li><code>PATCH /tour/:id</code> – Update a tour</li>
        <li><code>DELETE /tour/:id</code> – Delete a tour</li>
      </ul>
    </section>

    <!-- Division -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">🌍 Division Routes</h2>
      <ul class="space-y-2">
        <li><code>POST /division/create</code> – Create a division</li>
        <li><code>GET /division</code> – Get all divisions</li>
        <li><code>GET /division/:slug</code> – Get single division</li>
        <li><code>PATCH /division/:id</code> – Update division</li>
        <li><code>DELETE /division/:id</code> – Delete division</li>
      </ul>
    </section>

    <!-- Bookings -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">📌 Booking Routes</h2>
      <ul class="space-y-2">
        <li><code>POST /booking/create</code> – Create a booking</li>
        <li><code>GET /booking</code> – Get all bookings (Admin, Super Admin)</li>
        <li><code>GET /booking/my-booking</code> – Get current user’s bookings</li>
        <li><code>GET /booking/:bookingId</code> – Get single booking</li>
        <li><code>PATCH /booking/:bookingId/status</code> – Update booking status</li>
        <li><code>DELETE /booking/:bookingId</code> – Delete booking</li>
      </ul>
    </section>

    <!-- Payments -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">💳 Payment Routes</h2>
      <ul class="space-y-2">
        <li><code>POST /payment/init-payment/:bookingId</code> – Initialize payment</li>
        <li><code>POST /payment/success</code> – Payment success callback</li>
        <li><code>POST /payment/fail</code> – Payment failed callback</li>
        <li><code>POST /payment/cancel</code> – Payment cancel callback</li>
        <li><code>POST /payment/validate-payment</code> – Validate payment</li>
        <li><code>GET /payment/all-invoices</code> – Get all invoices (Admin, Super Admin)</li>
        <li><code>GET /payment/invoices/:paymentId</code> – Get single invoice</li>
      </ul>
    </section>

    <!-- Stats -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">📊 Stats Routes</h2>
      <ul class="space-y-2">
        <li><code>GET /stats/users</code> – User stats</li>
        <li><code>GET /stats/payments</code> – Payment stats</li>
        <li><code>GET /stats/bookings</code> – Booking stats</li>
        <li><code>GET /stats/tours</code> – Tour stats</li>
      </ul>
    </section>
  </main>

  <footer class="bg-gray-200 py-6 mt-12">
    <div class="max-w-6xl mx-auto text-center text-gray-600">
      © 2025 Tour Management API. All rights reserved.
    </div>
    <div class="max-w-6xl mx-auto text-center text-gray-600">
      Devloped by Rasel Shikder.
    </div>
  </footer>
</body>
</html>
`);
});
// Handling Global Erro
app.use(globalError_1.globalError);
// Handling not found
app.use(notFound_1.default);
exports.default = app;
