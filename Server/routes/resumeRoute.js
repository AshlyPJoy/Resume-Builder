 const {protect}=require("../middleware/authMiddleware");
 const express=require("express");
 const router=express.Router();
 const {createResume,getResumes,getResumeById,updateResume,deleteResume}=require("../controllers/resumeController.js");
const { exportResumePDF } = require("../controllers/exportController");

router.get("/:id/export", protect, exportResumePDF);
 router.post("/",protect,createResume);
  router.get("/getAll",protect,getResumes);
  router.get("/:id",protect,getResumeById);
  router.put("/:id",protect,updateResume);
  router.delete("/:id",protect,deleteResume);

  module.exports = router;