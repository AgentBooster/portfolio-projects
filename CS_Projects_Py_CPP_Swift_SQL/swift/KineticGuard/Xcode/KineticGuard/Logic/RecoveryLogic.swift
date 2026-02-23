import Foundation
import SwiftData

// NOTE: The logic for the ACWR sliding window algorithm and the decision tree for Pivots
// was refined and implemented with the assistance of an LLM, specifically
// in structuring the data processing pipeline before the UI implementation.
// Compliance with CS50x Final Project policy on AI-based software helpers.

/// The "Brain" of Kinetic Guard. Handles ACWR math and Pivot decisions.
class RecoveryLogic {
    
    // MARK: - ACWR Calculation
    /// Calculates the Acute:Chronic Workload Ratio
    /// Formula: (Load Last 7 Days) / (Average Weekly Load Last 28 Days)
    /// - Parameter sessions: All recorded workout sessions
    /// - Returns: A Double representing the ratio (e.g., 1.1)
    static func calculateACWR(sessions: [WorkoutSession], referencesDate: Date = Date()) -> Double {
        let calendar = Calendar.current
        
        // 1. Filter sessions for the analysis window (last 28 days)
        let referenceStartOfDay = calendar.startOfDay(for: referencesDate)
        
        // Acute: Last 7 days (including today)
        let acuteWindowStart = calendar.date(byAdding: .day, value: -6, to: referenceStartOfDay)!
        
        // Chronic: Last 28 days
        let chronicWindowStart = calendar.date(byAdding: .day, value: -27, to: referenceStartOfDay)!
        
        // Calculate Acute Load (Total of last 7 Days)
        let acuteLoad = sessions
            .filter { $0.date >= acuteWindowStart && $0.date <= referencesDate }
            .reduce(0) { $0 + $1.sRPE }
        
        // Calculate Chronic Load context
        let totalChronicLoad = sessions
            .filter { $0.date >= chronicWindowStart && $0.date <= referencesDate }
            .reduce(0) { $0 + $1.sRPE }
        
        // FIX: Check if we have enough history. Relaxed to -6 days to allow calculation ON the 7th day.
        // We use startOfDay to be time-agnostic and match the UI 'unique days' logic.
        guard let firstSession = sessions.sorted(by: { $0.date < $1.date }).first else { return 0.0 }
        
        let firstDate = calendar.startOfDay(for: firstSession.date)
        let safeThreshold = calendar.date(byAdding: .day, value: -6, to: calendar.startOfDay(for: referencesDate))!
        
        guard firstDate <= safeThreshold else {
            return 0.0 // Insufficient history (Calibration Phase)
        }
        
        // Avoid division by zero
        if totalChronicLoad == 0 { return 0.0 }
        
        // For new users (7-28 days), we calculate chronic based on what they have
        // FIX: Instead of dividing by 4 immediately (which dilutes load), we divide by the number of weeks available.
        let daysSinceStart = Calendar.current.dateComponents([.day], from: firstSession.date, to: referencesDate).day ?? 28
        let weeksAvailable = max(1.0, Double(daysSinceStart) / 7.0)
        let chronicAvgLoad = totalChronicLoad / min(4.0, weeksAvailable)
        
        if chronicAvgLoad == 0 { return 0.0 }
        
        return acuteLoad / chronicAvgLoad
    }
    
    // MARK: - Calibration Helper
    /// Returns the progress of the calibration phase
    static func calibrationProgress(sessions: [WorkoutSession]) -> (daysCollected: Int, totalNeeded: Int, isReady: Bool) {
        let uniqueDays = Set(sessions.map { Calendar.current.startOfDay(for: $0.date) }).count
        let totalNeeded = 7
        return (uniqueDays, totalNeeded, uniqueDays >= totalNeeded)
    }
    
    // MARK: - Status Interpretation
    enum RecoveryStatus {
        case underTraining // < 0.8
        case optimal      // 0.8 - 1.3
        case highRisk     // > 1.5
        case overreaching // 1.3 - 1.5 (Warning Zone)
    }
    
    static func interpretACWR(_ ratio: Double) -> RecoveryStatus {
        switch ratio {
        case ..<0.8: return .underTraining
        case 0.8...1.3: return .optimal
        case 1.3001...1.5: return .overreaching // Precision handle
        default: return .highRisk
        }
    }
    
    // MARK: - Chart Data Generator
    struct DailyLoad: Identifiable {
        let id = UUID()
        let date: Date
        let acuteLoad: Double // CHANGED: Int -> Double to match sRPE type
        let chronicLoad: Double
    }
    
