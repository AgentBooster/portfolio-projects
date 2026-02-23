//
//  MenuViewViewModel.swift
//  LittleLemonDinnerMenu
//
//  Created by Christian Marcos Moraes Pedrozo on 2/15/26.
//

import Foundation
import Combine

class MenuViewViewModel: ObservableObject {
    @Published var foodMenuItems: [MenuItem] = []
    @Published var drinkMenuItems: [MenuItem] = []
    @Published var dessertMenuItems: [MenuItem] = []
    
    @Published var sortBy: SortBy = .mostPopular {
        didSet { updateSort() }
    }
    @Published var isFoodSelected: Bool = true
    @Published var isDrinkSelected: Bool = true
    @Published var isDessertSelected: Bool = true
    
    init() {
        createMockData()
        updateSort()
    }
    
    func updateSort() {
        switch sortBy {
        case .mostPopular:
            foodMenuItems.sort { $0.orderCount > $1.orderCount }
            drinkMenuItems.sort { $0.orderCount > $1.orderCount }
            dessertMenuItems.sort { $0.orderCount > $1.orderCount }
        case .price:
            foodMenuItems.sort { $0.price < $1.price }
            drinkMenuItems.sort { $0.price < $1.price }
            dessertMenuItems.sort { $0.price < $1.price }
        case .aToZ:
            foodMenuItems.sort { $0.title < $1.title }
            drinkMenuItems.sort { $0.title < $1.title }
            dessertMenuItems.sort { $0.title < $1.title }
        }
    }
    
    private func createMockData() {
        // Food Items (12)
        for i in 1...12 {
            foodMenuItems.append(MenuItem(
                price: Double(10 + i) + 0.99, // e.g., 11.99, 12.99
                title: "Food \(i)",
                menuCategory: .food,
                orderCount: 1000 + (i * 50), // e.g., 1050, 1100
                priceInt: 10 + i, // Keeping priceInt as integer part
                ingredients: [.pasta, .tomatoSauce, .broccoli, .cheese, .tomato]
            ))
        }
        
        // Drink Items (8)
        for i in 1...8 {
            drinkMenuItems.append(MenuItem(
                price: Double(5 + i) + 0.50,
                title: "Drink \(i)",
                menuCategory: .drink,
                orderCount: 500 + (i * 20),
                priceInt: 5 + i,
                ingredients: []
            ))
        }
        
        // Dessert Items (4)
        for i in 1...4 {
            dessertMenuItems.append(MenuItem(
                price: Double(8 + i) + 0.99,
                title: "Dessert \(i)",
                menuCategory: .dessert,
                orderCount: 800 + (i * 30),
                priceInt: 8 + i,
                ingredients: [.carrot, .cheese]
            ))
        }
    }
}
