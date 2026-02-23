
import SwiftUI
import SwiftData

struct ContentView: View {
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Status", systemImage: "waveform.path.ecg")
                }
            
            QuickEntryView()
                .tabItem {
                    Label("Log", systemImage: "plus.circle.fill")
                }
            
            BodyMapView()
                .tabItem {
                    Label("Body", systemImage: "figure.arms.open")
                }
        }
        .accentColor(.orange) // High contrast
        .preferredColorScheme(.dark) // Premium feel
        .onAppear {
            NotificationManager.shared.requestPermission()
        }
    }
}


