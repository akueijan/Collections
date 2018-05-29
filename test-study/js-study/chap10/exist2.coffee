# 變數coffee為null時，設定預設值black
coffee = null

coffee ?= 'black'
#coffee ||= 'black'
# 若變數coffee不存在，將yes指定給變數cocoa
cocoa = coffee ? yes