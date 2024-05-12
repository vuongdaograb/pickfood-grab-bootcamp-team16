import { NextRequest, NextResponse } from "next/server";
import { categories } from "./categories";

  
  
  export async function GET(request: NextRequest){
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("name");
    const filteredCategories = query ?
      categories.filter((category) => category.name.includes(query)) 
      : categories;
    try {
      return NextResponse.json(filteredCategories);
    } catch(error: any){
      return NextResponse.json(error,{status:500});
    }
}


