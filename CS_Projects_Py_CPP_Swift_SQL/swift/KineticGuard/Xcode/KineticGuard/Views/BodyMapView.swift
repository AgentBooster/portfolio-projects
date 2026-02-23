
import SwiftUI
import SwiftData

struct BodyMapView: View {
    @Environment(\.modelContext) private var reviewContext
    
    // Grid layout for premium body part cards
    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    @State private var selectedPart: BodyPart?
    @State private var showingPivot = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Background Gradient
                LinearGradient(colors: [Color.black, Color.gray.opacity(0.15)], startPoint: .top, endPoint: .bottom)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading) {
                        Text("Where does it hurt?")
                            .font(.title2.bold())
                            .foregroundStyle(.white)
                            .padding(.bottom)
                        
                        LazyVGrid(columns: columns, spacing: 16) {
                            ForEach(BodyPart.allCases, id: \.self) { part in
                                if part != .other {
                                    Button(action: {
                                        selectPart(part)
                                    }) {
                                        VStack {
                                            Image(systemName: icon(for: part))
                                                .font(.system(size: 30))
                                                .foregroundStyle(Color.cyan) // Neon accent
                                                .padding(.bottom, 8)
                                                .symbolEffect(.bounce, value: selectedPart == part) // Animation
                                            
                                            Text(part.rawValue)
                                                .font(.headline)
                                                .foregroundStyle(.white)
                                        }
                                        .frame(maxWidth: .infinity)
                                        .frame(height: 110)
                                        .background(.ultraThinMaterial) // Glassmorphism
                                        .cornerRadius(16)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 16)
                                                .stroke(Color.white.opacity(0.1), lineWidth: 1)
                                        )
                                        .shadow(color: Color.black.opacity(0.2), radius: 5, x: 0, y: 5)
                                    }
                                }
                            }
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Body Scan")
            .sheet(isPresented: $showingPivot) {
                if let part = selectedPart {
                    PivotSuggestionView(bodyPart: part)
                        .presentationDetents([.medium, .large])
                }
            }
        }
    }
    
    func selectPart(_ part: BodyPart) {
        selectedPart = part
        // Trigger Pivot Logic
        showingPivot = true
        
        // Removed premature saving. User should save in the detail view manually if desired.
    }
    
    func icon(for part: BodyPart) -> String {
        switch part {
        case .shoulder: return "figure.arms.open"
        case .knee: return "figure.walk" // Enhanced: figure.walk is safer than figure.run which implies impact
        case .lowerBack: return "figure.core.training"
        case .elbow: return "figure.strengthtraining.traditional" // More relevant for lifting
        case .wrist: return "hand.raised.fill" // Fill variant for emphasis
        case .hip: return "figure.flexibility"
        case .ankle: return "shoe.fill" // Fill variant
        default: return "exclamationmark.circle"
        }
    }
}

// MARK: - Pivot Suggestion Sheet (Triage Interface)
struct PivotSuggestionView: View {
    @Environment(\.dismiss) var dismiss
    
    // Properties
    var bodyPart: BodyPart
    
    // Triage State
    @State private var selectedTrigger: PainTrigger
    @State private var intensity: Double = 3.0
    
    init(bodyPart: BodyPart) {
        self.bodyPart = bodyPart
        // Initialize with a valid trigger for this body part to avoid Picker warnings on render
        let initialTrigger = RecoveryLogic.validTriggers(for: bodyPart).first ?? .passive
        _selectedTrigger = State(initialValue: initialTrigger)
    }
    
    // Dynamic Suggestions based on state
    var pivots: [RecoveryLogic.ExerciseAlternative] {
        RecoveryLogic.suggestPivots(for: bodyPart, trigger: selectedTrigger, intensity: Int(intensity))
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Context")) {
                    // Trigger Picker
                    Picker("Trigger Motion", selection: $selectedTrigger) {
                        ForEach(RecoveryLogic.validTriggers(for: bodyPart), id: \.self) { trigger in
                            Text(trigger.rawValue).tag(trigger)
                        }
                    }
                    .pickerStyle(.menu)
                    .onAppear {
                        // Ensure the default selected trigger is valid for this body part
                        let validTriggers = RecoveryLogic.validTriggers(for: bodyPart)
                        if !validTriggers.contains(selectedTrigger), let first = validTriggers.first {
                            selectedTrigger = first
                        }
                    }
                    
                    // Intensity Slider
                    VStack(alignment: .leading) {
                        HStack {
                            Text("Pain Intensity")
                            Spacer()
                            Text("\(Int(intensity))/10")
                                .fontWeight(.bold)
                                .foregroundStyle(intensityColor)
                        }
                        Slider(value: $intensity, in: 1...10, step: 1)
                            .accentColor(intensityColor)
                    }
                }
                
                Section(header: Text("Recommendations")) {
                    if pivots.isEmpty {
                        Text("No specific suggestions for this combination. Consult a professional.")
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(pivots, id: \.original) { pivot in
                            PivotRow(pivot: pivot)
                        }
                    }
                }
            }
            .navigationTitle("\(bodyPart.rawValue) Guide")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }
    
    var intensityColor: Color {
        switch Int(intensity) {
        case 1...3: return .green
        case 4...6: return .orange
        case 7...10: return .red
        default: return .blue
        }
    }
}

struct PivotRow: View {
    let pivot: RecoveryLogic.ExerciseAlternative
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: iconForType(pivot.type))
                    .foregroundStyle(colorForType(pivot.type))
                Text(titleForType(pivot.type))
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundStyle(colorForType(pivot.type))
                    .textCase(.uppercase)
                
                Spacer()
            }
            
            Text(pivot.original)
                .font(.headline)
            
            ForEach(pivot.alternatives, id: \.self) { alt in
                HStack(alignment: .top) {
                    Image(systemName: "arrow.turn.down.right")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(alt)
                        .font(.body)
                }
            }
        }
        .padding(.vertical, 4)
    }
    
    func colorForType(_ type: RecoveryLogic.SuggestionType) -> Color {
        switch type {
        case .adjustment: return .blue
        case .substitution: return .orange
        case .redFlag: return .red
        }
    }
    
    func iconForType(_ type: RecoveryLogic.SuggestionType) -> String {
        switch type {
        case .adjustment: return "slider.horizontal.3"
        case .substitution: return "arrow.triangle.2.circlepath"
        case .redFlag: return "exclamationmark.triangle.fill"
        }
    }
    
    func titleForType(_ type: RecoveryLogic.SuggestionType) -> String {
        switch type {
        case .adjustment: return "Technique Adjustment"
        case .substitution: return "Exercise Substitute"
        case .redFlag: return "Safety Warning"
        }
    }
}
