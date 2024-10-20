import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftMenu from "../components/LeftMenu";
import { Badge, Calendar, ConfigProvider, message } from "antd";
import moment from "moment";

const CalendarPages = () => {
  const [notes, setNotes] = useState([]);

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
      const openNotes = data
        .filter((note) => note.status === "open")
        .map((note) => ({
          ...note,
          createdAt: moment(note.createdAt).format("YYYY-MM-DD"),
        }));
      setNotes(openNotes);
    } catch (error) {
      message.error("Notlar yüklenirken bir hata oluştu!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const getListData = (value) => {
    const date = value.format("YYYY-MM-DD"); // Hücre tarihini string olarak formatla
    const filteredNotes = notes.filter((note) => note.createdAt === date); // Doğru gün için filtrele
    return filteredNotes.map((note) => {
      let badgeType;
      switch (note.priority) {
        case "low":
          badgeType = "success"; // yeşil
          break;
        case "medium":
          badgeType = "warning"; // sarı
          break;
        case "high":
          badgeType = "error"; // kırmızı
          break;
        default:
          badgeType = "default"; // varsayılan
      }
      return {
        type: badgeType,
        content: note.title, // Notun başlığını göster
      };
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.length > 0 ? (
          listData.map((item) => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))
        ) : (
          <li>
            <Badge status="default" text="Not yok" />
          </li>
        )}
      </ul>
    );
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1">
          <LeftMenu />
          <div className="flex-1 p-4 bg-gray-200">
            <h1 className="text-4xl font-havlucu flex items-center justify-center">
              Takvim
            </h1>
            <p className="flex items-center font-havlucu justify-center mt-4 text-gray-600">
              Takvim sayfasını görüntülemektesiniz!
            </p>
            <div className="flex justify-center items-center mt-12">
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ff0000",
                  },
                }}
              >
                <Calendar
                  className="w-[80rem] h-[50rem] rounded-xl shadow-xl"
                  dateCellRender={dateCellRender}
                />
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPages;
