import {
  MailOutlined,
  CalendarOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Menu } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LeftMenu = () => {
  const [openKeys, setOpenKeys] = useState(["1"]);
  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Ana Sayfa 🏠",
      onClick: () => navigate("/"),
    },
    {
      key: "2",
      icon: <MailOutlined />,
      label: "Notlarım 📝",
      children: [
        {
          key: "21",
          label: "--Gizli Notlar 🔒",
          onClick: () => navigate("/key"),
        },
        {
          key: "22",
          label: "--Açık Notlar 📖",
          onClick: () => navigate("/publicnote"),
        },
        {
          key: "23",
          label: "--Not Ekle ➕",
          onClick: () => navigate("/addnote"),
        },
      ],
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: "Takvim 📅",
      onClick: () => navigate("/calendar"),
    },
    {
      key: "4",
      icon: <SettingOutlined />,
      label: "Ayarlar ⚙️",
      children: [
        {
          key: "31",
          label: "--Profil Bilgileri 👤",
          onClick: () => navigate("/profile"),
        },
      ],
    },
  ];

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff0000",
          fontFamily: "kerem",
        },
      }}
    >
      <div className="flex">
        <div className="border-r w-50 h-screen p-4 bg-gray-100">
          <Menu
            mode="inline"
            defaultSelectedKeys={["11"]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{ width: 256 }}
            items={items}
            className="select-none rounded-2xl "
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LeftMenu;
