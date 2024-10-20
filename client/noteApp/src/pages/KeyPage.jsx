import { LoginOutlined } from "@ant-design/icons";
import { Button, Card, ConfigProvider, Input, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const KeyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getUserIdFromToken = (token) => {
    if (!token) console.log("Token Bulunamadı!");
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

  useEffect(() => {
    const getUserInfo = async () => {
      if (!userId) {
        console.error("UserId Bulunamadı!");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/api/profile/profileId/${userId}`
        );
        if (!response.ok) {
          throw new Error("Veriler Alınamadı!");
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Kullanıcı Bilgileri Alınamadı!", error);
      }
    };
    getUserInfo();
  }, [userId]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      message.error("Lütfen Şifrenizi Giriniz!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/profile/verify-password",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            password: password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("Şifre Doğru, yönlendiriliyorsunuz...");
        localStorage.setItem("accessKey", true);
        navigate("/privatenote");
      } else {
        message.error(data.message || "Şifre Hatalı!");
      }
    } catch (error) {
      console.error("Şifre Kontrolü Başarısız!");
      message.error("Sunucu Hatası!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="border-b bg-gray-100 shadow-md select-none">
        <header className="flex items-center justify-between py-4 px-10 gap-10 select-none">
          <div className="text-2xl font-bold">
            <Link
              to={"/"}
              className="text-red-500 text-[36px] transition-colors duration-300 hover:text-red-700 font-kerem"
            >
              LOGO
            </Link>
          </div>
          <div className="flex flex-row">
            <h1 className="text-4xl font-kerem uppercase text-red-500">
              Hoşgeldiniz {userInfo?.name}
            </h1>
          </div>
          <div className="flex gap-10 items-center">
            <div className="flex flex-col items-center">
              <LoginOutlined className="text-[48px] text-red-500 transition-colors duration-300 hover:text-red-700" />
              <span className="text-sm mt-1 font-kerem">Çıkış</span>
            </div>
          </div>
        </header>
      </div>
      <div className="flex items-center justify-center mt-20 select-none">
        <Space direction="vertical" size={16}>
          <Card
            title={
              <h2 className="text-2xl font-bold font-havlucu text-gray-800">
                Gizli Not Şifre Ekranı
              </h2>
            }
            extra={
              <a
                href="#"
                className="font-havlucu text-red-500 hover:text-red-700 transition duration-300"
              >
                Daha Fazla...
              </a>
            }
            style={{ width: 800, height: 400 }}
            className="shadow-lg border border-gray-200 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
          >
            <p className="text-lg font-havlucu text-gray-700">
              Gizli Notları görüntülemek için hesap parolanızı girmeniz
              gerekmektedir!
            </p>
            <div className="flex justify-between mt-16 items-center">
              <ConfigProvider
                theme={{
                  token: { colorPrimary: "#ff0000", fontFamily: "havlucu" },
                }}
              >
                <Input.Password
                  placeholder="Parolanızı girin"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-80 p-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500 transition duration-300"
                />
                <Button
                  onClick={handlePasswordSubmit}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-300 ml-4 w-60 h-10"
                  loading={loading}
                >
                  Onayla
                </Button>
              </ConfigProvider>
            </div>
          </Card>
        </Space>
      </div>
    </>
  );
};

export default KeyPage;
