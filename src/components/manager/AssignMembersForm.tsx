import React, { useEffect, useState } from 'react';
import { getUsers, assignTaskToUser } from '../../api/users';

interface AssignMembersFormProps {
  projectId: string;
  assignedIds: string[];
  onSave: (ids: string[]) => void;
}

const AssignMembersForm: React.FC<AssignMembersFormProps> = ({ projectId, assignedIds, onSave }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedIds));
  useEffect(() => {
    getUsers('ROLE_TEAM_MEMBER').then(setMembers);
  }, []);
  const handleToggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  return (
    <div>
      {members.map(m => (
        <div key={m.id} className="flex items-center mb-2">
          <input type="checkbox" checked={selected.has(m.id)} onChange={() => handleToggle(m.id)} />
          <span className="ml-2">{m.name} ({m.email})</span>
        </div>
      ))}
      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded" onClick={() => onSave(Array.from(selected))}>Save</button>
    </div>
  );
};

export default AssignMembersForm;
