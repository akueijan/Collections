var index_view = new Vue({
    el: "#app",
    data: {
        dataArr: [
            {
                name: "江昀庭 Eden",
                email: "eden.chiang@friendo.com.tw",
                group: "1",
                identity: "壞孩子",
                number: "1",
                reason: "總是穿全身黑"
            },
            {
                name: "林佳蓁 Phoebe",
                email: "phoebe.lin@friendo.com.tw",
                group: "1",
                identity: "壞孩子",
                number: "2",
                reason: "一個月不小心請兩次生理假"
            },
            {
                name: "詹曜年 Andy",
                email: "andy@friendo.com.tw",
                group: "1",
                identity: "壞孩子",
                number: "3",
                reason: "亂吃飯亂喝酒，把胃操壞"
            },
            {
                name: "鍾子瑄 Crystal",
                email: "crystal.chung@friendo.com.tw",
                group: "1",
                identity: "壞孩子",
                number: "4",
                reason: "桌子太亂"
            },
            {
                name: "許力文 sullivan hsu",
                email: "sullivan.hsu@friendo.com.tw",
                group: "1",
                identity: "壞孩子",
                number: "5",
                reason: "一天吃六餐"
            },
            {
                name: "胡欣怡 Connie",
                email: "connie.hu@spring-trees.com",
                group: "1",
                identity: "壞孩子",
                number: "6",
                reason: "面試只找帥哥美女"
            },
            {
                name: "鄧雅瑄 Mandy",
                email: "mandy.deng@spring-trees.com",
                group: "1",
                identity: "壞孩子",
                number: "7",
                reason: "洗碗洗到太晚回家"
            },
            {
                name: "戴詩璇 Sharon",
                email: "sharon.dai@spring-trees.com",
                group: "1",
                identity: "好孩子",
                number: "8",
                reason: "你的ㄎ一ㄤ帶給大家歡樂"
            },
            {
                name: "張嘉純 Nelly",
                email: "nelly.chang@spring-trees.com",
                group: "1",
                identity: "好孩子",
                number: "9",
                reason: "太會帶新人，根本仙女"
            },
            {
                name: "鍾懿 Andy",
                email: "andy.chung@spring-trees.com",
                group: "1",
                identity: "好孩子",
                number: "10",
                reason: "工作手起刀落有效率"
            },
            {
                name: "蘇珈方 Ketty",
                email: "ketty.su@spring-trees.com",
                group: "1",
                identity: "好孩子",
                number: "11",
                reason: "Brief都很清楚簡潔不說模糊話"
            },
            {
                name: "李卓軒 Shane",
                email: "shane.lee@spring-trees.com",
                group: "1",
                identity: "好孩子",
                number: "12",
                reason: "尿尿會洗手"
            },
            {
                name: "陳奕良 Roy",
                email: "roy.chen@spring-trees.com",
                group: "1",
                identity: "好孩子",
                number: "13",
                reason: "常常貢獻下午茶，帶同事聚餐吃好料"
            },
            {
                name: "賴韋傑 Jackey",
                email: "jackey.lai@spring-trees.com",
                group: "1",
                identity: "好孩子",
                number: "14",
                reason: "人家666你就777"
            },
            {
                name: "何翊寧 Ningning",
                email: "ningning.ho@spring-trees.com",
                group: "2",
                identity: "壞孩子",
                number: "1",
                reason: "長得太可愛 壞"
            },
            {
                name: "陳思宜 Sisi",
                email: "sisi.chen@spring-trees.com",
                group: "2",
                identity: "壞孩子",
                number: "2",
                reason: "長得太美太溫柔，就 是 壞"
            },
            {
                name: "林益成 Max",
                email: "max.lin@spring-trees.com",
                group: "2",
                identity: "壞孩子",
                number: "3",
                reason: "每一個建議都是給團隊的新挑戰"
            },
            {
                name: "王彥驊 Ian.wang",
                email: "ian.wang@spring-trees.com",
                group: "2",
                identity: "壞孩子",
                number: "4",
                reason: "補刷卡單都堆到最後一天才上"
            },
            {
                name: "何柏霖 Harry",
                email: "harry.he@friendo.com.tw",
                group: "2",
                identity: "壞孩子",
                number: "5",
                reason: "電腦修半天還修不好"
            },
            {
                name: "蔡侑君 Josephine",
                email: "josephine.tsai@spring-trees.com",
                group: "2",
                identity: "壞孩子",
                number: "6",
                reason: "減肥太成功，害其他女生顯胖"
            },
            {
                name: "蔡少熹 Steven",
                email: "steven.tsai@spring-trees.com",
                group: "2",
                identity: "壞孩子",
                number: "7",
                reason: "長太高，害其他人對話要抬頭"
            },
            {
                name: "童于珈 Jamie",
                email: "jamie.tung@spring-trees.com",
                group: "2",
                identity: "好孩子",
                number: "8",
                reason: "有努力早起"
            },
            {
                name: "黃宣棋 Aka",
                email: "maurice.huang@spring-trees.com",
                group: "2",
                identity: "好孩子",
                number: "9",
                reason: "被工程師80都默默承受"
            },
            {
                name: "李昭頤 Chaoyi",
                email: "chaoyi.lee@spring-trees.com",
                group: "2",
                identity: "好孩子",
                number: "10",
                reason: "不畏風寒堅持露腿造福大眾阿嘶"
            },
            {
                name: "李易潔 Alice",
                email: "alice.lee@spring-trees.com",
                group: "2",
                identity: "好孩子",
                number: "11",
                reason: "辣普玩超過30本"
            },
            {
                name: "章元莊 Demian",
                email: "demian.chang@spring-trees.com",
                group: "2",
                identity: "好孩子",
                number: "12",
                reason: "抗寒裝備完整，看了都覺得暖"
            },
            {
                name: "蘇柏鍵 Tommy",
                email: "tommy.su@friendo.com.tw",
                group: "2",
                identity: "好孩子",
                number: "13",
                reason: "定時定量打小孩，公認的好爸爸"
            },
            {
                name: "陳姿惠 Luby",
                email: "luby.chen@spring-trees.com",
                group: "2",
                identity: "好孩子",
                number: "14",
                reason: "無情的上廣告機器"
            },
            {
                name: "駱弘凱 Calvin",
                email: "calvin.lo@spring-trees.com",
                group: "3",
                identity: "壞孩子",
                number: "1",
                reason: "Excel大神!厲害到讓人忌妒"
            },
            {
                name: "楊佳穎 Elsie",
                email: "elsie.yang@spring-trees.com",
                group: "3",
                identity: "壞孩子",
                number: "2",
                reason: "瞪主管"
            },
            {
                name: "曹岱晴 sunny",
                email: "sunny.tsao@spring-trees.com",
                group: "3",
                identity: "壞孩子",
                number: "3",
                reason: "愛麥當勞比愛同事多"
            },
            {
                name: "張宇妘 veronica",
                email: "veronica.chang@friendo.com.tw",
                group: "3",
                identity: "壞孩子",
                number: "4",
                reason: "桌面不整齊，壞壞"
            },
            {
                name: "曾紀綱 victor.tseng",
                email: "victor.tseng@spring-trees.com",
                group: "3",
                identity: "壞孩子",
                number: "5",
                reason: "上班都在跟同事聊天"
            },
            {
                name: "許棕垣 Bruce",
                email: "bruce.hsu@spring-trees.com",
                group: "3",
                identity: "壞孩子",
                number: "6",
                reason: "上班都在看妹"
            },
            {
                name: "黃靖貽 Eva",
                email: "eva.huang@spring-trees.com",
                group: "3",
                identity: "好孩子",
                number: "7",
                reason: "都會帶橘子來分給同事"
            },
            {
                name: "張鈺欣 Rima",
                email: "rima.chang@spring-trees.com",
                group: "3",
                identity: "好孩子",
                number: "8",
                reason: "美食不採雷水水"
            },
            {
                name: "陳姿伶 Tzuling",
                email: "tzu.ling.chen@friendo.com.tw",
                group: "3",
                identity: "好孩子",
                number: "9",
                reason: "每天下班準時填Tick不拖延"
            },
            {
                name: "楊懿庭 Eating",
                email: "eating.yang@spring-trees.com",
                group: "3",
                identity: "好孩子",
                number: "10",
                reason: "愛地球，都會用環保餐具"
            },
            {
                name: "蕭羽彤 Sonia",
                email: "sonia.hsiao@friendo.com.tw",
                group: "3",
                identity: "好孩子",
                number: "11",
                reason: "喝酒超carry，家裡有大酒櫃"
            },
            {
                name: "蘇翊安 Ian",
                email: "ian.su@spring-trees.com",
                group: "3",
                identity: "好孩子",
                number: "12",
                reason: "有你在的地方就有陽光～陽光boy"
            },
            {
                name: "李宗勳 Tom",
                email: "tom.lee@friendo.com.tw",
                group: "4",
                identity: "壞孩子",
                number: "1",
                reason: "上班都在看股票"
            },
            {
                name: "葉家彤 Goldie",
                email: "goldie.yeh@spring-trees.com",
                group: "4",
                identity: "壞孩子",
                number: "2",
                reason: "房子太多"
            },
            {
                name: "王亭鈞 Gary",
                email: "gary.wang@spring-trees.com",
                group: "4",
                identity: "壞孩子",
                number: "3",
                reason: "講的幹話比吃的飯還多"
            },
            {
                name: "張麗卿 Tiffany",
                email: "tiffany.chang@spring-trees.com",
                group: "4",
                identity: "壞孩子",
                number: "4",
                reason: "業績太好"
            },
            {
                name: "謝孟瑋 Michelle",
                email: "michelle.hsieh@spring-trees.com",
                group: "4",
                identity: "壞孩子",
                number: "5",
                reason: "太好相處"
            },
            {
                name: "陳渝寰 Howard",
                email: "howard.chen@spring-trees.com",
                group: "4",
                identity: "壞孩子",
                number: "6",
                reason: "再偷懶不運動啊!"
            },
            {
                name: "吳昱萱 Wendy",
                email: "wendy.wu@spring-trees.com",
                group: "4",
                identity: "好孩子",
                number: "7",
                reason: "想吃麥當勞但走錯進到肯德基後忍痛改吃肯德基"
            },
            {
                name: "謝孟喬 Jo",
                email: "jo.hsieh@spring-trees.com",
                group: "4",
                identity: "好孩子",
                number: "8",
                reason: "笑聲非常誠懇"
            },
            {
                name: "曾子芸 Mindy",
                email: "mindy.tseng@friendo.com.tw",
                group: "4",
                identity: "好孩子",
                number: "9",
                reason: "實習生被當成正職在用，CP值高"
            },
            {
                name: "黃亭雲 Phoebe",
                email: "phoebe.huang@friendo.com.tw",
                group: "4",
                identity: "好孩子",
                number: "10",
                reason: "上班chill嗨嗨"
            },
            {
                name: "林怡岑 Tsen",
                email: "tsen.lin@friendo.com.tw",
                group: "4",
                identity: "好孩子",
                number: "11",
                reason: "每張Tick都快速做完"
            },
            {
                name: "張懷澤 Mio",
                email: "mio.chang@friendo.com.tw",
                group: "4",
                identity: "好孩子",
                number: "12",
                reason: "總是幫同事擦屁股"
            },
            {
                name: "高瑞伶 Ida",
                email: "ida.kao@friendo.com.tw",
                group: "5",
                identity: "壞孩子",
                number: "1",
                reason: "一直去吃探長便當"
            },
            {
                name: "葉家瑋 Phoebe",
                email: "phoebe.yeh@spring-trees.com",
                group: "5",
                identity: "壞孩子",
                number: "2",
                reason: "太常去爬山閃別人"
            },
            {
                name: "簡彤芸 Tungyun",
                email: "tungyun.chien@spring-trees.com",
                group: "5",
                identity: "壞孩子",
                number: "3",
                reason: "電腦螢幕很髒都不擦"
            },
            {
                name: "廖冠皓 Terry",
                email: "terry.liao@spring-trees.com",
                group: "5",
                identity: "壞孩子",
                number: "4",
                reason: "長得太年輕"
            },
            {
                name: "葉湑 Nancy",
                email: "nancy.yeh@spring-trees.com",
                group: "5",
                identity: "壞孩子",
                number: "5",
                reason: "吃難吃的微波食品"
            },
            {
                name: "陳重任 Bruce",
                email: "bruce.chen@friendo.com.tw",
                group: "5",
                identity: "壞孩子",
                number: "6",
                reason: "太帥太安靜"
            },
            {
                name: "翟書郁 Soeyou",
                email: "soeyou.chai@spring-trees.com",
                group: "5",
                identity: "好孩子",
                number: "7",
                reason: "桌上咖啡機的咖啡會分同事喝"
            },
            {
                name: "莊清貴 Akuei",
                email: "akuei.jan@spring-trees.com",
                group: "5",
                identity: "好孩子",
                number: "8",
                reason: "協助發掘午餐CP值王者美食"
            },
            {
                name: "吳峻毅 Louis",
                email: "louis.wu@spring-trees.com",
                group: "5",
                identity: "好孩子",
                number: "9",
                reason: "外出都會帶行動電源借朋友"
            },
            {
                name: "林詩涵 Kiki",
                email: "kiki.lin@spring-trees.com",
                group: "5",
                identity: "好孩子",
                number: "10",
                reason: "執企百科書"
            },
            {
                name: "秦民	Michael",
                email: "michael.chin@spring-trees.com",
                group: "5",
                identity: "好孩子",
                number: "11",
                reason: "自己帶便當、環保愛地球"
            },
            {
                name: "邱泯瑄 Kelly",
                email: "kelly.chiu@spring-trees.com",
                group: "5",
                identity: "好孩子",
                number: "12",
                reason: "提醒大家吃飯打卡填回報，根本太貼心"
            },
            {
                name: "柯彥汝 Ann",
                email: "ann.ko@friendo.com.tw",
                group: "6",
                identity: "壞孩子",
                number: "1",
                reason: "禮拜一早上都身體不適"
            },
            {
                name: "黃瀚毅 Martian",
                email: "martian.huang@spring-trees.com",
                group: "6",
                identity: "壞孩子",
                number: "2",
                reason: "長得太像胡瓜或杰倫或東尼大木"
            },
            {
                name: "林宇謙 Cindy",
                email: "cindy.lin@spring-trees.com",
                group: "6",
                identity: "壞孩子",
                number: "3",
                reason: "明明一樣叫Cindy卻比大的美，壞"
            },
            {
                name: "蔡媛如 Claire",
                email: "claire.tsai@friendo.com.tw",
                group: "6",
                identity: "壞孩子",
                number: "4",
                reason: "不當本次活動主持人 給你100個怒"
            },
            {
                name: "周延霖 Red",
                email: "red.chou@spring-trees.com",
                group: "6",
                identity: "壞孩子",
                number: "5",
                reason: "晚餐都吃會誘惑別人的便當"
            },
            {
                name: "張婕妤 madeline",
                email: "madeline.chang@friendo.com.tw",
                group: "6",
                identity: "壞孩子",
                number: "6",
                reason: "吃布丁不舔上蓋"
            },
            {
                name: "邱淑娟 Lavender",
                email: "lavender.chiou@friendo.com.tw",
                group: "6",
                identity: "好孩子",
                number: "7",
                reason: "耐心回應每一個奧客"
            },
            {
                name: "陳柏彣 Mickey",
                email: "mickey.chen@spring-trees.com",
                group: "6",
                identity: "好孩子",
                number: "8",
                reason: "長期提供免費酒水無怨無悔"
            },
            {
                name: "盧家誠 Jackson",
                email: "jackson.lu@spring-trees.com",
                group: "6",
                identity: "好孩子",
                number: "9",
                reason: "乖乖回來台灣當兵的有為青年"
            },
            {
                name: "婁欣愉 Cindy",
                email: "cindy.lou@spring-trees.com",
                group: "6",
                identity: "好孩子",
                number: "10",
                reason: "只要電鍋髒了我都願意清洗"
            },
            {
                name: "鄭景榮 George",
                email: "george.cheng@spring-trees.com",
                group: "6",
                identity: "好孩子",
                number: "11",
                reason: "準時發薪水、發年終"
            },
            {
                name: "張凱捷 Kidd",
                email: "kidd.chang@spring-trees.com",
                group: "6",
                identity: "好孩子",
                number: "12",
                reason: "用於幫助喝奶茶的同事不採雷"
            },
            {
                name: "張妍	April",
                email: "april.chang@spring-trees.com",
                group: "7",
                identity: "壞孩子",
                number: "1",
                reason: "圖層沒整理妳壞啊!"
            },
            {
                name: "陳淑敏 Sherry",
                email: "sherry.chen@spring-trees.com",
                group: "7",
                identity: "壞孩子",
                number: "2",
                reason: "誘拐客戶、壓榨同事"
            },
            {
                name: "陳柏安 Barry",
                email: "barry.chen@friendo.com.tw",
                group: "7",
                identity: "壞孩子",
                number: "3",
                reason: "忤逆學長學姐"
            },
            {
                name: "吳佩娟 Yuni",
                email: "yuni.wu@spring-trees.com",
                group: "7",
                identity: "壞孩子",
                number: "4",
                reason: "不吃蔥、芹菜、大蒜、洋蔥、香菜等太多了"
            },
            {
                name: "温宗翰 Henry Wen",
                email: "henry.wen@friendo.com.tw",
                group: "7",
                identity: "壞孩子",
                number: "5",
                reason: "Tick都亂填"
            },
            {
                name: "黃筱玲 Aria",
                email: "aria.huang@spring-trees.com",
                group: "7",
                identity: "壞孩子",
                number: "6",
                reason: "用零食把同事餵胖"
            },
            {
                name: "張文燈 Winston",
                email: "winston.chang@spring-trees.com",
                group: "7",
                identity: "好孩子",
                number: "7",
                reason: "騎單車上班、節能減碳"
            },
            {
                name: "羅筱筑 Laura",
                email: "laura.lo@friendo.com.tw",
                group: "7",
                identity: "好孩子",
                number: "8",
                reason: "充電假都沒在充電"
            },
            {
                name: "林益宏 Jerry",
                email: "jerry.lin@spring-trees.com",
                group: "7",
                identity: "好孩子",
                number: "9",
                reason: "北上協助哥哥整理辦公室"
            },
            {
                name: "張仟宜 Sierra",
                email: "sierra.chang@spring-trees.com",
                group: "7",
                identity: "好孩子",
                number: "10",
                reason: "找健身房找得很勤"
            },
            {
                name: "谷志剛 Isse",
                email: "isse.ku@spring-trees.com",
                group: "7",
                identity: "好孩子",
                number: "11",
                reason: "刻苦耐勞，節儉樸實的爺爺"
            },
            {
                name: "張茂勇 Zola",
                email: "zola.chang@spring-trees.com",
                group: "7",
                identity: "好孩子",
                number: "12",
                reason: "從不私下說老闆壞話"
            },
            {
                name: "廖晨媛 Chloe",
                email: "chenyuan.liao@spring-trees.com",
                group: "8",
                identity: "壞孩子",
                number: "1",
                reason: "上班鬼吼鬼叫"
            },
            {
                name: "黃薇	Vivian",
                email: "vivian.huang@spring-trees.com",
                group: "8",
                identity: "壞孩子",
                number: "2",
                reason: "提案寫太好，害同事壓力很大"
            },
            {
                name: "馮政賢 Jerry",
                email: "jerry.fang@spring-trees.com",
                group: "8",
                identity: "壞孩子",
                number: "3",
                reason: "對下屬很兇"
            },
            {
                name: "蘇湘文 Xians",
                email: "xians.su@spring-trees.com",
                group: "8",
                identity: "壞孩子",
                number: "4",
                reason: "上班都在玩FANTASY"
            },
            {
                name: "朱曉芸 Nicki",
                email: "nicki.chu@spring-trees.com",
                group: "8",
                identity: "壞孩子",
                number: "5",
                reason: "包裹很常有朱曉芸的名字"
            },
            {
                name: "李郁凱 Kai",
                email: "kai.lee@spring-trees.com",
                group: "8",
                identity: "壞孩子",
                number: "6",
                reason: "自助餐都會夾魚給人家當盤子"
            },
            {
                name: "李昕蓉 Sally",
                email: "sally.lee@spring-trees.com",
                group: "8",
                identity: "好孩子",
                number: "7",
                reason: "喝水都會有鳥叫聲，優的"
            },
            {
                name: "楊晨	Cassi",
                email: "cassi.yang@spring-trees.com",
                group: "8",
                identity: "好孩子",
                number: "8",
                reason: "太票釀太會做甜點"
            },
            {
                name: "游礎澦 Trestin",
                email: "trestin.yu@spring-trees.com",
                group: "8",
                identity: "好孩子",
                number: "9",
                reason: "Ketty媽媽認證的小帥哥"
            },
            {
                name: "陳嘉蓮 Amanda",
                email: "amanda.chen@friendo.com.tw",
                group: "8",
                identity: "好孩子",
                number: "10",
                reason: "準時上下班"
            },
            {
                name: "戴其萱 Dolly",
                email: "dolly.tai@spring-trees.com",
                group: "8",
                identity: "好孩子",
                number: "11",
                reason: "有乖乖聽醫生說的話"
            },
            {
                name: "陳傑	Jie",
                email: "jie.chen@spring-trees.com",
                group: "8",
                identity: "好孩子",
                number: "12",
                reason: "支持國牌汽水維大力"
            },
            {
                name: "洪卉俞 Claire",
                email: "claire.hong@spring-trees.com",
                group: "9",
                identity: "壞孩子",
                number: "1",
                reason: "沒好好照顧植物"
            },
            {
                name: "陳怡馨 Josie",
                email: "josie.chen@spring-trees.com",
                group: "9",
                identity: "壞孩子",
                number: "2",
                reason: "太早來上班，給同事壓力"
            },
            {
                name: "邱子涵 Dino",
                email: "dino.chiu@spring-trees.com",
                group: "9",
                identity: "壞孩子",
                number: "3",
                reason: "講話聲音太好聽了，害大家有壓力"
            },
            {
                name: "潘孟慈 Betty",
                email: "betty.pan@friendo.com.tw",
                group: "9",
                identity: "壞孩子",
                number: "4",
                reason: "早餐的飲料都放到下午沒喝完"
            },
            {
                name: "陳愷翎 kailin",
                email: "kailin.chen@friendo.com.tw",
                group: "9",
                identity: "壞孩子",
                number: "5",
                reason: "幫別人拍照鏡頭都不擦的"
            },
            {
                name: "李靜 Lillian",
                email: "lillian.li@spring-trees.com",
                group: "9",
                identity: "壞孩子",
                number: "6",
                reason: "當個無情的加班機器"
            },
            {
                name: "羅芷榕 Sandy",
                email: "sandy.lo@spring-trees.com",
                group: "9",
                identity: "好孩子",
                number: "7",
                reason: "中午都會帶便當，當個健康的人"
            },
            {
                name: "黃惠慈 Grace",
                email: "grace.huang@spring-trees.com",
                group: "9",
                identity: "好孩子",
                number: "8",
                reason: "都很早到公司"
            },
            {
                name: "黃家琳 Jacqueline",
                email: "jacqueline.huang@spring-trees.com",
                group: "9",
                identity: "好孩子",
                number: "9",
                reason: "太會做貼圖"
            },
            {
                name: "林守哲 Beatronic",
                email: "beatronic.lin@spring-trees.com",
                group: "9",
                identity: "好孩子",
                number: "10",
                reason: "不挑食的好孩子"
            },
            {
                name: "張碧麗 Belee",
                email: "belee.chang@spring-trees.com",
                group: "9",
                identity: "好孩子",
                number: "11",
                reason: "擁有奶奶般的慈祥"
            },
            {
                name: "吳倧億 Evan",
                email: "evan.wu@spring-trees.com",
                group: "9",
                identity: "好孩子",
                number: "12",
                reason: "露營都會揪團"
            },
            {
                name: "張旭鋒 Lucas",
                email: "lucas.chang@spring-trees.com",
                group: "10",
                identity: "壞孩子",
                number: "1",
                reason: "谷哥的徒弟"
            },
            {
                name: "周麗玲 Lyla",
                email: "lyla.chou@spring-trees.com",
                group: "10",
                identity: "壞孩子",
                number: "2",
                reason: "罐罐給太少了!"
            },
            {
                name: "王昱涵 Eva",
                email: "eva.wang@friendo.com.tw",
                group: "10",
                identity: "壞孩子",
                number: "3",
                reason: "一個月不小心請兩次生理假"
            },
            {
                name: "邱暐庭 Angela",
                email: "angela.chiu@friendo.com.tw",
                group: "10",
                identity: "壞孩子",
                number: "4",
                reason: "苗條大胃王"
            },
            {
                name: "楊淑惠 Helen",
                email: "helen.yang@spring-trees.com",
                group: "10",
                identity: "壞孩子",
                number: "5",
                reason: "長得跟某同事太像，容易讓人認錯"
            },
            {
                name: "邱育泓 Jimmy Chiu",
                email: "jimmy.chiu@spring-trees.com",
                group: "10",
                identity: "壞孩子",
                number: "6",
                reason: "辦公室總是看不到人"
            },
            {
                name: "謝德瑾 Pillow",
                email: "pillow.hsieh@spring-trees.com",
                group: "10",
                identity: "好孩子",
                number: "7",
                reason: "英文太好"
            },
            {
                name: "郭庭豪 Kevin",
                email: "kevin.kuo@spring-trees.com",
                group: "10",
                identity: "好孩子",
                number: "8",
                reason: "伙食費很省節約愛地球"
            },
            {
                name: "何季朋 Frank",
                email: "frank.ho@spring-trees.com",
                group: "10",
                identity: "好孩子",
                number: "9",
                reason: "短褲太短水晶太多"
            },
            {
                name: "彭定國 River",
                email: "river.peng@spring-trees.com",
                group: "10",
                identity: "好孩子",
                number: "10",
                reason: "太會唱紅鞋女孩"
            },
            {
                name: "余廷昇 Jordan",
                email: "jordan.yu@spring-trees.com",
                group: "10",
                identity: "好孩子",
                number: "11",
                reason: "守護瀰豆子的男人"
            },
            {
                name: "楊美倫 Alice",
                email: "alice.yang@spring-trees.com",
                group: "10",
                identity: "好孩子",
                number: "12",
                reason: "超有自制力，太晚不吃東西"
            },
        ],
        email: "",
        resData: null,
        name: "",
        step: "intro",
        readme: false,
        popup: false,
        loading: false
    },
    methods: {
        introAni() {
            let sec = 0.3
            let tl = gsap.timeline({delay: 0.6})
                tl.from(".introbox .bd", {
                    y: 300,
                    opacity: 0,
                    duration: 6
                })
        },
        kvAni() {
            let sec = 0.3
            let tl = gsap.timeline({delay: 0.3})
                tl.from(".slogn", {
                    opacity: 0,
                    duration: sec*2
                })
                tl.from(".inputbox", {
                    y: 100,
                    opacity: 0,
                    duration: sec*2
                }, "-=0.3")
                tl.from(".events .btn", {
                    y: 100,
                    opacity: 0,
                    duration: sec*2
                }, "-=0.6")
        },
        send() {
            let temparr = [];
            for(let i=0; i<this.dataArr.length; i++) {
                // temparr.push();
                console.log(this.dataArr[i].email);
                temparr.push(this.dataArr[i].email);
            }
            // console.log(temparr.includes("alice.yang@spring-trees.com"));
            if(temparr.includes(this.email)) {
                this.loading = true;
                this.dataArr.forEach(el => {
                    if(this.email.toLowerCase() === el.email) {
                        this.resData = el;
                        this.step = "result";
                        this.$nextTick(()=> {
                            if(this.resData.identity === "壞孩子") {
                                document.querySelector(".step2 .content").classList.add("badresult")
                            };
                            setTimeout(() => {
                                this.loading = false;
                            }, 3000)
                        })
                    }
                });
            } else {
                alert("您輸入的email有誤");
                return false
            }
            
            // for(let i=0; i<this.dataArr.length; i++) {
            //     if(this.email.toLowerCase() === this.dataArr[i].email) {
            //         this.resData = this.dataArr[i];
            //         this.step = "2"
            //         return false
            //     } else {
            //         alert("您輸入的email有誤");
            //         return false
            //     }
            // }
        },
        stepPage(page) {
            if(page==="kv") {
                this.step = page;
                this.$nextTick(()=> {
                    this.kvAni()
                })
            }
        },
        openReadme() {
            this.popup = true
        }
    },
    mounted: function() {
        // this.projApi.post(uri, data)  //Ex
        this.introAni()
    }
})
