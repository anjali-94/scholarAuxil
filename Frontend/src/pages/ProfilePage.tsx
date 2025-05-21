import React from 'react';
import { Card, Typography, Avatar, Descriptions, Button } from 'antd';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  const user = getAuth().currentUser;
  const navigate = useNavigate();

  if (!user) return <div>Loading...</div>;

  const displayName = user.email ? user.email.split('@')[0] : 'N/A';

  return (
    <Card
      style={{ maxWidth: 600, margin: '40px auto', padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      <Button
        onClick={() => navigate(-1)} // navigate back
        style={{ marginBottom: 20 }}
      >
        ← Back
      </Button>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Avatar
          size={80}
          style={{ backgroundColor: '#2563eb', marginBottom: 10 }}
        >
          {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
        </Avatar>
        <Title level={3}>Your Profile</Title>
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Display Name">
          {displayName}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="UID">{user.uid}</Descriptions.Item>
        <Descriptions.Item label="Provider">
          {user.providerData[0]?.providerId || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};


export default ProfilePage;
