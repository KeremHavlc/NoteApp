import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftMenu from "../components/LeftMenu";
import {
  Button,
  ConfigProvider,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd";

const PublicNotePage = () => {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("authToken");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updatingNote, setUpdatingNote] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    title: "",
    description: "",
    priority: "",
  });

  const handleRowClick = (note) => {
    setSelectedNote(note);
  };

  const handleModalClose = () => {
    setSelectedNote(null);
  };

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

  // Notları almak için API'den veri çek
  const fetchNotes = async () => {
    if (!userId) {
      message.error("Kullanıcı bulunamadı!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/notes/public-notes?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Notlar alınamadı!");
      }
      const data = await response.json();
      // "open" durumunda olan notları filtreleyin
      const openNotes = data.filter((note) => note.status === "open");
      setNotes(openNotes); // Filtrelenmiş notları duruma kaydet
    } catch (error) {
      message.error("Notlar yüklenirken bir hata oluştu!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  // Not silme işlemi
  const deleteNotes = async (noteId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/notes/delete-note/${noteId}`,
        {
          method: "DELETE",
          body: JSON.stringify({ noteId: noteId }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );

      if (!response.ok) {
        throw new Error("Not silinemedi.");
      }

      message.success("Not başarıyla silindi.");

      // Silinen notu mevcut not listesinden çıkart
      const updatedNotes = notes.filter((note) => note._id !== noteId);
      setNotes(updatedNotes); // Tablodaki notları güncelle
    } catch (error) {
      message.error("Bir hata oluştu, tekrar deneyiniz!");
      console.error(error);
    }
  };

  // Güncelleme modalını açma ve formu doldurma
  const handleUpdateClick = (note) => {
    setIsUpdateModalVisible(true);
    setUpdatingNote(note);
    setUpdateForm({
      title: note.title,
      description: note.description,
      priority: note.priority,
    });
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/notes/update-note/${updatingNote._id}`,
        {
          method: "PUT",
          body: JSON.stringify(updateForm),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
      if (!response.ok) {
        throw new Error("Not güncellenemedi!");
      }

      const data = await response.json();
      message.success(data.message);

      // Güncellenen notu notlar listesinde bul ve değiştir
      const updatedNotes = notes.map((note) =>
        note._id === updatingNote._id ? { ...note, ...updateForm } : note
      );
      setNotes(updatedNotes);
      setIsUpdateModalVisible(false);
    } catch (error) {
      message.error("Not güncellenirken bir hata oluştu!");
      console.error(error);
    }
  };

  // Tablo için kolon tanımları
  const columns = [
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Yazar",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Not",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span
          onClick={() => handleRowClick(text)}
          className="cursor-pointer text-red-500"
        >
          {text.length > 50 ? `${text.substring(0, 20)}...` : text}
        </span>
      ),
    },
    {
      title: "Önem Seviyesi",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#ff0000",
              },
            }}
          >
            <div className="flex flex-row gap-10">
              <Button
                onClick={() => deleteNotes(record._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Sil
              </Button>
              <Button
                onClick={() => handleUpdateClick(record)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Güncelle
              </Button>
            </div>
          </ConfigProvider>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <LeftMenu />
        <div className="flex-1 p-4 bg-gray-200">
          <h1 className="text-4xl font-bold flex items-center justify-center font-havlucu">
            Açık Notlar
          </h1>
          <p className="flex items-center justify-center mt-4 font-havlucu text-gray-600">
            Burada açık notlarınızı görebilirsiniz.
          </p>
          <div className="mt-8">
            <Table dataSource={notes} columns={columns} rowKey="id" />
            <Modal
              width={900}
              visible={!!selectedNote}
              onCancel={handleModalClose}
              footer={null}
            >
              <h2 className="flex justify-center items-center rounded-xl border-4 border-red-500 bg-red -50 p-4 text-4xl font-bold font-havlucu select-none shadow-md">
                Ayrıntılı Not
              </h2>
              <p className="text-xl mt-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                {selectedNote}
              </p>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ff0000",
                    fontFamily: "havlucu",
                  },
                }}
              >
                <Button onClick={handleModalClose} className="mt-8">
                  Kapat
                </Button>
              </ConfigProvider>
            </Modal>

            {/* Güncelleme Modalı */}
            <Modal
              title="Notu Güncelle"
              visible={isUpdateModalVisible}
              onCancel={() => setIsUpdateModalVisible(false)}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => setIsUpdateModalVisible(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  İptal
                </Button>,
                <Button
                  key="submit"
                  onClick={handleUpdateSubmit}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Güncelle
                </Button>,
              ]}
            >
              <label>Başlık</label>
              <input
                name="title"
                value={updateForm.title}
                onChange={handleUpdateFormChange}
                className="w-full p-2 mb-4 border"
              />

              <label>Not</label>
              <textarea
                name="description"
                value={updateForm.description}
                onChange={handleUpdateFormChange}
                className="w-full p-2 mb-4 border"
              />

              <label>Önem Seviyesi</label>
              <Select
                value={updateForm.priority}
                onChange={(value) =>
                  setUpdateForm((prev) => ({ ...prev, priority: value }))
                }
                className="w-full mb-4"
              >
                <Select.Option value="low">Düşük</Select.Option>
                <Select.Option value="medium">Orta</Select.Option>
                <Select.Option value="high">Yüksek</Select.Option>
              </Select>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNotePage;
