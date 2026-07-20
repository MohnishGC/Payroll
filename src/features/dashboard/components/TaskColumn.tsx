import React from 'react';
import { Icon } from '../../../components/icons/Icon';
import type { TaskColumnData } from '../mockData';

export interface TaskColumnProps {
  column: TaskColumnData;
  onAddTask?: (columnId: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ column, onAddTask }) => {
  return (
    <div className="task-column">
      {/* Column Header */}
      <div className="task-column__header">
        <div className="task-column__title-group">
          <span
            className="task-column__status-dot"
            style={{ backgroundColor: column.statusColor }}
          />
          <h3 className="task-column__name">{column.name}</h3>
          <span className="task-column__count-badge">{column.tasks.length}</span>
        </div>
        <button
          type="button"
          className="task-column__menu-btn"
          aria-label={`Options for ${column.name}`}
        >
          <Icon name="moreVertical" size={16} />
        </button>
      </div>

      {/* Task Cards List */}
      <div className="task-column__list">
        {column.tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-card__tags">
              <span className="task-card__category">{task.category}</span>
              <span
                className={`task-card__priority task-card__priority--${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>
            </div>
            <h4 className="task-card__title">{task.title}</h4>
            <div className="task-card__footer">
              <span className="task-card__assignee">
                <Icon name="user" size={13} />
                <span>{task.assignee}</span>
              </span>
              <span className="task-card__due-date">
                <Icon name="calendar" size={13} />
                <span>{task.dueDate}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dashed Add Card Button */}
      <button
        type="button"
        className="task-column__add-btn"
        onClick={() => onAddTask && onAddTask(column.id)}
      >
        <Icon name="plus" size={16} />
        <span>Add Task Card</span>
      </button>
    </div>
  );
};
