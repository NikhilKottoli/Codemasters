const { randomBytes, createHmac } = require("crypto");
const supabase = require("../supabase");
const { createTokenForUser } = require("../services/authentication");

// Create a new user
async function createUser(fullName, email, password, role = "USER") {
  try {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");

    const { data, error } = await supabase.from("users").insert([
      {
        name: fullName,
        email,
        password: hashedPassword,
        salt,
        role,
      },
    ]);

    if (error) {
      console.error("Error creating user:", error.message);
      throw new Error("Failed to create user");
    }

    return data[0];
  } catch (err) {
    console.error("Create User Error:", err.message);
    throw err;
  }
}

// Match password and generate token
async function matchPasswordAndGenerateToken(email, password) {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();

    if (error || !user) {
      console.error("User not found");
      throw new Error("Invalid email or password");
    }

    const { salt, password: hashedPassword, ...userDetails } = user;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");
    if (hashedPassword !== userProvidedHash) throw new Error("Invalid email or password");

    const token = createTokenForUser(userDetails);

    return { token, user: userDetails };
  } catch (err) {
    console.error("Authentication Error:", err.message);
    throw err;
  }
}

module.exports = {
  createUser,
  matchPasswordAndGenerateToken,
};
