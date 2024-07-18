const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.get("/getRoomsByOwnerId/:ownerId", roomController.getCodeRoomsByOwnerId); // New route

router.post("/", roomController.createRoom);
router.post("/getRoomsByListOfRoomIds", roomController.getRoomsByListOfRoomIds);

router.put("/:id", roomController.updateRoomById);
router.put("/:id/addAssignment", roomController.addAssignmentToRoom);
router.put("/:id/removeAssignment", roomController.removeAssignmentFromRoom);
router.put("/:id/updateAssignment/:assignmentId", roomController.updateAssignmentById); 

router.put("/:id/addStudent", roomController.addStudentToRoom);
router.put("/:id/removeStudent", roomController.removeStudentFromRoom);

router.delete("/:id", roomController.deleteRoomById);

module.exports = router;
