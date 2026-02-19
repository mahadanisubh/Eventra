import Event from "../models/event.model.js";
import User from "../models/user.model.js";

export const registerInEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "No Event Found" });
    }

    const userId = req.user._id;
    const alreadyRegistered = event.registeredUsers.some(
      (registration) => registration.user.toString() === userId.toString(),
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }
    event.registeredUsers.push({
      user: userId,
      registeredAt: new Date(),
    });
    await event.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { registeredEvents: event._id },
    });
    res.status(201).json({ message: "Sucessfully Registered", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
