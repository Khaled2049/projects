import React from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  MoneyCollectOutlined,
  BulbOutlined,
  FundOutlined,
} from '@ant-design/icons';

const Navbar = () => {
  return (
    <div className="nav-container">
      <div className="logo-container">
        {/* <Avatar src="#" size="large" /> */}
        <Typography.Title level={2} className="logo">
          <Link to="/">CryptoStats</Link>
        </Typography.Title>
        {/* <Button className='menu-control-container'></Button> */}
      </div>
      <Menu theme="dark">
        <Menu.Item icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item icon={<FundOutlined />}>
          <Link to="/crypto">Crypto</Link>
        </Menu.Item>
        <Menu.Item icon={<MoneyCollectOutlined />}>
          <Link to="/exchanges">Exchanges</Link>
        </Menu.Item>
        <Menu.Item icon={<HomeOutlined />}>
          <Link to="/news">News</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Navbar;
