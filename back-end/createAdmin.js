// create-admin.js
const adminData = {
  name: "Admin User",
  email: "admin@resolveit.com",
  password: "admin123",
  role: "admin",
};

fetch("http://localhost:5000/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(adminData),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("✓ Admin user created:", data);
    process.exit(0);
  })
  .catch((err) => {
    console.error("✗ Error creating admin:", err.message);
    process.exit(1);
  });
