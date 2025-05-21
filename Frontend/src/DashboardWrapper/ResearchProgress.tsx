// import React from 'react';
// import { Checkbox } from 'antd';

// type Task = {
//   id: number;
//   text: string;
//   completed: boolean;
// };

// type ResearchProgressProps = {
//   tasks: Task[];
//   handleTaskToggle: (id: number) => void;
// };

// const ResearchProgress: React.FC<ResearchProgressProps> = ({ tasks, handleTaskToggle }) => {
//   return (
//     <section
//       style={{
//         marginBottom: 'clamp(32px, 6vw, 64px)',
//         background: '#f9fafb',
//         padding: 'clamp(16px, 4vw, 32px)',
//         borderRadius: '12px',
//         boxSizing: 'border-box',
//       }}
//     >
//       <h2
//         style={{
//           textAlign: 'center',
//           color: '#2563eb',
//           fontWeight: 700,
//           fontSize: 'clamp(20px, 5vw, 28px)',
//           marginBottom: 'clamp(16px, 4vw, 24px)',
//         }}
//       >
//         Research Paper Progress
//       </h2>
//       {tasks.map((task) => (
//         <div
//           key={task.id}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             marginBottom: 'clamp(12px, 3vw, 20px)',
//             flexWrap: 'nowrap',
//           }}
//         >
//           <Checkbox
//             checked={task.completed}
//             onChange={() => handleTaskToggle(task.id)}
//             style={{ transform: 'scale(1.4)', marginRight: '16px' }}
//           />
//           <span
//             style={{
//               fontSize: 'clamp(18px, 6vw, 20px)',
//               fontWeight: 600,
//               color: task.completed ? '#9ca3af' : '#1f2937',
//               textDecoration: task.completed ? 'line-through' : 'none',
//               wordBreak: 'break-word',
//             }}
//           >
//             {task.text}
//           </span>
//         </div>
//       ))}
//     </section>
//   );
// };

// export default ResearchProgress;














import React, { useState } from 'react';
import { Checkbox, Progress, Button, Input, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type ResearchProgressProps = {
  tasks: Task[];
  handleTaskToggle: (id: number) => void;
  handleAddTask?: (text: string) => void;
};

const ResearchProgress: React.FC<ResearchProgressProps> = ({
  tasks,
  handleTaskToggle,
  handleAddTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [newTaskText, setNewTaskText] = useState('');

  const filteredTasks = tasks.filter((task) =>
    filter === 'completed' ? task.completed :
    filter === 'pending' ? !task.completed :
    true
  );

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const percentComplete = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

  const addTask = () => {
    if (newTaskText.trim() && handleAddTask) {
      handleAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <section
      style={{
        marginBottom: 'clamp(32px, 6vw, 64px)',
        background: '#f0f4ff',
        padding: 'clamp(16px, 4vw, 32px)',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#1d4ed8',
          fontWeight: 800,
          fontSize: 'clamp(22px, 5vw, 30px)',
          marginBottom: 'clamp(16px, 4vw, 24px)',
        }}
      >
        Research Paper Progress
      </h2>

      <Progress
        percent={percentComplete}
        status="active"
        strokeColor="#4f46e5"
        style={{ marginBottom: 24 }}
      />

      <div style={{ marginBottom: 16 }}>
        <Radio.Group
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
          <Radio.Button value="pending">Pending</Radio.Button>
        </Radio.Group>
      </div>

      {filteredTasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 12,
            background: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: task.completed ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Checkbox
            checked={task.completed}
            onChange={() => handleTaskToggle(task.id)}
            style={{ transform: 'scale(1.3)', marginRight: '16px' }}
          />
          <span
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: task.completed ? '#9ca3af' : '#111827',
              textDecoration: task.completed ? 'line-through' : 'none',
              flexGrow: 1,
            }}
          >
            {task.text}
          </span>
        </div>
      ))}

      {handleAddTask && (
        <div style={{ marginTop: 24, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Input
            placeholder="Add new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onPressEnter={addTask}
            style={{ flexGrow: 1, minWidth: '200px' }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addTask}
          >
            Add
          </Button>
        </div>
      )}

      <div style={{ marginTop: 24, textAlign: 'center', color: '#6b7280' }}>
        <small>
          {completedCount} of {totalTasks} tasks completed
        </small>
      </div>
    </section>
  );
};

export default ResearchProgress;
