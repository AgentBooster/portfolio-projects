//
//  MenuItemDetailsView.swift
//  LittleLemonDinnerMenu
//
//  Created by Christian Marcos Moraes Pedrozo on 2/15/26.
//

import SwiftUI

struct MenuItemDetailsView: View {
    let menuItem: MenuItem
    
    var body: some View {
        ScrollView {
            VStack {
                Image("Little Lemon logo") // From Assets
                    .resizable()
                    .scaledToFit()
                    .frame(height: 300, alignment: .center)
                    .frame(maxWidth: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: 15))
                
                
                // Title removed as it is already in the navigation bar

                
                VStack(spacing: 4) {
                    Text("Price:")
                        .fontWeight(.bold)
                    Text(String(format: "%.2f", menuItem.price))
                }
                .padding(.bottom, 5)
                
                VStack(spacing: 4) {
                    Text("Ordered:")
                        .fontWeight(.bold)
                    Text("\(menuItem.orderCount)")
                }
                .padding(.bottom, 5)
                
                if !menuItem.ingredients.isEmpty {
                    VStack(spacing: 4) {
                        Text("Ingredients:")
                            .fontWeight(.bold)
                        ForEach(menuItem.ingredients, id: \.self) { ingredient in
                            Text(ingredient.rawValue)
                        }
                    }
                    .padding(.top, 5)
                }
            }
            .padding()
        }
        .navigationTitle(menuItem.title)
        .navigationBarTitleDisplayMode(.inline)
    }
}