    static func generateChartData(sessions: [WorkoutSession], days: Int = 28) -> [DailyLoad] {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        var data: [DailyLoad] = []
        
        // Loop back 'days' amount
        for i in (0..<days).reversed() {
            guard let currentDate = calendar.date(byAdding: .day, value: -i, to: today) else { continue }
            
            // Acute Load (Fatigue): Rolling 7-Day Sum
            // Corrected Date Logic: Include sessions from the *end* of the target day back 7 days.
            let acuteStart = calendar.date(byAdding: .day, value: -6, to: currentDate)!
            // We use close range for "End of Day" comparison logic roughly, or simply compare dates by ignoring time.
            let acuteLoad = sessions
                .filter { 
                    let sDate = calendar.startOfDay(for: $0.date)
                    let cDate = calendar.startOfDay(for: currentDate)
                    let aDate = calendar.startOfDay(for: acuteStart)
                    return sDate >= aDate && sDate <= cDate
                }
                .reduce(0.0) { $0 + $1.sRPE }
            
            // Chronic Load (Fitness): Rolling 28-Day Sum normalized by available history
            let chronicStart = calendar.date(byAdding: .day, value: -27, to: currentDate)!
            let chronicSum = sessions
                .filter { 
                    let sDate = calendar.startOfDay(for: $0.date)
                    let cDate = calendar.startOfDay(for: currentDate)
                    let chDate = calendar.startOfDay(for: chronicStart)
                    return sDate >= chDate && sDate <= cDate
                }
                .reduce(0.0) { $0 + $1.sRPE }
            
            // Dynamic Divisor Logic (Fix for Calibration Phase)
            // If less than 4 weeks of data exist relative to this point, divide by available weeks.
            // Check first ever session date
            let chronicDivisor: Double
            if let firstSession = sessions.sorted(by: { $0.date < $1.date }).first {
                 let daysSinceStart = calendar.dateComponents([.day], from: firstSession.date, to: currentDate).day ?? 28
                 // At least 1 week divisor to avoid explosion
                 let weeksAvailable = max(1.0, Double(daysSinceStart) / 7.0)
                 chronicDivisor = min(4.0, weeksAvailable)
            } else {
                chronicDivisor = 4.0
            }
            
            let chronicAvgWeekly = chronicSum / chronicDivisor
            
            data.append(DailyLoad(date: currentDate, acuteLoad: acuteLoad, chronicLoad: chronicAvgWeekly))
        }
        
        return data
    }

    // MARK: - Pivot Logic
    struct ExerciseAlternative {
        let original: String // "Action" or "Context"
        let alternatives: [String] // Suggestions
        let type: SuggestionType
    }
    
    enum SuggestionType {
        case adjustment // Low intensity (1-3)
        case substitution // Medium intensity (4-6)
        case redFlag // High intensity (7-10)
    }
    
    // MARK: - Validation Logic
    /// Returns the list of valid PainTriggers for a specific BodyPart.
    /// This prevents illogical combinations (e.g., Shoulder pain from Squatting).
    static func validTriggers(for bodyPart: BodyPart) -> [PainTrigger] {
        switch bodyPart {
        case .shoulder:
            return [.pushOverhead, .pushHorizontal, .pullVertical, .pullHorizontal]
        case .knee:
            return [.squat, .impact, .hinge]
        case .lowerBack:
            return [.hinge, .squat, .pullHorizontal]
        case .elbow:
            return [.pushHorizontal, .pushOverhead, .pullVertical, .pullHorizontal]
        case .wrist:
            return [.pushHorizontal, .pushOverhead, .pullVertical]
        case .hip:
            return [.squat, .hinge, .impact]
        case .ankle:
            return [.impact, .squat]
        case .other:
            return [.pushHorizontal, .pushOverhead, .pullVertical, .pullHorizontal, .squat, .hinge, .impact] // All valid for 'Other'
        }
    }

