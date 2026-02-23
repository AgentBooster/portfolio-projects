//
//  MenuItem.swift
//  LittleLemonDinnerMenu
//
//  Created by Christian Marcos Moraes Pedrozo on 2/15/26.
//

import Foundation

struct MenuItem: Identifiable, MenuItemProtocol {
    var id = UUID()
    var price: Double
    var title: String
    var menuCategory: MenuCategory
    var orderCount: Int
    var priceInt: Int
    var ingredients: [Ingredient]
}
