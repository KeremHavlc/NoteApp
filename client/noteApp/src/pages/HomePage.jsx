import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftMenu from "../components/LeftMenu";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("authToken");
  const getUserIdFromToken = (token) => {
    if (!token) console.log("Token Bulunamadı");
    try {
      const payload = atob(token.split(".")[1]);
      const decoded = JSON.parse(payload);
      return decoded.userId;
    } catch (error) {
      console.error("Token decode edilemedi:", error);
      return null;
    }
  };
  const userId = getUserIdFromToken(token);
  useEffect(() => {
    const getUser = async () => {
      if (!userId) {
        console.error("User ID bulunamadı!");
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:8000/api/profile/profileId/${userId}`
        );
        if (!res.ok) {
          throw new Error("Veriler Alınamadı!");
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <Header />

      <div className="flex">
        <LeftMenu />

        <main className="flex-1 p-8 bg-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 font-havlucu">
            Ana Sayfa
          </h1>
          {user ? (
            <h2 className="text-lg font-havlucu">
              Hoş Geldin{" "}
              <span className="text-red-600 font-bold text-xl uppercase">
                {user.name} !
              </span>
            </h2>
          ) : (
            <h2 className="text-xltext-red-600 font-havlucu">
              Kullanıcı Verileri Yükleniyor...
            </h2>
          )}
          <div className="mt-8 bg-white shadow-md rounded-lg p-6 font-havlucu transition-transform transform hover:scale-100 hover:shadow-xl duration-300">
            <h2 className="text-2xl font-havlucu text-gray-700">Hakkında</h2>
            <p className="mt-2 text-gray-600 font-havlucu">
              Bu uygulama, kullanıcıların gizli notları şifreleyerek saklamasına
              olanak tanır. Şifreli notlarınızı güvenli bir şekilde yönetebilir
              ve görüntüleyebilirsiniz.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;
