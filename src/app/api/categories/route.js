import { NextResponse } from "next/server";

const categories = [
    {"id": 0, "name": "Beef"},
    {"id": 1, "name": "Coffee - Tea - Juice"},
    {"id": 2, "name": "Bread"},
    {"id": 3, "name": "Milk Tea"},
    {"id": 4, "name": "Dessert"},
    {"id": 5, "name": "Fast Food"},
    {"id": 6, "name": "Snack"},
    {"id": 7, "name": "Healthy Food"},
    {"id": 8, "name": "Hotpot & Grill"},
    {"id": 9, "name": "International Food"},
    {"id": 10, "name": "Noodles"},
    {"id": 11, "name": "Rice"},
    {"id": 12, "name": "Others"},
    {"id": 13, "name": "Vietnamese Cake"},
    {"id": 14, "name": "Bánh Mì"},
    {"id": 15, "name": "Congee"},
    {"id": 16, "name": "Dimsum"},
    {"id": 17, "name": "Pizza"},
    {"id": 18, "name": "Seafood"},
    {"id": 19, "name": "Món Nhậu"},
    {"id": 20, "name": "Vegan - Vegetarian"},
    {"id": 21, "name": "Japanese"}
  ];
  
  
export async function GET(){
    try {
        return NextResponse.json(categories);
    } catch(error){
        return NextResponse.json(error,{status: 500});
    }
}


