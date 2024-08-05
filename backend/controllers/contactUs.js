const ContactUs = require("../models/contactUs");

exports.contactUs = (req, res) => {
  async function saveContactOnDB() {
    try {
      const contact = new ContactUs({
        userName: req.body.userName,
        emailAddress: req.body.emailAddress,
        message: req.body.message,
      });

      await contact.save();

      res.status(200).json({
        message: "Successfully saved the contact",
      });
    } catch {
      res.status(500).json({
        message: "Server failed to save query",
      });
    }
  }

  saveContactOnDB();
};
