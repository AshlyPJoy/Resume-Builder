const mongoose=require("mongoose");
const ResumeSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title: {
    type: String,
    default: "Untitled Resume"
},
    name:{
        type:String
    },
    email:{
        type:String  
    },
    phone:{
        type:String
    },
    location:{
      type:String
    },
    portfolio:{
        type:String
    },
    linkedin:{
        type:String
    },
    summary:{
        type:String
    },
    skills: {
    type: [String]
},
    experience:[{
        title: { type: String },
        company: { type: String },
        location: { type: String },
        startDate: { type: String },
        endDate: { type: String }
    }],
     education:[{
        degree: { type: String },
        university: { type: String },
        location: { type: String },
        yearofpassing: { type: String }
    }],
     projects:[{
        title: { type: String },
        description: { type: String },
        technologies: { type: [String] },
        description: { type: String } 
    }],
    template:{
        type:String
    }
}, { timestamps: true });

module.exports = mongoose.model("Resume", ResumeSchema);