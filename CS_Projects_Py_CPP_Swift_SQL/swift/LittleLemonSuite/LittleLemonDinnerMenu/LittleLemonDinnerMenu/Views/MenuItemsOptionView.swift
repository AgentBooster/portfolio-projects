//
//  MenuItemsOptionView.swift
//  LittleLemonDinnerMenu
//
//  Created by Christian Marcos Moraes Pedrozo on 2/15/26.
//

import SwiftUI

enum SortBy: String, CaseIterable {
    case mostPopular = "Most Popular"
    case price = "Price $-$$$"
    case aToZ = "A-Z"
}

struct MenuItemsOptionView: View {
    @Environment(\.dismiss) var dismiss
    @ObservedObject var viewModel: MenuViewViewModel
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("SELECTED CATEGORIES")) {
                    Toggle(MenuCategory.food.rawValue, isOn: $viewModel.isFoodSelected)
                    Toggle(MenuCategory.drink.rawValue, isOn: $viewModel.isDrinkSelected)
                    Toggle(MenuCategory.dessert.rawValue, isOn: $viewModel.isDessertSelected)
                }
                
                Section(header: Text("SORT BY")) {
                    ForEach(SortBy.allCases, id: \.self) { sortOption in
                        Button(action: {
                            viewModel.sortBy = sortOption
                        }) {
                            HStack {
                                Text(sortOption.rawValue)
                                Spacer()
                                if viewModel.sortBy == sortOption {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(.blue)
                                }
                            }
                        }
                        .foregroundColor(.primary)
                    }
                }
            }
            .navigationTitle("Filter")
            .toolbar {
                Button("Done") {
                    dismiss()
                }
            }
        }
    }
}
