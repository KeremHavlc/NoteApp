import React, { useState } from "react";
import Header from "./Header";
import LeftMenu from "./LeftMenu";
import { Input, Select, Button, message, ConfigProvider } from "antd";

const { TextArea } = Input;

const AddNote = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("open"); // Durum için yeni state
  const token = localStorage.getItem("authToken");

  const getUserIdFromToken = (token) => {
    if (!token) {
      console.log("Token Bulunamadı!");
      return null;
    }
    try {
      const payload = atob(token.split(".")[1]);
      const decoded = JSON.parse(payload);
      return decoded.userId;
    } catch (error) {
      console.error("Token decode edilemedi!", error);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

  const handleAddNote = async () => {
    if (!title || !author || !description || !priority) {
      message.error("Lütfen tüm alanları doldurun!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/notes/add-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token'ı header'da gönderiyoruz
        },
        body: JSON.stringify({
          userId, // Kullanıcı kimliğini ekliyoruz
          title,
          author,
          description,
          priority,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Bir hata oluştu");
      }

      message.success("Not başarıyla eklendi!");

      // Formu temizle
      setTitle("");
      setAuthor("");
      setDescription("");
      setPriority("");
    } catch (error) {
      message.error("Bir Hata Oluştu!");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <LeftMenu />
        <div className="flex-1 p-4 bg-gray-200">
          <h1 className="flex items-center justify-center text-4xl font-bold font-havlucu">
            Not Ekleme Sayfası
          </h1>
          <p className="flex items-center justify-center mt-4 font-havlucu text-gray-600">
            Bu sayfadan Notlarını Ekleyebilirsiniz ...
          </p>
          <div className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Yeni Not Oluştur</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Başlık</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Not başlığını girin"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Yazar</label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Yazar ismini girin"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Not</label>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Notunuzu girin"
                />
              </div>
              <div className="flex flex-row justify-around">
                <div className="mb-4">
                  <label className="block text-gray-700">Önem Seviyesi</label>
                  <Select
                    value={priority}
                    defaultValue={"düşük"}
                    onChange={(value) => setPriority(value)}
                    placeholder="Önem seviyesini seçin"
                  >
                    <Select.Option value="low">Düşük</Select.Option>
                    <Select.Option value="medium">Orta</Select.Option>
                    <Select.Option value="high">Yüksek</Select.Option>
                  </Select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Gizlilik</label>
                  <Select
                    value={status}
                    defaultValue={"açık"}
                    onChange={(value) => setStatus(value)}
                    placeholder="Gizlilik seçin"
                  >
                    <Select.Option value="open">Açık</Select.Option>
                    <Select.Option value="closed">Kapalı</Select.Option>
                  </Select>
                </div>
              </div>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ff0000",
                    fontFamily: "havlucu",
                  },
                }}
              >
                <Button
                  type="primary"
                  onClick={handleAddNote}
                  className="w-full bg-red-500 hover:bg-red-700"
                >
                  Notu Ekle
                </Button>
              </ConfigProvider>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNote;
