.
# 🦷 Tanna Dental Clinic Management System

A modern, premium dental clinic web platform built for seamless patient interaction and efficient clinic management.

This project includes:

* Responsive clinic website
* Appointment booking system
* Admin dashboard
* Gallery management (images & videos)
* Service management
* Supabase authentication & database integration

## ✨ Features

* 🔐 Secure Admin Login
* 📅 Appointment Booking System
* 🦷 Dynamic Services Management
* 🖼️ Gallery Upload System (Images & Videos)
* 📱 Fully Responsive Modern UI
* ☁️ Supabase Backend Integration
* ⚡ Real-Time Database Operations
* 🎨 Premium TailwindCSS Design
* 📂 Media Storage using Supabase Storage

## 🛠️ Tech Stack

* HTML5
* Tailwind CSS
* JavaScript
* Supabase
* Responsive Design Principles

## 👨‍⚕️ Project Purpose

Designed for dental clinics to:

* showcase treatments and services
* manage appointments efficiently
* maintain a professional digital presence
* simplify media/content management

## 🚀 Future Enhancements

* Online payments
* Patient records system
* WhatsApp integration
* Multi-admin support
* Email notifications
* Analytics dashboard
* AI chatbot assistant

## 📌 Developed By

Yashvi Thakkar

---


## Admin Notification Setup

Appointment booking can notify the admin by email and WhatsApp through the Vercel API function at `/api/appointment-notification`.

Set these environment variables in Vercel:

* `RESEND_API_KEY` - Resend API key for sending email
* `NOTIFICATION_FROM_EMAIL` - verified sender email in Resend, for example `Tanna Dental <appointments@yourdomain.com>`
* `WHATSAPP_TOKEN` - Meta WhatsApp Cloud API access token
* `WHATSAPP_PHONE_NUMBER_ID` - Meta WhatsApp phone number ID
* `WHATSAPP_API_VERSION` - optional Meta Graph API version, defaults to `v26.0`

By default, notifications go to `drdineshtanna79@gmail.com` and `1675.yashvi@gmail.com`, and WhatsApp `919860703424`, and WhatsApp `917820840535`. To change these later, set comma-separated `ADMIN_EMAIL` or `ADMIN_WHATSAPP_TO` values in Vercel.

After adding or changing Vercel environment variables, redeploy the project.

