import React from "react";
import { LoginOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, ConfigProvider, Flex, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authToken from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessKey");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <>
      <div className="border-b bg-gray-100">
        <header className="flex items-center justify-between py-4 px-10 gap-10 select-none">
          <div className="text-2xl font-bold">
            <Link
              to={"/"}
              className="text-red-500 text-[36px] transition-colors duration-300 hover:text-red-700 font-kerem"
            >
              LOGO
            </Link>
          </div>
          <div>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#ff0000",
                  fontFamily: "kerem",
                },
              }}
            >
              <Flex gap={12} className="focus:outline-none ">
                <Input
                  placeholder="Not Ara..."
                  variant="filled"
                  className="w-[48rem] h-12 flex justify-center rounded-full focus:outline-none hover:text-[#000000] transition-all placeholder:font-kerem"
                  prefix={<SearchOutlined className="" />}
                  style={{ outline: "none" }}
                />
              </Flex>
            </ConfigProvider>
          </div>
          <div className="flex gap-10 items-center">
            <div className="flex flex-col items-center">
              <Avatar
                size={48}
                icon={<UserOutlined />}
                className="bg-red-500 transition-colors duration-300 hover:bg-red-700"
                onClick={() => navigate("/profile")}
              />
              <span className="text-sm mt-1 font-kerem">Profil</span>
            </div>
            <div className="flex flex-col items-center">
              <LoginOutlined
                className="text-[48px] text-red-500 transition-colors duration-300 hover:text-red-700"
                onClick={handleLogout}
              />
              <span className="text-sm mt-1 font-kerem">Çıkış</span>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
