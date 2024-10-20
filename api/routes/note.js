const Note = require("../models/Note");
const express = require("express");
const router = express.Router();

router.get("/public-notes", async (req, res) => {
  const { userId } = req.query; // userId'yi sorgu parametresinden al

  if (!userId) {
      return res.status(400).json({ message: "Kullanıcı ID'si sağlanmadı!" });
  }
  try {
      // Belirli bir kullanıcının notlarını al
      const notes = await Note.find({ userId: userId }); // userId ile notları filtrele
      res.status(200).json(notes);
  } catch (error) {
      res.status(500).json({ message: "Notlar alınırken bir hata oluştu!", error });
  }
});
router.get('/get-note/:userId', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error); // Hata konsola yazdırılır
    res.status(500).json({ message: 'Internal Server Error', error: error.message }); // Hata mesajı döner
  }
});

router.post("/add-note" , async(req,res)=>{
    try {
        const newNote = new Note(req.body)
        await newNote.save();
        res.status(200).json("Item added succesfully.");
    } catch (error) {
        res.status(500).json(error);
    }
});
router.delete("/delete-note/:noteId", async (req, res) => {
    try {
      const { noteId } = req.params;
      const note = await Note.findByIdAndDelete(noteId);
      if (!note) {
        return res.status(404).json({ message: "Note bulunamadı!" });
      }
      res.status(200).json({ message: "Item başarıyla silindi!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Sunucu hatası!" });
    }
});
router.put("/update-note/:noteId", async (req, res) => {
    try {
      const updatedNoteData = req.body;
      const updatedNote = await Note.findByIdAndUpdate({ _id: req.params.noteId },
        updatedNoteData, 
        { new: true } 
      );
      if (!updatedNote) {
        return res.status(404).json({ message: "Not Bulunamadı!" });
      }
      res.status(200).json({ message: "Not Başarıyla Güncellendi!", updatedNote });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Sunucu Hatası!" });
    }
});


module.exports = router