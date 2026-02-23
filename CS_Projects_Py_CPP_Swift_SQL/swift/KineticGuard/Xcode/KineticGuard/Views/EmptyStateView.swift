import SwiftUI

struct EmptyStateView: View {
    // Optional: Binding to redirect to logging tab if needed, 
    // but for now we'll just encourage the action.
    
    var body: some View {
        VStack(spacing: 25) {
            Spacer()
            
            Image(systemName: "chart.bar.xaxis")
                .font(.system(size: 70))
                .foregroundStyle(.secondary)
                .padding()
                .background(
                    Circle()
                        .stroke(Color.secondary.opacity(0.3), lineWidth: 2)
                        .frame(width: 140, height: 140)
                )
            
            VStack(spacing: 12) {
                Text("No Data Yet")
                    .font(.title2.bold())
                
                Text("Your recovery landscape is empty. Log your first session to start the calibration process.")
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
            }
            
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    EmptyStateView()
        .preferredColorScheme(.dark)
}
