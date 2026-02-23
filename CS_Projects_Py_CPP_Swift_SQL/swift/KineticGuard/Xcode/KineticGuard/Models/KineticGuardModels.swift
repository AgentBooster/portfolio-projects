
import SwiftData
import Foundation

// MARK: - User Profile
/// Stores the athlete's static data for load calibration.
@Model
class UserProfile {
    var name: String
    var age: Int
    var weight: Double
    var levelRaw: String // "Beginner", "Advanced"
    
    // Computed property for type-safe access
    var level: TrainingLevel {
        get { TrainingLevel(rawValue: levelRaw) ?? .beginner }
        set { levelRaw = newValue.rawValue }
    }
    
    init(name: String, age: Int, weight: Double, level: TrainingLevel) {
        self.name = name
        self.age = age
        self.weight = weight
        self.levelRaw = level.rawValue
    }
}

enum TrainingLevel: String, Codable {
    case beginner = "Beginner"
    case intermediate = "Intermediate"
    case advanced = "Advanced"
}

// MARK: - Workout Session
/// Represents a single training session with subjective load metrics.
@Model
class WorkoutSession {
    var id: UUID
    var date: Date
    var type: String // e.g., "Strength", "Cardio", "Hypertrophy"
    var totalVolume: Double // Can be Tonnage (Weight * Reps) or Duration * RPE
    var rpe: Int // Rating of Perceived Exertion (1-10)
    var durationMinutes: Int
    
    // Recovery Score associated with this session? 
    // Or maybe we calculate ACWR dynamically from history.
    
    init(date: Date = Date(), type: String, totalVolume: Double, rpe: Int, durationMinutes: Int) {
        self.id = UUID()
        self.date = date
        self.type = type
        self.totalVolume = totalVolume
        self.rpe = rpe
        self.durationMinutes = durationMinutes
    }
    
    /// Calculates the 'Load' for ACWR based on arbitrary units (session RPE * Duration)
    /// This is the standard method for mixed-modality sports (Foster et al.)
    var sRPE: Double {
        return Double(rpe * durationMinutes)
    }
}

// MARK: - Joint Record (Pain Map)
/// Tracks specific body part discomfort to trigger the "Pivot" logic.
@Model
class JointRecord {
    var id: UUID
    var date: Date
    var bodyPartRaw: String // Restored missing property
    var painLevel: Int // 1-10
    var notes: String?
    var triggerRaw: String = PainTrigger.passive.rawValue // Default for migration
    
    var bodyPart: BodyPart {
        get { BodyPart(rawValue: bodyPartRaw) ?? .other }
        set { bodyPartRaw = newValue.rawValue }
    }
    
    var trigger: PainTrigger {
        get { PainTrigger(rawValue: triggerRaw) ?? .passive }
        set { triggerRaw = newValue.rawValue }
    }
    
    init(date: Date = Date(), bodyPart: BodyPart, painLevel: Int, trigger: PainTrigger = .passive, notes: String? = nil) {
        self.id = UUID()
        self.date = date
        self.bodyPartRaw = bodyPart.rawValue
        self.painLevel = painLevel
        self.triggerRaw = trigger.rawValue
        self.notes = notes
    }
}

enum BodyPart: String, Codable, CaseIterable {
    case shoulder = "Shoulder"
    case knee = "Knee"
    case lowerBack = "Lower Back"
    case elbow = "Elbow"
    case wrist = "Wrist"
    case hip = "Hip"
    case ankle = "Ankle"
    case other = "Other"
}

enum PainTrigger: String, Codable, CaseIterable {
    case pushOverhead = "Overhead Push"
    case pushHorizontal = "Horizontal Push"
    case pullVertical = "Vertical Pull"
    case pullHorizontal = "Horizontal Pull"
    case squat = "Squatting"
    case hinge = "Hinging (Deadlift)"
    case impact = "Impact (Run/Jump)"
    case passive = "Passive / At Rest"
}
