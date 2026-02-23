import SwiftUI
import SwiftData
import Charts

struct ProgressChartView: View {
    @Query(sort: \WorkoutSession.date, order: .forward) var sessions: [WorkoutSession]
    
    // We want to show the last 28 days of data
    var chartData: [RecoveryLogic.DailyLoad] {
        RecoveryLogic.generateChartData(sessions: sessions, days: 28)
    }
    
    var body: some View {
        Chart {
            ForEach(chartData) { data in
                // Acute Load Bar (7-Day Sum)
                BarMark(
                    x: .value("Date", data.date, unit: .day),
                    y: .value("Acute Load (7-Day)", data.acuteLoad)
                )
                .foregroundStyle(Color.blue.gradient)
                .cornerRadius(5)
                
                // Chronic Load Line (Weekly Capacity)
                LineMark(
                    x: .value("Date", data.date, unit: .day),
                    y: .value("Chronic Capacity", data.chronicLoad)
                )
                .foregroundStyle(Color.green)
                .lineStyle(StrokeStyle(lineWidth: 3, dash: [5, 5]))
                .interpolationMethod(.catmullRom)
            }
        }
        .chartXAxis {
            AxisMarks(values: .stride(by: .day, count: 7)) { value in
                AxisGridLine()
                AxisTick()
                AxisValueLabel(format: .dateTime.month().day())
            }
        }
    }
}


