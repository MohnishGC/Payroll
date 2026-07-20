import React from 'react';
import { GreetingBanner } from '../components/GreetingBanner';
import { StatCard } from '../components/StatCard';
import { AttendanceChart } from '../components/AttendanceChart';
import { TaskBoard } from '../components/TaskBoard';
import { useDashboardData } from '../hooks/useDashboardData';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { stats, attendance, taskColumns, viewMode, setViewMode, handleAddTask } =
    useDashboardData();

  return (
    <div className="dashboard-page">
      {/* Greeting Banner */}
      <GreetingBanner />

      {/* Stat Cards Grid (4 Cards) */}
      <section className="dashboard-page__stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            deltaPercent={stat.deltaPercent}
            deltaDirection={stat.deltaDirection}
            deltaLabel={stat.deltaLabel}
            onDetailsClick={() => console.log(`Details clicked for ${stat.title}`)}
          />
        ))}
      </section>

      {/* Attendance Chart Section */}
      <section className="dashboard-page__section">
        <AttendanceChart
          totalEmployees={attendance.totalEmployees}
          onTimeEmployees={attendance.onTimeEmployees}
          monthlyData={attendance.monthlyData}
        />
      </section>

      {/* Task Management Board */}
      <section className="dashboard-page__section">
        <TaskBoard
          columns={taskColumns}
          viewMode={viewMode}
          onViewChange={setViewMode}
          onAddTask={handleAddTask}
        />
      </section>
    </div>
  );
};

export default DashboardPage;
