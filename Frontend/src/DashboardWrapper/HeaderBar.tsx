// // import React from 'react';
// // import { Layout, Button } from 'antd';
// // import { MenuOutlined } from '@ant-design/icons';

// // const { Header } = Layout;

// // type HeaderBarProps = {
// //   collapsed: boolean;
// //   setCollapsed: (val: boolean) => void;
// // };

// // const HeaderBar: React.FC<HeaderBarProps> = ({ collapsed, setCollapsed }) => {
// //   return (
// //     <Header
// //       style={{
// //         background: '#fff',
// //         padding: '0 16px',
// //         display: 'flex',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //       }}
// //     >
// //       <Button type="text" icon={<MenuOutlined />} onClick={() => setCollapsed(!collapsed)} />
// //     </Header>
// //   );
// // };

// // export default HeaderBar;



// import React, { useEffect, useState } from 'react';
// import { Layout, Button, Typography, Avatar } from 'antd';
// import { MenuOutlined, UserOutlined } from '@ant-design/icons';
// import moment from 'moment';

// const { Header } = Layout;
// const { Text } = Typography;

// type HeaderBarProps = {
//   collapsed: boolean;
//   setCollapsed: (val: boolean) => void;
// };

// const HeaderBar: React.FC<HeaderBarProps> = ({ collapsed, setCollapsed }) => {
//   const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'));

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(moment().format('HH:mm:ss'));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Header
//       style={{
//         background: '#fff',
//         padding: '0 16px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
//       }}
//     >
//       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//         <Button
//           type="text"
//           icon={<MenuOutlined />}
//           onClick={() => setCollapsed(!collapsed)}
//         />
//         <Text strong style={{ fontSize: '18px', color: '#2563eb' }}>
//           👋 Welcome Back, Researcher!
//         </Text>
//       </div>

//       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//         <Text type="secondary" style={{ fontSize: '16px' }}>
//           🕒 {currentTime}
//         </Text>
//         <Avatar icon={<UserOutlined />} />
//       </div>
//     </Header>
//   );
// };

// export default HeaderBar;


import React, { useEffect, useState } from 'react';
import {
  Layout,
  Button,
  Typography,
  Avatar,
  Dropdown,
  Menu,
  message,
} from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const { Header } = Layout;
const { Text } = Typography;

type HeaderBarProps = {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  logout: () => void;
};

const HeaderBar: React.FC<HeaderBarProps> = ({ collapsed, setCollapsed, logout }) => {
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'));
  const [userInitial, setUserInitial] = useState<string>('U'); // Default

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const nameOrEmail = user.displayName || user.email || 'User';
      setUserInitial(nameOrEmail.charAt(0).toUpperCase());
    }
  }, []);

  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        message.info('Opening your profile...');
        navigate('/profile');
        break;
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        View Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <Text strong style={{ fontSize: '18px', color: '#2563eb' }}>
          👋 Welcome Back, Researcher!
        </Text>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          🕒 {currentTime}
        </Text>
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Avatar
            style={{ cursor: 'pointer', backgroundColor: '#2563eb' }}
          >
            {userInitial}
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;
