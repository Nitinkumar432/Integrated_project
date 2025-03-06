import Seeker from "../Models/seekers.js";
import Provider from "../Models/provideschema.js";

// Get All Unverified Providers
export const getPendingProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ verificationStatus: "pending" });
    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ error: "Error fetching providers" });
  }
};

// Approve Provider
export const approveProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    await Provider.findByIdAndUpdate(providerId, {
      verificationStatus: "verified",
    });
    res.status(200).json({ message: "Provider approved successfully!" });
  } catch (error) {
    console.error("Error approving provider:", error);
    res.status(500).json({ error: "Error approving provider" });
  }
};

// Reject Provider
export const rejectProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    await Provider.findByIdAndUpdate(providerId, {
      verificationStatus: "rejected",
    });
    res.status(200).json({ message: "Provider rejected successfully!" });
  } catch (error) {
    console.error("Error rejecting provider:", error);
    res.status(500).json({ error: "Error rejecting provider" });
  }
};

// Get All Seekers
export const getAllSeekers = async (req, res) => {
  try {
    const seekers = await Seeker.find();
    res.status(200).json(seekers);
  } catch (error) {
    console.error("Error fetching seekers:", error);
    res.status(500).json({ error: "Error fetching seekers" });
  }
};
