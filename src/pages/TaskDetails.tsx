import { useParams } from 'react-router-dom';

export default function TaskDetails() {
  const { taskId } = useParams();
  // TODO: Fetch task details, progress, comments, etc.
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Task Details (ID: {taskId})</h1>
    </div>
  );
}
