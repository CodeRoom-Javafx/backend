const Room = require("../models/Room");
const Assignment = require("../models/Assignment");
const { SuccessResponse, FailedResponse } = require("../utils/response");

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(new SuccessResponse(rooms));
  } catch (error) {
    res.status(500).json(new FailedResponse(error.message));
  }
};

// Get a room by ID
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json(new FailedResponse("Room not found"));
    }
    res.json(new SuccessResponse(room));
  } catch (error) {
    res.status(500).json(new FailedResponse(error.message));
  }
};

// Create a new room
const createRoom = async (req, res) => {
  const room = new Room({
    name: req.body.name,
    ownerId: req.body.ownerId,
  });

  try {
    const newRoom = await room.save();
    res.status(201).json(new SuccessResponse(newRoom));
  } catch (error) {
    res.status(400).json(new FailedResponse(error.message));
  }
};

// Update a room by ID
const updateRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json(new FailedResponse("Room not found"));
    }

    if (req.body.name != null) {
      room.name = req.body.name;
    }
    if (req.body.listOfAssignments != null) {
      room.listOfAssignments = req.body.listOfAssignments;
    }
    if (req.body.students != null) {
      room.students = req.body.students;
    }

    const updatedRoom = await room.save();
    res.json(new SuccessResponse(updatedRoom));
  } catch (error) {
    res.status(400).json(new FailedResponse(error.message));
  }
};

// Add an assignment to a room
const addAssignmentToRoom = async (req, res) => {
  const { id: roomId } = req.params;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json(new FailedResponse("Room not found"));
    }

    const newAssignment = new Assignment({
      problemStatement: req.body.problemStatement,
      roomId: roomId,
    });
    const savedAssignment = await newAssignment.save();

    const assignments = await Assignment.find({
      _id: { $in: room.listOfAssignments },
    });

    room.listOfAssignments.push(savedAssignment._id);
    room.noOfSubmissions += 1;
    const updatedRoom = await room.save();

    res.json(
      new SuccessResponse({ room: updatedRoom, assignments: assignments })
    );
  } catch (error) {
    res.status(400).json(new FailedResponse(error.message));
  }
};

// Remove an assignment from a room
const removeAssignmentFromRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json(new FailedResponse("Room not found"));
    }

    const assignmentToRemove = await Assignment.findById(req.body.assignmentId);
    if (!assignmentToRemove) {
      return res.status(404).json(new FailedResponse("Assignment not found"));
    }

    const index = room.listOfAssignments.indexOf(req.body.assignmentId);
    if (index > -1) {
      room.listOfAssignments.splice(index, 1);
      room.noOfSubmissions -= 1;
    }

    const updatedRoom = await room.save();

    const remainingAssignments = await Assignment.find({
      _id: { $in: room.listOfAssignments },
    });

    res.json(
      new SuccessResponse({
        room: updatedRoom,
        assignments: remainingAssignments,
      })
    );
  } catch (error) {
    res.status(400).json(new FailedResponse(error.message));
  }
};

// Update assignment
const updateAssignmentById = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const updatedFields = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json(new FailedResponse("Assignment not found"));
    }

    Object.keys(updatedFields).forEach((key) => {
      assignment[key] = updatedFields[key];
    });

    const updatedAssignment = await assignment.save();
    res.json(new SuccessResponse(updatedAssignment));
  } catch (error) {
    res.status(400).json(new FailedResponse(error.message));
  }
};

// Add a student to a room
const addStudentToRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json(new FailedResponse("Room not found"));
    }

    room.students.push(req.body.studentId);

    const updatedRoom = await room.save();
    res.json(new SuccessResponse(updatedRoom));
  } catch (error) {
    res.status(400).json(new FailedResponse(error.message));
  }
};

// Remove a student from a room
const removeStudentFromRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json(new FailedResponse("Room not found"));
    }

    const index = room.students.indexOf(req.body.studentId);
    if (index > -1) {
      room.students.splice(index, 1);
    }

    const updatedRoom = await room.save();
    res.json(new SuccessResponse(updatedRoom));
  } catch (error) {
    res.status(400).json(new FailedResponse(error.message));
  }
};

// Get rooms by list of room IDs
const getRoomsByListOfRoomIds = async (req, res) => {
  try {
    const roomIds = req.body.roomIds;
    const rooms = await Room.find({ _id: { $in: roomIds } });
    res.json(new SuccessResponse(rooms));
  } catch (error) {
    res.status(500).json(new FailedResponse(error.message));
  }
};

// Get list of CodeRooms by ownerId
const getCodeRoomsByOwnerId = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const rooms = await Room.find({ ownerId });
    const assignmentPromises = rooms.map((room) =>
      Assignment.find({ _id: { $in: room.listOfAssignments } })
    );
    const assignmentsArray = await Promise.all(assignmentPromises);
    const roomsWithAssignments = rooms.map((room, index) => ({
      ...room.toObject(),
      assignments: assignmentsArray[index],
    }));

    res.json(new SuccessResponse(roomsWithAssignments));
  } catch (error) {
    res.status(500).json(new FailedResponse(error.message));
  }
};

// Delete a room by ID
const deleteRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json(new FailedResponse("Room not found"));
    }

    await room.remove();
    res.json(new SuccessResponse("Room deleted successfully"));
  } catch (error) {
    res.status(500).json(new FailedResponse(error.message));
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoomById,
  addAssignmentToRoom,
  removeAssignmentFromRoom,
  addStudentToRoom,
  removeStudentFromRoom,
  getRoomsByListOfRoomIds,
  getCodeRoomsByOwnerId,
  deleteRoomById,
  updateAssignmentById,
};
