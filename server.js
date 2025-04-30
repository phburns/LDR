const express = require("express");
const cors = require("cors");
const inventoryRouter = require("./src/pages/api/inventory");
const authRoutes = require("./src/pages/api/auth");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");

const app = express();
const prisma = new PrismaClient();

// Validate AWS credentials at startup
console.log("Vercel Blob Configuration at startup:");
console.log("BLOB_READ_WRITE_TOKEN exists:", !!process.env.BLOB_READ_WRITE_TOKEN);

// Test database connection
async function testConnection() {
  try {
    console.log("Testing database connection...");
    // Try to query the database
    await prisma.machine.findFirst();
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection error:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
  }
}

testConnection();

// Configure CORS - make sure this comes before routes
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Email routing configuration
const emailRoutes = {
  general: "Dennis.B@larrysdiesel.com",
  parts: "BJParadee@larrysdiesel.com",
  sales: "Dennis.B@larrysdiesel.com",
  repair: "Herb.S@larrysdiesel.com",
};

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Contact form endpoint - make sure this comes before other route handlers
app.post("/api/contact", async (req, res) => {
  console.log("Received contact form submission:", req.body); // Add logging
  try {
    const { name, company, email, telephone, subject, contactMethod, enquiry } =
      req.body;

    // Determine recipient based on subject
    const toEmail = emailRoutes[subject] || emailRoutes.general;

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telephone:</strong> ${telephone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Preferred Contact Method:</strong> ${contactMethod}</p>
        <p><strong>Enquiry:</strong></p>
        <p>${enquiry}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", toEmail); // Add logging
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
});

// Other route handlers
app.use("/api/inventory", inventoryRouter);
app.use("/api/auth", authRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "public")));

// The "catchall" handler: for any request that doesn't match one above,
// send back the index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params
  });
  
  res.status(500).json({
    message: "Internal Server Error",
    details: err.message,
    code: err.code,
    name: err.name
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
