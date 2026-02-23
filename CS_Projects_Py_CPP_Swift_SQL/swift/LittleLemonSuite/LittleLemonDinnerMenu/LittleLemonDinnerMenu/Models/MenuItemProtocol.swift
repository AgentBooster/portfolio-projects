//
//  MenuItemProtocol.swift
//  LittleLemonDinnerMenu
//
//  Created by Christian Marcos Moraes Pedrozo on 2/15/26.
//

import Foundation

protocol MenuItemProtocol {
    var id: UUID { get }
    var price: Double { get }
    var title: String { get }
    var menuCategory: MenuCategory { get }
    var orderCount: Int { get set }
    var priceInt: Int { get set }
    var ingredients: [Ingredient] { get set }
}
