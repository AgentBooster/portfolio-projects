
import SwiftUI
import SwiftData

struct DashboardView: View {
    // Query sessions to calculate ACWR
    @Query(sort: \WorkoutSession.date, order: .reverse) var sessions: [WorkoutSession]
    
    // Computed ACWR
    var acwr: Double {
        RecoveryLogic.calculateACWR(sessions: sessions)
    }
    
    var status: RecoveryLogic.RecoveryStatus {
        RecoveryLogic.interpretACWR(acwr)
    }
    
    var body: some View {
        NavigationStack {
            VStack {
                if sessions.isEmpty {
                    EmptyStateView()
                } else {
                    let progress = RecoveryLogic.calibrationProgress(sessions: sessions)
                    
                    if !progress.isReady {
                        CalibrationView(progress: progress)
                    } else {
                        StandardDashboardContent(acwr: acwr, status: status, statusColor: statusColor, statusText: statusText, recommendationText: recommendationText)
                    }
                }
            }
            .navigationTitle("Kinetic Guard")
        }
    }
    
    // Helpers
    var statusColor: Color {
        switch status {
        case .optimal: return .green
        case .underTraining: return .blue
        case .overreaching: return .yellow
        case .highRisk: return .red
        }
    }
    
    var statusText: String {
        switch status {
        case .optimal: return "Optimal"
        case .underTraining: return "Detraining"
        case .overreaching: return "Overreaching"
        case .highRisk: return "High Risk"
        }
    }
    
    var recommendationText: String {
        switch status {
        case .optimal: return "You are in the sweet spot. Keep pushing within this range to maximize gains safely."
        case .underTraining: return "Load is lower than usual. You can safely increase intensity or volume this week."
        case .overreaching: return "Careful. Load is spiking. Consider a light session or active recovery tomorrow."
        case .highRisk: return "DANGER ZONE. Your acute load is too high compared to your conditioning. REDUCE LOAD IMMEDIATELY."
        }
    }
}

// Subview for Standard Content (Refactored for clarity)
struct StandardDashboardContent: View {
    let acwr: Double
    let status: RecoveryLogic.RecoveryStatus
    let statusColor: Color
    let statusText: String
    let recommendationText: String
    
    @State private var showingLoadInfo = false

    var body: some View {
        ScrollView { // Added ScrollView
            VStack(spacing: 30) {
                // Header
                Text("Recovery Status")
                    .font(.headline)
                    .foregroundStyle(.gray)
                    .padding(.top)
                
                // Traffic Light Circle
                ZStack {
                    Circle()
                        .stroke(lineWidth: 20)
                        .opacity(0.3)
                        .foregroundColor(statusColor)
                    
                    Circle()
                        .trim(from: 0.0, to: CGFloat(min(acwr / 2.0, 1.0))) // Max out circle at 2.0 ratio
                        .stroke(style: StrokeStyle(lineWidth: 20, lineCap: .round, lineJoin: .round))
                        .foregroundColor(statusColor)
                        .rotationEffect(Angle(degrees: 270.0))
                        .animation(.linear, value: acwr)
                    
                    VStack {
                        Text(String(format: "%.2f", acwr))
                            .font(.system(size: 60, weight: .bold, design: .rounded))
                            .foregroundStyle(.white)
                        Text(statusText.uppercased())
                            .font(.caption)
                            .fontWeight(.bold)
                            .padding(8)
                            .background(statusColor.opacity(0.2))
                            .cornerRadius(8)
                            .foregroundStyle(statusColor)
                    }
                }
                .frame(width: 250, height: 250)
                .shadow(color: statusColor.opacity(0.5), radius: 20, x: 0, y: 0)
                
                // Recommendation Card
                VStack(alignment: .leading, spacing: 10) {
                    Text("Recommendation")
                        .font(.headline)
                    
                    Text(recommendationText)
                        .font(.body)
                        .foregroundStyle(.secondary)
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.gray.opacity(0.2))
                .cornerRadius(12)
                .padding(.horizontal)
                
                // Chart Section
                VStack(alignment: .leading, spacing: 15) {
                    HStack {
                        Text("Load History (Last 28 Days)")
                            .font(.headline)
                        
                        Button(action: { showingLoadInfo = true }) {
                            Image(systemName: "info.circle")
                                .foregroundStyle(.secondary)
                        }
                    }
                    
                    ProgressChartView()
                        .frame(height: 250)
                        .padding()
                        .background(Color(UIColor.secondarySystemBackground))
                        .cornerRadius(12)
                }
                .padding(.horizontal)
                
                Spacer(minLength: 50) // Added extra padding at bottom
            }
            .padding(.bottom, 20) // Ensure content doesn't get cut off by tab bar
        }
        .sheet(isPresented: $showingLoadInfo) {
            VStack(spacing: 20) {
                Text("Understanding the Chart")
                    .font(.title2.bold())
                
                VStack(alignment: .leading, spacing: 15) {
                    HStack {
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color.blue)
                            .frame(width: 20, height: 20)
                        Text("Acute Load (7-Day Sum): Your total fatigue over the last week.")
                    }
                    
                    HStack {
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color.green)
                            .frame(width: 20, height: 4) // Line representation
                        Text("Chronic Capacity: Your average weekly load (Fitness).")
                    }
                    
                    Text("Goal: Keep your Acute Load (Blue) close to your Capacity (Green). If the blue bar is much higher, risk increases.")
                        .font(.callout)
                        .foregroundStyle(.secondary)
                        .padding(.top)
                }
                .padding()
                
                Button("Got it") {
                    showingLoadInfo = false
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
            .presentationDetents([.medium])
        }
    }
}


// Subview for Calibration Mode
struct CalibrationView: View {
    let progress: (daysCollected: Int, totalNeeded: Int, isReady: Bool)
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Calibrating System")
                .font(.headline)
                .foregroundStyle(.orange)
                .padding(.top)
            
            ZStack {
                Circle()
                    .stroke(lineWidth: 20)
                    .opacity(0.3)
                    .foregroundColor(.orange)
                
                Circle()
                    .trim(from: 0.0, to: CGFloat(progress.daysCollected) / CGFloat(progress.totalNeeded))
                    .stroke(style: StrokeStyle(lineWidth: 20, lineCap: .round, lineJoin: .round))
                    .foregroundColor(.orange)
                    .rotationEffect(Angle(degrees: 270.0))
                    .animation(.linear, value: progress.daysCollected)
                
                VStack {
                    Text("\(progress.daysCollected)/\(progress.totalNeeded)")
                        .font(.system(size: 60, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text("DAYS")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundStyle(.orange)
                }
            }
            .frame(width: 250, height: 250)
            
            Text("Keep logging. We need \(progress.totalNeeded) days of data to unlock your personalized recovery score.")
                .font(.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            Spacer()
        }
        .padding()
    }
}
