//
//  MenuItemTests.swift
//  LittleLemonDinnerMenuTests
//
//  Created by Christian Marcos Moraes Pedrozo on 2/15/26.
//

import XCTest
@testable import LittleLemonDinnerMenu

final class MenuItemTests: XCTestCase {

    func testMenuItemTitle() {
        let title = "Test Food"
        let menuItem = MenuItem(
            price: 10.0,
            title: title,
            menuCategory: .food,
            orderCount: 1,
            priceInt: 10,
            ingredients: [.broccoli, .carrot]
        )
        
        XCTAssertEqual(menuItem.title, title, "MenuItem title should match initialized title")
    }
    
    func testMenuItemIngredients() {
        let ingredients: [Ingredient] = [.spinach, .pasta]
        let menuItem = MenuItem(
            price: 15.0,
            title: "Test Pasta",
            menuCategory: .food,
            orderCount: 5,
            priceInt: 15,
            ingredients: ingredients
        )
        
        XCTAssertEqual(menuItem.ingredients, ingredients, "MenuItem ingredients should match initialized ingredients")
    }

}