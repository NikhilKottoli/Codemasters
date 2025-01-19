const supabase = require("../supabase");

const serveSigninPage = (req, res) => {
  return res.send("Signin page. Please provide email and password.");
};

const serveSignupPage = (req, res) => {
  return res.send("Signup page. Please provide your details to register.");
};

const handleSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error, session } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.cookie("token", session.access_token);  // store JWT in cookies
    return res.status(200).json({ message: "Signed in successfully", token: session.access_token });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

const handleSignup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the email already exists using Supabase
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        error: "Email is already in use",
        message: "The email address you entered is already associated with an existing account.",
      });
    }

    const { user, session, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return res.status(500).json({ error: "Failed to sign up", message: signUpError.message });
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: user.id,
        full_name: fullName,
        email,
        role: "USER", // Default role
      },
    ]);

    if (insertError) {
      return res.status(500).json({ error: "Failed to create user record", message: insertError.message });
    }

    return res.status(201).json({
      message: "Signup successful. You can now sign in.",
      user: { email: user.email, fullName },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to create user. Try again.",
      message: error.message,
    });
  }
};

const getUserData = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  try {
    const { user, error } = await supabase.auth.api.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user data", message: error.message });
  }
};

module.exports = {
  serveSigninPage,
  serveSignupPage,
  handleSignin,
  handleSignup,
  handleLogout,
  getUserData,
};
