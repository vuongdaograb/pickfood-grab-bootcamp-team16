import unicodedata
from pymongo import MongoClient, UpdateOne
import json


uri = "mongodb+srv://huyngovoquang:8LqONnokekwDmr9D@grabfood.agpqcez.mongodb.net/?retryWrites=true&w=majority&appName=GrabFood"


def normalize_text(text):
    return unicodedata.normalize('NFC', text)

categories = {
        "Beef": [ "xúc xích", "bò xào", "bò lúc lắc"],
        "Coffee - Tea - Juice": ["americano", "latte", "cappuccino", "cà phê", "trà đào", "nước ép", "sinh tố", "cafe", "lassi"],
        "Bread": ["croissant", "bánh mì", "churros"],
        "Milk Tea": ["sữa chua", "sữa", "trà sữa", "cappucino", "frappuccino"],
        "Dessert": ["tiramisu", "chè", "churros","croissant", "bánh flan"],
        "Fast Food": ["burger", "hotdog", "pizza", "mì gói", "mì thịt heo","gà"],
        "Snack": ["khoai tây", "xôi", "nui", "xiên que", "nem chua", "nem rán","cá viên","nem"],
        "Healthy Food": ["cháo","salad"],
        "Hotpot & Grill": ["lẩu", "chả ram", "chả giò", "gimbap", "gyro", "tom yum", "kebab"],
        "International Food": ["gimbap", "gyro", "kebab", "pizza", "sushi", "sashimi", "tempura", "pad thai", "bibimbap", "falafel", "satay", "tokbokki"],
        "Noodles": ["bún", "bún đậu", "bún mắm", "bún ốc", "bún hến","mì gói","mì ý", "mì ramen", "mì udon", "hủ tiếu", "mì trộn", "mì quảng", "mì vịt tiềm", "mì chua", "mì","mì gà"],
        "Rice": ["cơm gà", "cơm hến", "cơm cháy", "cơm chiên", "cơm lam", "cơm rang", "cơm tấm","cơm"],
        "Others": ["mocktail", "chạo tôm"],
        "Vietnamese Cake": ["bánh ướt", "bánh bèo", "bánh rán", "bánh bột lọc", "bánh cam", "bánh tôm","bánh tráng", "bánh dày", "bánh chưng", "bánh in", "bánh bao", "bánh bò", "bánh ít", "bánh đúc", "bánh da lợn", "bánh gai", "bánh khọt", "bánh pía","bánh gạo","bánh hỏi", "bánh bông lan", "bánh gối"],
        "Bánh Mì": ["bánh mì"],
        "Congee": ["súp","cháo"],
        "Dimsum": ["gyoza","chả giò"],
        "Pizza": ["pizza"],
        "Seafood": ["cá", "sò đình", "hải sản", "cá kho", "cá chua", "ốc", "cá chiên", "cá lóc", "cá vịt", "sò"],
        "Món Nhậu": ["rau muống xào tỏi", "rau muống xào chua ngọt", "rau muống xào lòng", "rau muống luốc", "rau muống xào tỏi", "rau muống xào lòng"],
        "Vegan - Vegetarian": ["chay", "đậu phụ", "bí đỏ", "rau cải"],
        "Japanese": ["kimbap", "sushi", "sashimi", "tempura", "udon", "miso", "bento"]
    }


def categorize_food(food):
    
    categories_return = []
    food = normalize_text(food)
    for category,items in categories.items():
        for item in items:
            item = normalize_text(item)
            if item.lower() == food.lower():
                if category not in categories_return:
                    categories_return.append(category)
    
    food_words = food.split()
    
    # if length of food words less then 3 then
    # only split and compare each word with items in categories
    if not categories_return and len(food_words) < 3:
        
        
        for word in food_words:
            word = normalize_text(word)
            for category,items in categories.items():
                for item in items:
                    item = normalize_text(item)
                    if  item.lower() == word.lower():
                        if category not in categories_return:
                            categories_return.append(category)
    
    # if length of food words is larger than 2 then
    # split and join to create subwords
    # use subwords to compare with items  
    if not categories_return and len(food_words) >= 3:
        for window_size in range(len(food_words) + 1,0,-1):
            for i in range(len(food_words) - window_size + 1):
                # Join the words within the sliding window
                word = " ".join(food_words[i:i+window_size])

                # Normalize the word
                word = normalize_text(word)
                # Check if the word matches any item in the categories
                for category, items in categories.items():
                    for item in items:
                        item = normalize_text(item)
                        if item.lower() == word.lower():
                            if category not in categories_return:
                                categories_return.append(category)
                                break
            if len(categories_return) > 0:
                break

    if not categories_return:
        categories_return.append("Others")
    return categories_return
    
    
               
def getDishes(filename):
    with open(filename,"r",encoding='utf-8') as file:
        contents = file.read()
        
        lines = contents.split("\n")
        dishes = []
        for line in lines:
            
            if not line:
                continue
            
            # Add the dish to the list
            dishes.append(line)
    return dishes

def pull_dishes_from_mongodb(client):
    
    
    database = client['GrabFoodDB']
    collection = database['dishes']
    
    dishes = collection.find({},{'id':1,'name':1})
    
    if dishes:
        return dishes
    
def pull_dishes_from_json(filename):
    
    with open(filename,'r',encoding='utf-8') as f:
        data = json.load(f)
    result_dict = {}
    
    for item in data:
        result_dict[item['id']] = item['name']
    
    return result_dict


        

if __name__ == '__main__':

    client = MongoClient(uri)
    
    try:
        client.addmin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    database = client['GrabFoodDB']
    collection = database['dishes']
    
    
    
    
    dishes_json = pull_dishes_from_json("name_extracted_tmp.json")
    
    # # dishes = pull_dishes_from_mongodb(client)
    
    """
        Categorize foods and push them to MongoDB
    """
    for id,names in dishes_json.items():
        category = []
        for name in names:
            results = categorize_food(name)
            for result in results:
                if result not in category:
                    category.append(result)     
        try:
            collection.update_one({'id': id}, {'$set': {'category': category}})
            print("Dish "+id+" updated successfully")
        except Exception as e:
            print(e)
            with open("errors.txt","w",encoding='utf-8') as f:
                f.write(id)
                f.write('\n')
    
    # with open("name_extracted.json","r",encoding='utf-8') as f:
    #     data = json.load(f)
    
    # name_list = []
    # for dish in data:
    #     id = dish['id']
    #     names = dish['name']
    #     for name in names:
    #         if name not in name_list:
    #             name_list.append(name)
                
    # with open("dish_names.txt","w",encoding='utf-8') as f:
    #     for name in name_list:
    #         f.write(name)
    #         f.write('\n')
    
    

    
        
    