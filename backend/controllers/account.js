const AccountDetails = require("../models/accountDetails");

exports.saveAccountDetails = (req, res) => {
  async function saveAccountDetailsOnDB() {
    try {
      const accountDetails = new AccountDetails({
        user: req.body.userId,
        emailAddress: req.body.emailAddress,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        city: req.body.city,
        postalCode: req.body.postalCode,
        address1: req.body.address1,
        address2: req.body.address2,
      });
      const result = await accountDetails.save();

      res.status(200).json({
        message: "Successfully saved the account details!",
        accountDetails: result,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: "Account details already saved!",
        });
      }
      res.status(500).json({
        message: "Server failed to save account details!",
      });
    }
  }

  saveAccountDetailsOnDB();
};

exports.updateAccountDetails = (req, res) => {
  async function updateAccountDetailsOnDB() {
    try {
      const accountDetails = await AccountDetails.findOne({
        user: req.body.userId,
      });

      if (!accountDetails)
        return res.status(404).json({
          message: "Please add account details before editing.",
        });

      let updated = false;

      if (req.body.emailAddress !== accountDetails.emailAddress) {
        updated = true;
      } else if (req.body.firstName !== accountDetails.firstName) {
        updated = true;
      } else if (req.body.lastName !== accountDetails.lastName) {
        updated = true;
      } else if (req.body.phoneNumber !== accountDetails.phoneNumber) {
        updated = true;
      } else if (req.body.city !== accountDetails.city) {
        updated = true;
      } else if (req.body.postalCode !== accountDetails.postalCode) {
        updated = true;
      } else if (req.body.address1 !== accountDetails.address1) {
        updated = true;
      } else if (!accountDetails.address2 && req.body.address2) {
        updated = true;
      } else if (accountDetails.address2 && !req.body.address2) {
        updated = true;
      } else if (accountDetails.address2 && req.body.address2) {
        if (accountDetails.address2 !== req.body.address2) updated = true;
      }

      if (!updated)
        return res.status(404).json({
          message:
            "The account details you entered already exist. Please try again.",
        });

      let result;

      if (req.body.address2) {
        result = await AccountDetails.updateOne(
          { user: req.body.userId },
          {
            _id: req.body.id,
            emailAddress: req.body.emailAddress,
            phoneNumber: req.body.phoneNumber,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            postalCode: req.body.postalCode,
            address1: req.body.address1,
            address2: req.body.address2,
          }
        );
      } else {
        result = await AccountDetails.updateOne(
          { user: req.body.userId },
          {
            $set: {
              _id: req.body.id,
              emailAddress: req.body.emailAddress,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              phoneNumber: req.body.phoneNumber,
              city: req.body.city,
              postalCode: req.body.postalCode,
              address1: req.body.address1,
            },
            $unset: {
              address2: "",
            },
          }
        );
      }

      res.status(200).json({
        message: "Successfully updated the acount details!",
      });
    } catch {
      res.status(500).json({
        message: "Server failed to update the  account details!",
      });
    }
  }

  updateAccountDetailsOnDB();
};

exports.fetchAccountDetails = (req, res) => {
  async function getAccountDetailsFromDB() {
    try {
      const userId = req.query.userId;

      const accountDetails = await AccountDetails.findOne({
        user: userId,
      });

      console.log(accountDetails);

      res.status(200).json({
        message: "Successfully fetched the account details",
        accountDetails: accountDetails,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the account details!",
      });
    }
  }

  getAccountDetailsFromDB();
};
