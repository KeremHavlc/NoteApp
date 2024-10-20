import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import LeftMenu from "../components/LeftMenu";
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  message,
  Modal,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";

const ProfileSettingsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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
    const fetchUserInfo = async () => {
      if (!userId) {
        console.error("User ID bulunamadı!");
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
    fetchUserInfo();
  }, [userId]);

  const deleteUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/profile/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
      if (!response.ok) {
        throw new Error("Silme işlemi başarısız oldu!");
      }
      message.success("Kullanıcı Başarıyla Silindi!");
      navigate("/login");
    } catch (error) {
      message.error("Bir Şeyler Yanlış Gitti!");
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/profile/update-user/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...values }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        }
      );
      if (!response.ok) {
        throw new Error("Güncelleme İşlemi Başarısız Oldu!");
      }
      message.success("Kullanıcı Başarıyla Güncellendi!");

      setOpenModal(false); // Modalı kapat
    } catch (error) {
      message.error("Bir Şeyler Yanlış Gitti!");
    }
  };

  const showModal = () => {
    if (userInfo) {
      form.setFieldsValue(userInfo);
      setOpenModal(true);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values); // onFinish'e form değerlerini gönderiyoruz
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <App>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 ">
          <LeftMenu />
          <div className="flex-1 p-6 bg-gray-200">
            <h1 className="text-4xl font-bold flex justify-center items-center font-havlucu mb-8">
              Profil Ayarları
            </h1>
            <p className="flex justify-center items-center mb-12 font-havlucu text-lg text-gray-600">
              Hesap bilgilerinizi görüntüleyin ve düzenleyin.
            </p>

            <div className="flex justify-center">
              <Space direction="vertical" size={16}>
                <Card
                  title={
                    <h2 className="text-2xl font-bold font-havlucu text-gray-800">
                      Profil
                    </h2>
                  }
                  style={{ width: 800, height: 450 }}
                  className="shadow-xl border border-gray-200 rounded-2xl transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 bg-white"
                >
                  <p className="text-lg font-havlucu text-gray-700 mb-8">
                    Hesap Bilgileriniz...
                  </p>

                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#1890ff",
                        fontFamily: "havlucu",
                      },
                    }}
                  >
                    {userInfo ? (
                      <div className="grid grid-cols-2 gap-8 font-havlucu">
                        <div>
                          <h3 className="text-xl underline text-gray-800">
                            İsim
                          </h3>
                          <p className="text-lg text-gray-600">
                            {userInfo.name}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl underline text-gray-800">
                            Soyisim
                          </h3>
                          <p className="text-lg text-gray-600">
                            {userInfo.surname}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl underline text-gray-800">
                            Kullanıcı Adı
                          </h3>
                          <p className="text-lg text-gray-600">
                            {userInfo.username}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl underline text-gray-800">
                            E-Mail
                          </h3>
                          <p className="text-lg text-gray-600">
                            {userInfo.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p>Yükleniyor...</p>
                    )}
                  </ConfigProvider>

                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#ff0000",
                      },
                    }}
                  >
                    <div className="mr-8 mb-8">
                      <div className="flex gap-4 justify-center mb-4 mt-8">
                        <Button
                          type="primary"
                          size="large"
                          className="font-bold"
                          onClick={() => deleteUser(userId)}
                        >
                          Kullanıcı Sil
                        </Button>
                        <Button
                          type="primary"
                          size="large"
                          className="font-bold"
                          onClick={showModal}
                        >
                          Düzenle
                        </Button>
                      </div>
                      <p className="font-havlucu flex justify-center text-red-500 text-end mr-20">
                        !!! Bu İşlem Geri Alınamaz !!!
                      </p>
                    </div>
                  </ConfigProvider>
                </Card>

                {/* Kullanıcı Düzenleme Modalı */}
                <Modal
                  title="Hesap Bilgileri Düzenleme"
                  open={openModal}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={[
                    <ConfigProvider
                      key="configProvider"
                      theme={{
                        token: {
                          colorPrimary: "#ff0000",
                        },
                      }}
                    >
                      <Button
                        key="cancelButton"
                        onClick={handleCancel}
                        className="hover:bg-gray-300 hover:text-black"
                      >
                        İptal
                      </Button>
                      <Button
                        key="submitButton"
                        type="primary"
                        onClick={handleOk}
                      >
                        Kaydet
                      </Button>
                    </ConfigProvider>,
                  ]}
                >
                  <Form form={form} layout="vertical" initialValues={userInfo}>
                    <Form.Item
                      name="name"
                      label="İsim"
                      rules={[{ required: true, message: "İsim zorunlu!" }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="surname"
                      label="Soyisim"
                      rules={[{ required: true, message: "Soyisim zorunlu!" }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="username"
                      label="Kullanıcı Adı"
                      rules={[
                        { required: true, message: "Kullanıcı adı zorunlu!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="E-Mail"
                      rules={[
                        { required: true, message: "E-mail zorunlu!" },
                        {
                          type: "email",
                          message: "Geçersiz e-mail formatı!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Form>
                </Modal>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </App>
  );
};

export default ProfileSettingsPage;
