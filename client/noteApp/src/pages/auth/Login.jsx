import { Button, Form, Input, ConfigProvider, message } from "antd";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ImFacebook2 } from "react-icons/im";
import { GrLinkedin } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      const data = await res.json();
      // Eğer status 200 veya 201 ise giriş başarılı
      if (res.status === 200 || res.status === 201) {
        const token = data.token; // Backend'den dönen token
        localStorage.setItem("authToken", token); // Token'ı localStorage'a kaydet
        message.success("Giriş başarılı!");
        navigate("/"); // Kullanıcıyı başka bir sayfaya yönlendir
      } else {
        message.error("Kullanıcı adı veya şifre hatalı!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      message.error("Bir şeyler Yanlış Gitti!");
      setLoading(false);
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
              Giriş Yapın
            </h1>

            <div className="rounded-2xl shadow-2xl w-[60rem] p-8 bg-gray-100 transition-all transform hover:scale-105 hover:shadow-xl flex">
              <div className="w-1/2 border-r-2 flex items-center justify-center h-full">
                <Form
                  onFinish={onFinish}
                  form={form}
                  layout="vertical"
                  name="loginForm"
                  className="flex flex-col"
                >
                  <Form.Item
                    name="username"
                    label="Kullanıcı Adı"
                    rules={[
                      {
                        required: true,
                        message: "Lütfen Kullanıcı Adınızı Giriniz!",
                      },
                    ]}
                    className="flex justify-between"
                  >
                    <Input
                      placeholder="Kullanıcı Adı"
                      className="w-80  rounded-full h-10"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Şifre"
                    rules={[
                      { required: true, message: "Lütfen Şifrenizi Giriniz!" },
                    ]}
                    className="flex justify-between"
                  >
                    <Input.Password
                      placeholder="Şifre"
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
                        loading={loading}
                        className="w-80 h-10 font-kerem text-4xl  rounded-full"
                        htmlType="submit"
                      >
                        Giriş Yap
                      </Button>
                    </ConfigProvider>
                  </Form.Item>
                </Form>
              </div>

              <div className="w-1/2 border-l flex flex-col items-center justify-center h-full">
                <p className="mb-4 text-2xl font-kerem mt-12 ">
                  Diğer oturum açma seçenekleri
                </p>
                <div className="flex flex-col items-center">
                  <div className="flex gap-8 mb-4">
                    <ImFacebook2
                      className="text-6xl"
                      style={{ color: "#1878f3" }}
                    />
                    <FcGoogle className="text-6xl" />
                    <GrLinkedin
                      className="text-6xl"
                      style={{ color: "#0274b3" }}
                    />
                  </div>
                  <div className="border-b-4 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/3 p-6 flex justify-center items-center bg-red-500 rounded-3xl shadow-xl mr-20 h-[40rem] mt-40 transition-all transform hover:scale-105 hover:shadow-xl">
          <div>
            <h1 className="text-6xl font-kerem text-white">
              Oturum Açmaya Hazır Mısınız?
            </h1>
            <h1 className="mt-6 text-3xl font-kerem text-white">
              Kayıt olun ve notlarınızı istediğiniz her yerde düzenli tutmanın
              keyfini çıkarın.
            </h1>
            <h2 className="mt-2 text-2xl font-kerem text-white">
              Düşüncelerinizi bir araya getirin, önemli anları yakalayın!
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
                  onClick={() => navigate("/register")}
                >
                  Kayıt Ol!
                </Button>
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
