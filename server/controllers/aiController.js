const { clerkClient } = require('@clerk/express');
const OpenAI = require('openai');
const cloudinary = require('cloudinary').v2;
const sql = require('../configs/db');
const { default: axios } = require('axios');
const pdf = require("pdf-parse")
const fs = require("fs");
const AI = new OpenAI({
  apiKey: process.env.GEMENI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ FIXED: function call
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue."
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,        // ✅ FIXED typo
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    // ✅ FIXED: SQL syntax
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({
      success: true,
      content
    });

  } catch (error) {
    console.log("Gemini API Error:", error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};


const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ FIXED: function call
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue."
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,        // ✅ FIXED typo
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    // ✅ FIXED: SQL syntax
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({
      success: true,
      content
    });

  } catch (error) {
    console.log("Gemini API Error:", error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ FIXED: function call
    const { prompt,publish } = req.body;
    const plan = req.plan;
    

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "This feature is only available for primium subscriptions"
      });
    }
    const formData = new FormData()
    formData.append("prompt",prompt)

    const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1",formData,{
        headers:{"x-api-key":process.env.CLIPDROP_API_KEY},
        responseType:"arraybuffer"
    })
    const base64Image = `data:image/png;base64,${Buffer.from(data,"binary").toString("base64")}`
   const {secure_url} = await cloudinary.uploader.upload(base64Image)
   
    // ✅ FIXED: SQL syntax
    await sql`INSERT INTO creations (user_id, prompt, content, type,publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image',${publish?? false})`;

   

    res.json({
      success: true,
      content:secure_url
    });

  } catch (error) {
    
    res.json({
      success: false,
      message: error.message
    });
  }
};

const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ FIXED: function call
    const image = req.file;
    const plan = req.plan;
    

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "This feature is only available for primium subscriptions"
      });
    }
   
   const {secure_url} = await cloudinary.uploader.upload(image.path,{
    transformation:[
        {
            effect:"background_removal",
            background_removal:"remove_the_background"
        }
    ]
   })

   
    // ✅ FIXED: SQL syntax
    await sql`
  INSERT INTO creations (user_id, prompt, content, type)
  VALUES (${userId}, ${'Remove background from image'}, ${secure_url}, 'image')
`;


   

    res.json({
      success: true,
      content:secure_url
    });

  } catch (error) {
    console.log(error.message)
    
    res.json({
      success: false,
      message: error.message
    });
  }
};

const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;
    const { object } = req.body; // ✅ FIXED: Get the object to remove

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions"
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image"
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({
      success: true,
      content: imageUrl
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};



const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const {image} = req.file;
    const plan = req.plan;
    

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "This feature is only available for primium subscriptions"
      });
    }
    if(resume.size > 5 * 1024 * 1024){
        return res.json({
            success:false,
            message:"Resume file size exceedes allowed size (5MB)"
        })
    }
    const dataBuffer = fs.readFileSync(resume.path)
    const pdfData = await pdf(dataBuffer)
    const prompt = `Review the following resume and provide constructive feedback on its strength,weakness and areas for improvement. Resume Content:\n\n${pdfData.text}`
   
     const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,        // ✅ FIXED typo
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    // ✅ FIXED: SQL syntax
 await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${'Review the uploaded resume'}, ${content}, 'resume-review')`;

   

    res.json({
      success: true,
      content
    });

  } catch (error) {
    console.log(error.message)
    
    res.json({
      success: false,
      message: error.message
    });
  }
};



module.exports = { generateArticle,generateBlogTitle,generateImage,removeImageBackground,removeImageObject,reviewResume };
