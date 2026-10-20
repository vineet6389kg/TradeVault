import { DEMO_EMAIL } from "../config/demo.js";

// blocks account changes on the shared demo account
export const blockDemo = (req, res, next) => {
  if (req.user.email === DEMO_EMAIL) {
    return res
      .status(403)
      .json({ message: "The demo account can't be changed. Create your own account to edit your profile." });
  }
  next();
};