    // Knowledge Base: Context-Aware Triage Matrix
    // Inputs: Location (BodyPart) + Trigger (Motion) + Intensity (Pain Level)
    static func suggestPivots(for bodyPart: BodyPart, trigger: PainTrigger, intensity: Int) -> [ExerciseAlternative] {
        
        // 1. High Intensity Red Flag (Universal Safety Net)
        if intensity >= 7 {
            return [
                ExerciseAlternative(original: "High Pain Detected (\(intensity)/10)", alternatives: ["Stop loading this area immediately.", "Apply RICE protocol if acute.", "Consult a specialist if pain persists > 24h."], type: .redFlag)
            ]
        }
        
        // 2. Low Intensity Adjustments (Technique/Volume)
        if intensity <= 3 {
             return [
                ExerciseAlternative(original: "Minor Discomfort", alternatives: ["Reduce Range of Motion (ROM) by 20%.", "Slow down tempo (3-0-3).", "Extend warm-up time for \(bodyPart.rawValue)."], type: .adjustment)
            ]
        }
        
        // 3. Medium Intensity Substitutions (The Core Matrix)
        switch bodyPart {
        case .shoulder:
            switch trigger {
            case .pushOverhead:
                return [ExerciseAlternative(original: "Overhead Press", alternatives: ["Landmine Press (Angled)", "High Incline DB Press", "Lateral Raise (Light)"], type: .substitution)]
            case .pushHorizontal:
                return [ExerciseAlternative(original: "Bench Press", alternatives: ["Floor Press (Limited Range)", "Neutral Grip DB Press", "Push-ups on Handles"], type: .substitution)]
            case .pullVertical:
                 return [ExerciseAlternative(original: "Vertical Pull", alternatives: ["Lat Pulldown (Neutral Grip)", "Half-Kneeling Single Arm Pulldown"], type: .substitution)]
            case .pullHorizontal:
                 return [ExerciseAlternative(original: "Horizontal Row", alternatives: ["Chest Supported Row (Lower back safe)", "Face Pulls (Rotator Cuff)"], type: .substitution)]
            default:
                return [ExerciseAlternative(original: "General Shoulder Load", alternatives: ["Avoid end-range internal rotation", "Warm up rotator cuff (Y-T-W raises)"], type: .substitution)]
            }
            
        case .knee:
            switch trigger {
            case .squat:
                return [ExerciseAlternative(original: "Back Squat", alternatives: ["Box Squat (Vertical Tibia)", "Reverse Lunges (Less Shear)", "Glute Bridge (No Axial Load)"], type: .substitution)]
            case .impact:
                return [ExerciseAlternative(original: "Running/Jumping", alternatives: ["Cycling (Low Impact)", "Swimming", "Elliptical"], type: .substitution)]
            case .hinge:
                 return [ExerciseAlternative(original: "Knee Dominant Hinge", alternatives: ["RDL (Focus on Hips)", "Good Mornings"], type: .substitution)]
            default:
                 return [ExerciseAlternative(original: "General Knee Load", alternatives: ["Check Ankle Mobility", "Foam Roll Quads"], type: .substitution)]
            }
            
        case .lowerBack:
            switch trigger {
            case .hinge:
                return [ExerciseAlternative(original: "Deadlift", alternatives: ["Trap Bar Deadlift (More Upright)", "Hip Thrust", "Suitcase Carry (Core Stability)"], type: .substitution)]
            case .squat:
                 return [ExerciseAlternative(original: "Axial Loading", alternatives: ["Goblet Squat (Counterbalance)", "Belt Squat (No Spine Load)"], type: .substitution)]
            case .pullHorizontal:
                return [ExerciseAlternative(original: "Bent Over Row", alternatives: ["Chest Supported Row", "Seated Cable Row"], type: .substitution)]
            default:
                return [ExerciseAlternative(original: "General Spinal Load", alternatives: ["Bird-Dog (Stability)", "McGill Big 3"], type: .substitution)]
            }
            
        case .elbow:
             // Detailed distinction for Push vs Pull
             if trigger == .pullVertical || trigger == .pullHorizontal {
                 return [ExerciseAlternative(original: "Pulling (Flexion)", alternatives: ["Use Lifting Straps (Offload Grip)", "Neutral Grip Rows"], type: .substitution)]
             } else {
                 return [ExerciseAlternative(original: "Pushing (Extension)", alternatives: ["Cable Pushdowns (Rope)", "Dips (Check Width)", "Kickbacks"], type: .substitution)]
             }
            
        case .wrist:
             return [ExerciseAlternative(original: "Load Bearing", alternatives: ["Use Wrist Wraps (Support)", "Knuckle Pushups (Neutral Wrists)", "Use Lifting Straps (Offload Grip)"], type: .substitution)]
            
        case .hip:
            switch trigger {
            case .squat:
                 return [ExerciseAlternative(original: "Deep Flexion", alternatives: ["Box Squat (Limit Depth)", "Step-ups"], type: .substitution)]
            case .hinge:
                 return [ExerciseAlternative(original: "Hinge Loading", alternatives: ["Cable Pull-throughs", "Glute Bridges"], type: .substitution)]
            case .impact:
                 return [ExerciseAlternative(original: "Impact", alternatives: ["Walking Incline", "Rowing", "Cycling"], type: .substitution)]
            default:
                 return [ExerciseAlternative(original: "General Hip", alternatives: ["90/90 Mobility Stretch", "Glute Activation"], type: .substitution)]
            }
            
        case .ankle:
            return [ExerciseAlternative(original: "Impact/Flexion", alternatives: ["Elliptical (No Impact)", "Seated Calf Raises", "Swimming"], type: .substitution)]
            
        case .other:
            return [ExerciseAlternative(original: "General Fatigue", alternatives: ["Active Recovery (Walking)", "Focus on Sleep Hygiene", "Hydration & Electrolytes"], type: .substitution)]
        }
    }
}
