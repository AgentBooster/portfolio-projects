//
//  MenuItemsView.swift
//  LittleLemonDinnerMenu
//
//  Created by Christian Marcos Moraes Pedrozo on 2/15/26.
//

import SwiftUI

struct MenuItemsView: View {
    @StateObject private var viewModel = MenuViewViewModel()
    @State private var isShowingOptions = false
    
    private let columns = [
        GridItem(.flexible()),
        GridItem(.flexible()),
        GridItem(.flexible())
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                // Food Section
                if viewModel.isFoodSelected && !viewModel.foodMenuItems.isEmpty {
                    Text("Food")
                        .font(.title2)
                        .fontWeight(.bold)
                        .padding(.horizontal)
                    
                    LazyVGrid(columns: columns, spacing: 20) {
                        ForEach(viewModel.foodMenuItems) { item in
                            NavigationLink(destination: MenuItemDetailsView(menuItem: item)) {
                                MenuItemCard(item: item)
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Drink Section
                if viewModel.isDrinkSelected && !viewModel.drinkMenuItems.isEmpty {
                    Text("Drinks")
                        .font(.title2)
                        .fontWeight(.bold)
                        .padding([.horizontal, .top])
                    
                    LazyVGrid(columns: columns, spacing: 20) {
                        ForEach(viewModel.drinkMenuItems) { item in
                            NavigationLink(destination: MenuItemDetailsView(menuItem: item)) {
                                MenuItemCard(item: item)
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Dessert Section
                if viewModel.isDessertSelected && !viewModel.dessertMenuItems.isEmpty {
                    Text("Desserts")
                        .font(.title2)
                        .fontWeight(.bold)
                        .padding([.horizontal, .top])
                    
                    LazyVGrid(columns: columns, spacing: 20) {
                        ForEach(viewModel.dessertMenuItems) { item in
                            NavigationLink(destination: MenuItemDetailsView(menuItem: item)) {
                                MenuItemCard(item: item)
                            }
                        }
                    }
                    .padding(.horizontal)
                }
            }
        }
        .navigationTitle("Menu")
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: {
                    isShowingOptions = true
                }) {
                    Image(systemName: "slider.horizontal.3")
                }
            }
        }
        .sheet(isPresented: $isShowingOptions) {
            MenuItemsOptionView(viewModel: viewModel)
        }
    }
}

// Custom View for Grid Items
struct MenuItemCard: View {
    let item: MenuItem
    
    var body: some View {
        VStack {
            Image(item.menuCategory.rawValue) // Expects "Food", "Drink", "Dessert" in Assets
                .resizable()
                .scaledToFill() // Fill the square
                .frame(maxWidth: .infinity)
                .aspectRatio(1, contentMode: .fit)
                .clipped() // Cut off excess to stay square
            Text(item.title)
                .font(.caption)
                .foregroundColor(.primary)
                .lineLimit(1)
        }
    }
}
