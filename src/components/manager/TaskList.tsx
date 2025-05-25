import React from 'react';
import TaskCard from '../common/TaskCard';

interface TaskListProps {
  tasks: any[];
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onAssign: (task: any) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onAssign }) => (
  <div className="space-y-4">
    {tasks.map(task => (
      <div key={task.id} className="flex items-center gap-2">
        <TaskCard task={task} showActions={false} />
        <button className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={() => onEdit(task)}>Edit</button>
        <button className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600" onClick={() => onDelete(task.id)}>Delete</button>
        <button className="px-2 py-1 text-white bg-purple-500 rounded hover:bg-purple-600" onClick={() => onAssign(task)}>Assign</button>
      </div>
    ))}
  </div>
);

export default TaskList;
