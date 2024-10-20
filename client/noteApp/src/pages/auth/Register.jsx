import { Button, ConfigProvider, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      const res = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      if (res.status === 201) {
        message.success("Kayıt İşlemi Başarılı!");
        navigate("/login");
        setLoading(false);
      } else {
        message.error("Kayıt işlemi başarısız. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.log(error);
      message.error("Bir şeyler Yanlış Gitti");
    }
  };

  return (
    <>
      <div className="flex h-screen select-none bg-gray-200">
        <div className="absolute top-8 left-8 text-6xl font-kerem text-red-500">
          <span>LOGO</span>
        </div>
        <div className="w-2/3 border-r p-4 flex justify-center items-center bg-gray-200">
          <div className="flex flex-col justify-center items-center">
            <h1 className="flex justify-center items-center mb-10 text-8xl font-kerem">
              Kayıt Olun
            </h1>

            <div className="rounded-2xl shadow-2xl w-[60rem] p-8 bg-gray-100 transition-all transform hover:scale-105 hover:shadow-xl flex">
              {/* Sol form kısmı */}
              <div className="w-1/2 border-r-2 flex items-center justify-center h-full">
                <Form
                  onFinish={onFinish}
                  form={form}
                  layout="vertical"
                  name="registerFormLeft" 
                  className="flex flex-col"
                >
                  <Form.Item
                    name="name"
                    label="Ad"
                    rules={[
                      { required: true, message: "Lütfen Adınızı Giriniz!" },
                    ]}
                    className="flex justify-between"
                  >
                    <Input
                      placeholder="Ad"
                      className="w-80  rounded-full h-10"
                    />
                  </Form.Item>

                  <Form.Item
                    name="surname"
                    label="Soyad"
                    rules={[
                      { required: true, message: "Lütfen Soyadınızı Giriniz!" },
                    ]}
                    className="flex justify-between"
                  >
                    <Input
                      placeholder="Soyad"
                      className="w-80  rounded-full h-10"
                    />
                  </Form.Item>

                  <Form.Item
                    name="username"
                    label="Kullanıcı Adı"
                    rules={[
                      {
                        required: true,
                        message: "Lütfen Kullanıcı Adı Giriniz!",
                      },
                    ]}
                    className="flex justify-between"
                  >
                    <Input
                      placeholder="Kullanıcı Adı"
                      className="w-80  rounded-full h-10"
                    />
                  </Form.Item>
                </Form>
              </div>

              {/* Sağ form kısmı */}
              <div className="w-1/2 flex items-center justify-center h-full">
                <Form
                  onFinish={onFinish}
                  form={form}
                  layout="vertical"
                  name="registerFormRight" 
                  className="flex flex-col"
                >
                  <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                      { required: true, message: "Lütfen E-Mail Giriniz!" },
                    ]}
                    className="flex justify-between"
                  >
                    <Input
                      placeholder="E-Mail"
                      className="w-80  rounded-full h-10"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Şifre"
                    rules={[
                      {
                        required: true,
                        message: "Lütfen Şifrenizi Belirleyiniz!",
                      },
                    ]}
                    className="flex justify-between"
                  >
                    <Input.Password
                      placeholder="Şifre"
                      className="w-80  rounded-full h-10"
                    />
                  </Form.Item>

                  <Form.Item
                    name="passwordAgain"
                    label="Şifre Tekrar"
                    rules={[
                      {
                        required: true,
                        message: "Lütfen Şifrenizi Tekrar Giriniz!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Şifreler Aynı Olmak Zorunda!")
                          );
                        },
                      }),
                    ]}
                    className="flex justify-between"
                  >
                    <Input.Password
                      placeholder="Şifre Tekrar"
                      className="w-80  rounded-full h-10"
                    />
                  </Form.Item>

                  <Form.Item className="flex justify-center mt-4">
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#ff0000",
                        },
                      }}
                    >
                      <Button
                        type="primary"
                        className="w-80 h-10 font-kerem text-4xl rounded-full"
                        htmlType="submit"
                        loading={loading}
                      >
                        Kayıt Ol
                      </Button>
                    </ConfigProvider>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/3 p-6 flex justify-center items-center bg-red-500 rounded-3xl shadow-xl mr-20 h-[40rem] mt-40 transition-all transform hover:scale-105 hover:shadow-xl">
          <div>
            <h1 className="text-6xl font-kerem text-white">Başlayalım!</h1>
            <h1 className="mt-6 text-3xl font-kerem text-white">
              Zaten Üye Misiniz ?
            </h1>
            <h2 className="mt-2 text-2xl font-kerem text-white">
              Giriş yaparak notlarınızı düzenli ve erişilebilir tutun!
            </h2>
            <div className="mt-8 flex items-center justify-center">
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ff0000",
                  },
                }}
              >
                <Button
                  className="font-kerem text-4xl w-[28rem] h-20 rounded-full py-2 px-6 mt-10"
                  onClick={() => navigate("/login")}
                >
                  Giriş Yap !
                </Button>
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
