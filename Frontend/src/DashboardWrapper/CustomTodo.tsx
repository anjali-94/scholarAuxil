// import React from 'react';
// import { Input, DatePicker, Button, Checkbox, message } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import moment from 'moment';

// type CustomTask = {
//   text: string;
//   date: string;
//   completed: boolean;
// };

// type CustomTodoProps = {
//   customTask: string;
//   setCustomTask: (val: string) => void;
//   customDate: moment.Moment | null;
//   setCustomDate: (date: moment.Moment | null) => void;
//   customTasks: CustomTask[];
//   setCustomTasks: (tasks: CustomTask[]) => void;
// };

// const CustomTodo: React.FC<CustomTodoProps> = ({
//   customTask,
//   setCustomTask,
//   customDate,
//   setCustomDate,
//   customTasks,
//   setCustomTasks,
// }) => {
//   const handleAddCustomTask = () => {
//     if (!customTask || !customDate) {
//       message.warning('Please fill in both task and deadline.');
//       return;
//     }
//     setCustomTasks([
//       ...customTasks,
//       { text: customTask, date: customDate.format('YYYY-MM-DD'), completed: false },
//     ]);
//     setCustomTask('');
//     setCustomDate(null);
//   };

//   const handleCustomTaskToggle = (index: number) => {
//     const updatedTasks = customTasks.map((task, idx) =>
//       idx === index ? { ...task, completed: !task.completed } : task
//     );
//     setCustomTasks(updatedTasks);
//   };

//   return (
//     <section style={{ background: '#f9fafb', padding: '32px', borderRadius: '12px' }}>
//       <h2
//         style={{
//           textAlign: 'center',
//           color: '#2563eb',
//           fontWeight: 700,
//           fontSize: '28px',
//           marginBottom: '24px',
//         }}
//       >
//         Add Your Own Tasks
//       </h2>
//       <Input
//         placeholder="Task description"
//         value={customTask}
//         onChange={(e) => setCustomTask(e.target.value)}
//         style={{
//           width: '100%',
//           marginBottom: '16px',
//           padding: '12px',
//           fontSize: '16px',
//           borderRadius: '8px',
//         }}
//       />
//       <DatePicker style={{ width: '100%', marginBottom: '20px' }} value={customDate} onChange={(date) => setCustomDate(date)} />
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         size="large"
//         block
//         style={{ marginTop: '16px', width: '100%' }}
//         onClick={handleAddCustomTask}
//       >
//         Add Task
//       </Button>
//       <div style={{ marginTop: '20px' }}>
//         {customTasks.map((task, idx) => (
//           <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//             <Checkbox
//               checked={task.completed}
//               onChange={() => handleCustomTaskToggle(idx)}
//               style={{ transform: 'scale(1.4)', marginRight: '16px' }}
//             />
//             <span
//               style={{
//                 fontSize: '18px',
//                 fontWeight: 600,
//                 color: task.completed ? '#9ca3af' : '#1f2937',
//                 textDecoration: task.completed ? 'line-through' : 'none',
//               }}
//             >
//               {task.text}
//               <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>
//                 [Deadline: {task.date}]
//               </span>
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default CustomTodo;






import React from 'react';
import {
  Input,
  DatePicker,
  Button,
  Checkbox,
  message,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SortAscendingOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './CustomTodo.css'; // Animation styles

type CustomTask = {
  text: string;
  date: string;
  completed: boolean;
};

type CustomTodoProps = {
  customTask: string;
  setCustomTask: (val: string) => void;
  customDate: moment.Moment | null;
  setCustomDate: (date: moment.Moment | null) => void;
  customTasks: CustomTask[];
  setCustomTasks: (tasks: CustomTask[]) => void;
};

const CustomTodo: React.FC<CustomTodoProps> = ({
  customTask,
  setCustomTask,
  customDate,
  setCustomDate,
  customTasks,
  setCustomTasks,
}) => {
  const handleAddCustomTask = () => {
    if (!customTask || !customDate) {
      message.warning('Please fill in both task and deadline.');
      return;
    }
    setCustomTasks([
      ...customTasks,
      {
        text: customTask,
        date: customDate.format('YYYY-MM-DD'),
        completed: false,
      },
    ]);
    setCustomTask('');
    setCustomDate(null);
  };

  const handleCustomTaskToggle = (index: number) => {
    const updatedTasks = customTasks.map((task, idx) =>
      idx === index ? { ...task, completed: !task.completed } : task
    );
    setCustomTasks(updatedTasks);
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = customTasks.filter((_, idx) => idx !== index);
    setCustomTasks(updatedTasks);
  };

  const handleClearCompleted = () => {
    const remainingTasks = customTasks.filter((task) => !task.completed);
    setCustomTasks(remainingTasks);
  };

  const handleSortByDate = () => {
    const sorted = [...customTasks].sort(
      (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    );
    setCustomTasks(sorted);
  };

  return (
    <section style={{ background: '#f9fafb', padding: '32px', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', color: '#2563eb', fontWeight: 700, fontSize: '28px', marginBottom: '24px' }}>
        Add Your Own Tasks
      </h2>

      <Input
        placeholder="Task description"
        value={customTask}
        onChange={(e) => setCustomTask(e.target.value)}
        style={{ width: '100%', marginBottom: '16px', padding: '12px', fontSize: '16px', borderRadius: '8px' }}
      />

      <DatePicker
        style={{ width: '100%', marginBottom: '20px' }}
        value={customDate}
        onChange={(date) => setCustomDate(date)}
      />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        block
        style={{ marginBottom: '16px' }}
        onClick={handleAddCustomTask}
      >
        Add Task
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button icon={<SortAscendingOutlined />} onClick={handleSortByDate}>
          Sort by Date
        </Button>
        <Popconfirm title="Clear all completed tasks?" onConfirm={handleClearCompleted}>
          <Button icon={<ClearOutlined />} danger>
            Clear Completed
          </Button>
        </Popconfirm>
      </div>

      <TransitionGroup component={null}>
        {customTasks.map((task, idx) => (
          <CSSTransition key={idx} timeout={300} classNames="fade">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Checkbox
                checked={task.completed}
                onChange={() => handleCustomTaskToggle(idx)}
                style={{ transform: 'scale(1.4)', marginRight: '16px' }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: task.completed ? '#9ca3af' : '#1f2937',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {task.text}
                <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>
                  [Deadline: {task.date}]
                </span>
              </span>
              <Tooltip title="Delete Task">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteTask(idx)}
                  style={{ marginLeft: '12px' }}
                />
              </Tooltip>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};

export default CustomTodo;
