
import SwiftUI
import SwiftData

struct QuickEntryView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) var dismiss // To close if presented as sheet
    
    @State private var discount: Double = 0.0 // Unused
    @State private var date = Date() // New: Date state
    @State private var rpe: Double = 5.0
    @State private var duration: Double = 60.0
    @State private var type: String = "Strength"
    @State private var showingConfirmation = false
    
    let types = ["Strength", "Cardio", "Hypertrophy", "Sport", "Mobility"]
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 25) {
                // Date Picker (New: Allows backfilling and testing calibration)
                DatePicker("Date", selection: $date, displayedComponents: .date)
                    .datePickerStyle(.compact)
                    .padding(.horizontal)
                    .padding(.vertical, 5)
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(10)
                    .padding(.horizontal)
                
                // RPE Slider
                VStack(alignment: .leading) {
                    Text("Effort (RPE): \(Int(rpe))")
                        .font(.headline)
                    HStack {
                        Text("Easy")
                        Slider(value: $rpe, in: 1...10, step: 1)
                            .accentColor(rpeColor)
                        Text("Max")
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.2))
                .cornerRadius(15)
                
                // Duration Picker
                VStack(alignment: .leading) {
                    Text("Duration: \(Int(duration)) min")
                        .font(.headline)
                    Slider(value: $duration, in: 10...180, step: 5)
                        .accentColor(.blue)
                }
                .padding()
                .background(Color.gray.opacity(0.2))
                .cornerRadius(15)
                
                // Type Picker
                Picker("Type", selection: $type) {
                    ForEach(types, id: \.self) {
                        Text($0)
                    }
                }
                .pickerStyle(.segmented)
                .padding()
                
                Spacer()
                
                // Save Button (Big & Frictionless)
                Button(action: saveWorkout) {
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                        Text("Log Session")
                    }
                    .font(.title2.bold())
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .cornerRadius(20)
                }
                .padding()
            }
            .navigationTitle("New Session")
            .alert("Logged!", isPresented: $showingConfirmation) {
                Button("OK", role: .cancel) { }
            } message: {
                Text("Session saved. ACWR updated.")
            }
        }
    }
    
    var rpeColor: Color {
        if rpe < 4 { return .green }
        if rpe < 8 { return .yellow }
        return .red
    }
    
    func saveWorkout() {
        let newSession = WorkoutSession(
            date: date,
            type: type,
            totalVolume: 0, // Placeholder, logic uses sRPE (rpe * duration)
            rpe: Int(rpe),
            durationMinutes: Int(duration)
        )
        
        modelContext.insert(newSession)
        
        // Haptic Feedback
        #if canImport(UIKit)
        let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
        heavyImpact.impactOccurred()
        #endif
        
        showingConfirmation = true
    }
}
