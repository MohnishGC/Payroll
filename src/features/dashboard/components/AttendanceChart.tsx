import React from 'react';
import { Icon } from '../../../components/icons/Icon';
import type { MonthlyAttendance } from '../mockData';
import './AttendanceChart.css';

export interface AttendanceChartProps {
  totalEmployees: number;
  onTimeEmployees: number;
  monthlyData: MonthlyAttendance[];
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  totalEmployees,
  onTimeEmployees,
  monthlyData,
}) => {
  return (
    <div className="attendance-chart">
      {/* Header Row */}
      <div className="attendance-chart__header">
        <div>
          <h2 className="attendance-chart__title">Attendance Report</h2>
          <p className="attendance-chart__subtitle">Monthly attendance & punctuality analysis</p>
        </div>

        {/* Headline Numbers */}
        <div className="attendance-chart__metrics">
          <div className="attendance-chart__metric-item">
            <span className="attendance-chart__metric-value">{totalEmployees.toLocaleString()}</span>
            <span className="attendance-chart__metric-label">
              <span className="attendance-chart__dot attendance-chart__dot--total" />
              Total Employ
            </span>
          </div>
          <div className="attendance-chart__metric-divider" />
          <div className="attendance-chart__metric-item">
            <span className="attendance-chart__metric-value attendance-chart__metric-value--primary">
              {onTimeEmployees.toLocaleString()}
            </span>
            <span className="attendance-chart__metric-label">
              <span className="attendance-chart__dot attendance-chart__dot--ontime" />
              On Time
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="attendance-chart__bars-container">
        <div className="attendance-chart__bars-grid">
          {monthlyData.map((item, idx) => {
            const onTimeHeight = `${item.onTime}%`;
            const opacity = 0.5 + (idx % 4) * 0.15; // Varying blue shade per bar

            return (
              <div key={item.month} className="attendance-chart__bar-column">
                <div className="attendance-chart__bar-track" title={`${item.month}: ${item.onTime}% on time`}>
                  <div
                    className="attendance-chart__bar-fill"
                    style={{
                      height: onTimeHeight,
                      backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                    }}
                  >
                    <span className="attendance-chart__bar-tooltip">{item.onTime}%</span>
                  </div>
                </div>
                <span className="attendance-chart__month-label">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="attendance-chart__footer">
        <span className="attendance-chart__legend-text">
          <Icon name="checkCircle" size={14} color="#10B981" />
          <span>Average punctuality rate is 95.4% across all departments this cycle.</span>
        </span>
      </div>
    </div>
  );
};
