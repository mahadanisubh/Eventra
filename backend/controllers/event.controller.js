import Event from "../models/event.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import fs from "fs/promises";

export const createEvent = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "EventraImages",
      resource_type: "auto",
      quality: "auto:best",
      fetch_format: "auto",
    });
    const event = await Event.create({
      ...req.body,
      bannerImage: result.secure_url,
      createdBy: req.user._id,
      registeredUsers: [],
    });

    await fs.unlink(req.file.path);
    res.status(201).json({ message: "Event Created", event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Events fetched successfully",
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      events,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const filter = {
      createdBy: req.user._id,
    };

    if (req.query.category) {
      filter.category = req.query.category;
    }
    console.log("req.user:", req.user);
    const events = await Event.find(filter);

    res.status(200).json({
      message: "Your Events fetched",
      count: events.length,
      events,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    res.status(200).json({
      message: "Event Details",
      event: {
        _id: event._id,
        title: event.title,
        desc: event.desc,
        location: event.location,
        category: event.category,
        date: event.date,
        time: event.time,
        status: event.status,
        bannerImage: event.bannerImage,
        registeredUsers: (event.registeredUsers || []).map((r) =>
          r.user ? r.user.toString() : r.toString(),
        ),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    Object.assign(event, req.body);
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      event.bannerImage = result.secure_url;
    }
    await event.save();
    res.json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await event.deleteOne();
    res.json({ message: "Event deleted", event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const { eventId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const comment = await Comment.create({
      event: eventId,
      user: req.user._id,
      text,
      parentComment: parentComment || null,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCommentsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const allComments = await Comment.find({ event: eventId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const commentMap = {};
    allComments.forEach((comment) => {
      commentMap[comment._id] = {
        ...comment._doc,
        replies: [],
      };
    });

    const rootComments = [];

    allComments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });

    res.status(200).json({
      message: "Comments fetched",
      comments: rootComments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
