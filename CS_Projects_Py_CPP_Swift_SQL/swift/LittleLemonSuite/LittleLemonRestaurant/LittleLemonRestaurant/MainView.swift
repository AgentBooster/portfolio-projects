import SwiftUI

struct MainView: View {
    
    @StateObject var model = Model()
    @State var tabSelection = 0
    
    var body: some View {
        TabView (selection: $model.tabViewSelectedIndex){
            LocationsView()
                .tag(0)
                .tabItem {
                    Label("Locations", systemImage: "fork.knife")
                }
            
            ReservationView()
                .tag(1)
                .tabItem {
                    Label("Reservation", systemImage: "square.and.pencil")
                }
        }
        .environmentObject(model)

    }
}

struct MainView_Previews: PreviewProvider {
    static var previews: some View {
        MainView()
    }
}

