import React from 'react';
import { Icon } from '../../../components/icons/Icon';
import { TaskColumn } from './TaskColumn';
import type { TaskColumnData } from '../mockData';
import type { DashboardViewMode } from '../hooks/useDashboardData';
import './TaskBoard.css';

export interface TaskBoardProps {
  columns: TaskColumnData[];
  viewMode: DashboardViewMode;
  onViewChange: (mode: DashboardViewMode) => void;
  onAddTask?: (columnId: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  columns,
  viewMode,
  onViewChange,
  onAddTask,
}) => {
  return (
    <div className="task-board">
      {/* Section Header & View Switcher Row */}
      <div className="task-board__header">
        <div className="task-board__title-group">
          <h2 className="task-board__title">Task Management</h2>
          <span className="task-board__info-icon" title="View & manage assigned team tasks">
            <Icon name="helpCircle" size={16} />
          </span>
        </div>

        {/* View Switcher Buttons */}
        <div className="task-board__view-switcher" role="group" aria-label="Task view mode">
          <button
            type="button"
            className={`task-board__view-btn ${viewMode === 'kanban' ? 'task-board__view-btn--active' : ''}`}
            onClick={() => onViewChange('kanban')}
          >
            <Icon name="layoutGrid" size={15} />
            <span>Kanban View</span>
          </button>
          <button
            type="button"
            className={`task-board__view-btn ${viewMode === 'table' ? 'task-board__view-btn--active' : ''}`}
            onClick={() => onViewChange('table')}
          >
            <Icon name="table" size={15} />
            <span>Table View</span>
          </button>
          <button
            type="button"
            className={`task-board__view-btn ${viewMode === 'list' ? 'task-board__view-btn--active' : ''}`}
            onClick={() => onViewChange('list')}
          >
            <Icon name="list" size={15} />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Main Board Area */}
      {viewMode === 'kanban' ? (
        <div className="task-board__columns-grid">
          {columns.map((column) => (
            <TaskColumn key={column.id} column={column} onAddTask={onAddTask} />
          ))}
        </div>
      ) : (
        /* Alternative Table / List View Preview */
        <div className="task-board__table-preview">
          <table className="task-board__table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Task Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {columns.flatMap((col) =>
                col.tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <span className="task-board__table-status" style={{ backgroundColor: col.statusColor }}>
                        {col.name}
                      </span>
                    </td>
                    <td className="task-board__table-title">{task.title}</td>
                    <td>{task.category}</td>
                    <td>
                      <span className={`task-card__priority task-card__priority--${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>{task.assignee}</td>
                    <td>{task.dueDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
