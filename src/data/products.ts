import type { Product } from "../types";

let n = 0;
const id = (slug: string) => slug;

export const products: Product[] = [
  // Sugar Free & Healthy
  {
    id: id("dragon-smoothie"), categoryId: "healthy",
    name: { ar: "دراكون سموذي", en: "Dragon Smoothie" },
    description: { ar: "مزيج منعش من فاكهة التنين بقوام ناعم محضر من دون سكر مضاف", en: "A refreshing dragon fruit blend, smooth and naturally sweet, no added sugar." },
    price: 7500, image: "assets/products/smoothie.png", tags: ["healthy"], available: true, sortOrder: n++,
  },
  {
    id: id("fresh-sunset"), categoryId: "healthy",
    name: { ar: "فريش سنست", en: "Fresh Sunset" },
    description: { ar: "مزيج منعش من البرتقال الأحمر والبرتقال العادي بحلاوة طبيعية وحموضة متوازنة من دون إضافة أي سكر", en: "Blood orange and orange blend, naturally sweet and balanced, no added sugar." },
    price: 7000, image: "assets/products/orange-juice.png", tags: ["healthy"], available: true, sortOrder: n++,
  },
  {
    id: id("passion-cloud"), categoryId: "healthy",
    name: { ar: "باشن كلاود", en: "Passion Cloud" },
    description: { ar: "مزيج منعش من باشن فروت والليمون الطازج والنعناع بنكهة استوائية وحموضة متوازنة من دون سكر مضاف", en: "Passion fruit, fresh lemon and mint, tropical and balanced, no added sugar." },
    price: 7000, image: "assets/products/mexican-cooler.png", tags: ["healthy"], available: true, sortOrder: n++,
  },
  {
    id: id("cherry-berry"), categoryId: "healthy",
    name: { ar: "تشيري بيري", en: "Cherry Berry" },
    price: 7000, image: "assets/products/hibiscus-tea.png", tags: ["healthy"], available: true, sortOrder: n++,
  },

  // Bonsai Signature Tiramisu
  {
    id: id("tiramisu-dark-cookie"), categoryId: "tiramisu",
    name: { ar: "تيراميسو دارك كوكي", en: "Tiramisu Dark Cookie" },
    price: 4500, image: "assets/products/tiramisu.png", tags: ["signature"], available: true, sortOrder: n++,
  },
  {
    id: id("tiramisu-brownie"), categoryId: "tiramisu",
    name: { ar: "تيراميسو براوني", en: "Tiramisu Brownie" },
    price: 5500, image: "assets/products/brownie-icecream.png", tags: ["signature"], available: true, sortOrder: n++,
  },
  {
    id: id("tiramisu-banana-bread"), categoryId: "tiramisu",
    name: { ar: "تيراميسو بنانا بريد", en: "Tiramisu Banana Bread" },
    price: 5000, image: "assets/products/tiramisu.png", tags: ["signature"], available: true, sortOrder: n++,
  },

  // Hot Drinks
  { id: id("espresso-brazilian"), categoryId: "hot-drinks", name: { ar: "اسبرسو برازيلي", en: "Brazilian Espresso" }, description: { ar: "حبوب قهوة اسبريسو مطحونة وماء.", en: "Ground espresso beans and water." }, price: 3500, image: "assets/products/espresso-single.png", available: true, sortOrder: n++ },
  { id: id("espresso-ethiopian"), categoryId: "hot-drinks", name: { ar: "اسبرسو اثيوبي", en: "Ethiopian Espresso" }, description: { ar: "حبوب قهوة اسبريسو مطحونة وماء.", en: "Ground espresso beans and water." }, price: 3500, image: "assets/products/espresso-double.png", available: true, sortOrder: n++ },
  { id: id("caramel-latte-hot"), categoryId: "hot-drinks", name: { ar: "كراميل لاتيه", en: "Caramel Latte" }, price: 5500, image: "assets/products/caramel-macchiato.png", available: true, sortOrder: n++ },
  { id: id("hot-berlin-latte"), categoryId: "hot-drinks", name: { ar: "لاتيه برلين حار", en: "Hot Berlin Latte" }, description: { ar: "دفء بطابع أوروبي نكهة غنية ولمسة حلاوة تخلي كل رشفة إلها طعم", en: "European-style warmth with a rich, lightly sweet flavor in every sip." }, price: 5500, image: "assets/products/hazelnut-latte.png", available: true, sortOrder: n++ },
  { id: id("longo"), categoryId: "hot-drinks", name: { ar: "لونجو", en: "Lungo" }, description: { ar: "قهوة تحضر من حبوب قهوة الاسبريسو وماء.", en: "Brewed from espresso beans and water." }, price: 4000, image: "assets/products/espresso-double.png", available: true, sortOrder: n++ },
  { id: id("americano"), categoryId: "hot-drinks", name: { ar: "امريكانو", en: "Americano" }, description: { ar: "اسبريسو مضاف اليه ماء.", en: "Espresso with added water." }, price: 4000, image: "assets/products/americano.png", available: true, sortOrder: n++ },
  { id: id("long-black"), categoryId: "hot-drinks", name: { ar: "لونك بلاك", en: "Long Black" }, description: { ar: "قهوة تحضر من حبوب قهوة الاسبريسو وماء.", en: "Brewed from espresso beans and water." }, price: 4000, image: "assets/products/americano.png", available: true, sortOrder: n++ },
  { id: id("cafe-latte"), categoryId: "hot-drinks", name: { ar: "كافيه لاتيه", en: "Café Latte" }, description: { ar: "إسبريسو, وحليب مبخر.", en: "Espresso and steamed milk." }, price: 4500, image: "assets/products/classic-latte.png", available: true, sortOrder: n++ },
  { id: id("cappuccino"), categoryId: "hot-drinks", name: { ar: "كابتشينو", en: "Cappuccino" }, description: { ar: "قهوة اسبريسو، حليب، رغوة حليب.", en: "Espresso, milk, milk foam." }, price: 4500, image: "assets/products/cappuccino.png", available: true, sortOrder: n++ },
  { id: id("flat-white"), categoryId: "hot-drinks", name: { ar: "فلات وايت", en: "Flat White" }, description: { ar: "دبل اسبريسو, رغوة حليب وحليب مبخر.", en: "Double espresso, milk foam and steamed milk." }, price: 4500, image: "assets/products/flat-white.png", available: true, sortOrder: n++ },
  { id: id("cortado"), categoryId: "hot-drinks", name: { ar: "كورتادو", en: "Cortado" }, description: { ar: "قهوة اسبريسو, رغوة حليب وحليب مبخر.", en: "Espresso, milk foam and steamed milk." }, price: 4500, image: "assets/products/cortado.png", available: true, sortOrder: n++ },
  { id: id("mocha"), categoryId: "hot-drinks", name: { ar: "موكا", en: "Mocha" }, description: { ar: "إسبريسو، كاكاو، حليب ورغوة حليب.", en: "Espresso, cocoa, milk and milk foam." }, price: 5000, image: "assets/products/mocha.png", available: true, sortOrder: n++ },
  { id: id("salted-caramel-latte-hot"), categoryId: "hot-drinks", name: { ar: "سولتد كراميل لاتيه", en: "Salted Caramel Latte" }, description: { ar: "اسبريسو, حليب, رغوة حليب وسيروب كراميل مملح.", en: "Espresso, milk, milk foam and salted caramel syrup." }, price: 5500, image: "assets/products/caramel-macchiato.png", available: true, sortOrder: n++ },
  { id: id("coconut-latte-hot"), categoryId: "hot-drinks", name: { ar: "جوز الهند لاتيه", en: "Coconut Latte" }, description: { ar: "اسبريسو, حليب, رغوة حليب وسيروب الجوز هند.", en: "Espresso, milk, milk foam and coconut syrup." }, price: 5500, image: "assets/products/coconut-latte-hot.png", available: true, sortOrder: n++ },
  { id: id("bonsai-latte-hot"), categoryId: "hot-drinks", name: { ar: "بونساي لاتيه", en: "Bonsai Latte" }, description: { ar: "اسبريسو, حليب ورغوة حليب.", en: "Espresso, milk and milk foam." }, price: 5500, image: "assets/products/spanish-latte.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("italian-latte-hot"), categoryId: "hot-drinks", name: { ar: "ايتاليان لاتيه", en: "Italian Latte" }, description: { ar: "اسبريسو ايطالي, حليب ورغوة حليب.", en: "Italian espresso, milk and milk foam." }, price: 5500, image: "assets/products/vanilla-latte.png", available: true, sortOrder: n++ },
  { id: id("turkish-plain"), categoryId: "hot-drinks", name: { ar: "تركية سادة", en: "Turkish Coffee - Plain" }, description: { ar: "قهوة تركية وماء.", en: "Turkish coffee and water." }, price: 3000, image: "assets/products/turkish-coffee.png", available: true, sortOrder: n++ },
  { id: id("turkish-cardamom"), categoryId: "hot-drinks", name: { ar: "تركية مع هيل", en: "Turkish Coffee with Cardamom" }, description: { ar: "قهوة تركية, هيل وماء تقدم مع شوكولاتة.", en: "Turkish coffee, cardamom and water, served with chocolate." }, price: 3000, image: "assets/products/french-coffee.png", available: true, sortOrder: n++ },

  // Iced Coffee
  { id: id("saffron-latte"), categoryId: "iced-coffee", name: { ar: "لاتيه زعفران", en: "Saffron Latte" }, description: { ar: "انتعاش مخملي بنفحات شرقية فاخرة ولمسة ذهبية تترك مذاقا لا ينسى", en: "Velvety refreshment with luxurious oriental notes and a golden touch." }, price: 6500, image: "assets/products/iced-flavored-latte.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("iced-latte-classic"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه كلاسيك", en: "Classic Iced Latte" }, description: { ar: "إسبريسو، سكر وحليب مبخر", en: "Espresso, sugar and steamed milk." }, price: 4500, image: "assets/products/iced-latte-classic.png", available: true, sortOrder: n++ },
  { id: id("iced-latte-bonsai-signature"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه بونساي سكنجر", en: "Bonsai Signature Iced Latte" }, description: { ar: "مزيج بارد بتوقيع بونساي قوام مخملي ونكهة متوازنة", en: "A cold blend signed by Bonsai, velvety and balanced." }, price: 5500, image: "assets/products/signature-skenger.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("iced-salted-caramel"), categoryId: "iced-coffee", name: { ar: "ايس سولتد كراميل", en: "Iced Salted Caramel" }, description: { ar: "إسبريسو، حليب، ثلج وسيروب كراميل مملح", en: "Espresso, milk, ice and salted caramel syrup." }, price: 5500, image: "assets/products/iced-flavored-latte.png", available: true, sortOrder: n++ },
  { id: id("iced-caramel-latte"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه كراميل", en: "Iced Caramel Latte" }, price: 5500, image: "assets/products/iced-flavored-latte.png", available: true, sortOrder: n++ },
  { id: id("iced-spanish-latte"), categoryId: "iced-coffee", name: { ar: "ايس سبانش لاتيه", en: "Iced Spanish Latte" }, description: { ar: "إسبريسو، حليب وحليب مكثف محلى", en: "Espresso, milk and sweetened condensed milk." }, price: 5500, image: "assets/products/iced-spanish-latte.png", available: true, sortOrder: n++ },
  { id: id("iced-coconut-latte"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه جوز الهند", en: "Iced Coconut Latte" }, description: { ar: "إسبريسو، حليب، ثلج وسيروب جوز هند", en: "Espresso, milk, ice and coconut syrup." }, price: 5500, image: "assets/products/iced-latte-classic.png", available: true, sortOrder: n++ },
  { id: id("iced-mango-latte"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه مانجو", en: "Iced Mango Latte" }, description: { ar: "إسبريسو، حليب، ثلج و سيروب مانجو", en: "Espresso, milk, ice and mango syrup." }, price: 5500, image: "assets/products/iced-flavored-latte.png", available: true, sortOrder: n++ },
  { id: id("iced-blueberry-latte"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه بلوبيري", en: "Iced Blueberry Latte" }, description: { ar: "إسبريسو، حليب، ثلج و سيروب بلوبيري", en: "Espresso, milk, ice and blueberry syrup." }, price: 5500, image: "assets/products/iced-flavored-latte.png", available: true, sortOrder: n++ },
  { id: id("iced-latte-bonsai"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه بونساي", en: "Iced Bonsai Latte" }, description: { ar: "سيروب بونساي خاص، حليب، ثلج وإسبريسو", en: "Signature Bonsai syrup, milk, ice and espresso." }, price: 5500, image: "assets/products/signature-skenger.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("iced-italian-latte"), categoryId: "iced-coffee", name: { ar: "ايس ايتاليان لاتيه", en: "Iced Italian Latte" }, description: { ar: "سيروب ايتاليان،حليب، ثلج وإسبريسو", en: "Italian syrup, milk, ice and espresso." }, price: 5500, image: "assets/products/iced-spanish-latte.png", available: true, sortOrder: n++ },
  { id: id("lotus-frappe"), categoryId: "iced-coffee", name: { ar: "لوتس فرابيه", en: "Lotus Frappé" }, description: { ar: "لوتس، قهوة، حليب، ثلج وكريمة مخفوقة", en: "Lotus, coffee, milk, ice and whipped cream." }, price: 5500, image: "assets/products/milkshake.png", available: true, sortOrder: n++ },
  { id: id("iced-americano"), categoryId: "iced-coffee", name: { ar: "امريكانو مثلج", en: "Iced Americano" }, description: { ar: "إسبريسو مضاف اليه ثلج وماء", en: "Espresso with added ice and water." }, price: 4500, image: "assets/products/iced-americano.png", available: true, sortOrder: n++ },
  { id: id("iced-berlin-latte"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه برلين", en: "Iced Berlin Latte" }, description: { ar: "سيروب برلين، حليب، ثلج وإسبريسو", en: "Berlin syrup, milk, ice and espresso." }, price: 5500, image: "assets/products/iced-flavored-latte.png", available: true, sortOrder: n++ },
  { id: id("iced-lavender-latte"), categoryId: "iced-coffee", name: { ar: "ايس لاتيه لافندر", en: "Iced Lavender Latte" }, description: { ar: "سيروب لافندر، حليب، ثلج وإسبريسو", en: "Lavender syrup, milk, ice and espresso." }, price: 5500, image: "assets/products/iced-pistachio-latte.png", available: true, sortOrder: n++ },
  { id: id("chocolate-frappe"), categoryId: "iced-coffee", name: { ar: "جوكلت فرابيه", en: "Chocolate Frappé" }, description: { ar: "قهوة إسبريسو، حليب، ثلج وصلصة شوكولاتة يقدم مزين بكريمة مخفوقة", en: "Espresso, milk, ice and chocolate sauce, topped with whipped cream." }, price: 5500, image: "assets/products/iced-mocha.png", available: true, sortOrder: n++ },

  // Specialty Coffee
  { id: id("cold-brew-bottle"), categoryId: "specialty-coffee", name: { ar: "زجاجة كولد برو", en: "Cold Brew Bottle" }, description: { ar: "محصول فاخر", en: "Premium harvest." }, price: 8000, image: "assets/products/cold-brew.png", available: true, sortOrder: n++ },
  { id: id("cold-brew-kenyan"), categoryId: "specialty-coffee", name: { ar: "كولد برو كيني", en: "Kenyan Cold Brew" }, price: 7000, image: "assets/products/cold-brew.png", available: true, sortOrder: n++ },
  { id: id("cold-brew-colombian"), categoryId: "specialty-coffee", name: { ar: "كولد برو كولومبي", en: "Colombian Cold Brew" }, price: 7000, image: "assets/products/cold-brew.png", available: true, sortOrder: n++ },
  { id: id("v60"), categoryId: "specialty-coffee", name: { ar: "V60", en: "V60" }, description: { ar: "محاصيل فاخرة ( اثيوبي - كوستريكي - كولمبي )", en: "Premium harvests (Ethiopian - Costa Rican - Colombian)." }, price: 8000, image: "assets/products/pour-over.png", available: true, sortOrder: n++ },
  { id: id("affogato"), categoryId: "specialty-coffee", name: { ar: "افوكاتو", en: "Affogato" }, description: { ar: "ايس كريم فانيلا مع دبل شوت إسبريسو", en: "Vanilla ice cream with a double shot of espresso." }, price: 5000, image: "assets/products/espresso-double.png", available: true, sortOrder: n++ },
  { id: id("b75"), categoryId: "specialty-coffee", name: { ar: "B75", en: "B75" }, description: { ar: "قهوة مركزة", en: "Concentrated coffee." }, price: 6000, image: "assets/products/aeropress.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("espresso-freddo"), categoryId: "specialty-coffee", name: { ar: "إسبريسو فريدو", en: "Espresso Freddo" }, description: { ar: "إسبريسو مخفوق مع ثلج", en: "Shaken espresso with ice." }, price: 4000, image: "assets/products/iced-americano.png", available: true, sortOrder: n++ },
  { id: id("espresso-tobina"), categoryId: "specialty-coffee", name: { ar: "إسبريسو توبينا", en: "Espresso Tobina" }, description: { ar: "امريكانو بارد مع نكهة توت عليق", en: "Iced Americano with raspberry flavor." }, price: 5000, image: "assets/products/iced-americano.png", available: true, sortOrder: n++ },
  { id: id("orange-americano"), categoryId: "specialty-coffee", name: { ar: "Orange Americano", en: "Orange Americano" }, description: { ar: "امريكانو مع عصير برتقال", en: "Americano with orange juice." }, price: 5000, image: "assets/products/signature-skenger.png", available: true, sortOrder: n++ },
  { id: id("espresso-con-panna"), categoryId: "specialty-coffee", name: { ar: "إسبريسو كون بانا", en: "Espresso Con Panna" }, description: { ar: "إسبريسو مغطى بكريمة مخفوقة ناعمة", en: "Espresso topped with soft whipped cream." }, price: 4500, image: "assets/products/espresso-single.png", available: true, sortOrder: n++ },
  { id: id("siphon"), categoryId: "specialty-coffee", name: { ar: "سايفون", en: "Siphon" }, description: { ar: "قهوة معقدة", en: "A complex brewed coffee." }, price: 6000, image: "assets/products/aeropress.png", available: true, sortOrder: n++ },
  { id: id("irish-cream-coffee"), categoryId: "specialty-coffee", name: { ar: "قهوة كريمة أيرلندية", en: "Irish Cream Coffee" }, description: { ar: "إسبريسو مع كريمة مخفوقة", en: "Espresso with whipped cream." }, price: 5500, image: "assets/products/hazelnut-coffee.png", available: true, sortOrder: n++ },
  { id: id("espresso-tonic"), categoryId: "specialty-coffee", name: { ar: "إسبريسو تونيك", en: "Espresso Tonic" }, description: { ar: "إسبريسو مع تونيك وثلج", en: "Espresso with tonic and ice." }, price: 5000, image: "assets/products/iced-americano.png", available: true, sortOrder: n++ },

  // Smoothies
  { id: id("smoothie-mango"), categoryId: "smoothie", name: { ar: "سموثي مانجو", en: "Mango Smoothie" }, description: { ar: "مانجو، ماء، ثلج ومحليات", en: "Mango, water, ice and sweeteners." }, price: 5000, image: "assets/products/smoothie.png", available: true, sortOrder: n++ },
  { id: id("smoothie-strawberry"), categoryId: "smoothie", name: { ar: "سموثي فراولة", en: "Strawberry Smoothie" }, description: { ar: "فراولة، ماء، ثلج ومحليات", en: "Strawberry, water, ice and sweeteners." }, price: 5000, image: "assets/products/smoothie.png", available: true, sortOrder: n++ },
  { id: id("smoothie-pineapple"), categoryId: "smoothie", name: { ar: "سموثي أناناس", en: "Pineapple Smoothie" }, description: { ar: "اناناس، ماء، ثلج ومحليات", en: "Pineapple, water, ice and sweeteners." }, price: 5000, image: "assets/products/smoothie.png", available: true, sortOrder: n++ },
  { id: id("smoothie-kiwi"), categoryId: "smoothie", name: { ar: "سموثي كيوي", en: "Kiwi Smoothie" }, description: { ar: "كيوي، ماء، ثلج ومحليات", en: "Kiwi, water, ice and sweeteners." }, price: 5000, image: "assets/products/smoothie.png", available: true, sortOrder: n++ },
  { id: id("smoothie-subara"), categoryId: "smoothie", name: { ar: "سموثي سوبارا", en: "Subara Smoothie" }, description: { ar: "ليمون، نعناع، ماء، ثلج ومحليات", en: "Lemon, mint, water, ice and sweeteners." }, price: 5500, image: "assets/products/lemon-mint-juice.png", available: true, sortOrder: n++ },

  // Matcha
  { id: id("matcha-latte"), categoryId: "matcha", name: { ar: "ماتشا لاتيه", en: "Matcha Latte" }, description: { ar: "شاي ماتشا مطحون وحليب", en: "Ground matcha tea and milk." }, price: 6500, image: "assets/products/matcha.png", available: true, sortOrder: n++ },
  { id: id("matcha-mango"), categoryId: "matcha", name: { ar: "ماتشا مانجو", en: "Mango Matcha" }, description: { ar: "شاي ماتشا مطحون، سيروب مانجو وحليب", en: "Ground matcha, mango syrup and milk." }, price: 6500, image: "assets/products/matcha.png", available: true, sortOrder: n++ },
  { id: id("matcha-coconut"), categoryId: "matcha", name: { ar: "ماتشا جوز الهند", en: "Coconut Matcha" }, description: { ar: "شاي ماتشا مطحون، سيروب جوز هند وحليب", en: "Ground matcha, coconut syrup and milk." }, price: 6500, image: "assets/products/matcha.png", available: true, sortOrder: n++ },
  { id: id("matcha-strawberry"), categoryId: "matcha", name: { ar: "ماتشا فراولة", en: "Strawberry Matcha" }, description: { ar: "شاي ماتشا مطحون، سيروب فراولة، ثلج وحليب", en: "Ground matcha, strawberry syrup, ice and milk." }, price: 6500, image: "assets/products/matcha.png", available: true, sortOrder: n++ },
  { id: id("matcha-blue"), categoryId: "matcha", name: { ar: "ماتشا بلو", en: "Blue Matcha" }, description: { ar: "شاي ماتشا مطحون, سيروب بلو كاراساو وحليب", en: "Ground matcha, blue curacao syrup and milk." }, price: 6500, image: "assets/products/matcha.png", available: true, sortOrder: n++ },
  { id: id("matcha-vanilla"), categoryId: "matcha", name: { ar: "ماتشا فانيلا", en: "Vanilla Matcha" }, price: 6500, image: "assets/products/matcha.png", available: true, sortOrder: n++ },

  // Mojito
  { id: id("mojito-mixed-berry"), categoryId: "mojito", name: { ar: "موهيتو ميكس توت", en: "Mixed Berry Mojito" }, description: { ar: "سيروب ميكس بيري، اوراق نعناع، شرائح ليمون، ثلج وسفن اب", en: "Mixed berry syrup, mint leaves, lemon slices, ice and 7-Up." }, price: 4500, image: "assets/products/mojito.png", available: true, sortOrder: n++ },
  { id: id("mojito-lavender-sonic"), categoryId: "mojito", name: { ar: "موهيتو لافندر سونيك", en: "Lavender Sonic Mojito" }, description: { ar: "سيروب سونيك، اوراق نعناع، شرائح ليمون، ثلج وسفن اب", en: "Sonic syrup, mint leaves, lemon slices, ice and 7-Up." }, price: 4500, image: "assets/products/mojito.png", available: true, sortOrder: n++ },
  { id: id("mojito-grapefruit"), categoryId: "mojito", name: { ar: "موهيتو جريب فروت", en: "Grapefruit Mojito" }, description: { ar: "سيروب جريب فروت، اوراق نعناع، شرائح ليمون، ثلج وسفن اب", en: "Grapefruit syrup, mint leaves, lemon slices, ice and 7-Up." }, price: 4500, image: "assets/products/mexican-cooler.png", available: true, sortOrder: n++ },
  { id: id("mojito-nariso"), categoryId: "mojito", name: { ar: "موهيتو ناريسو", en: "Nariso Mojito" }, description: { ar: "سيروب ناريسو، اوراق نعناع، شرائح ليمون، ثلج ويوزو", en: "Nariso syrup, mint leaves, lemon slices, ice and yuzu." }, price: 4500, image: "assets/products/mojito.png", available: true, sortOrder: n++ },
  { id: id("mojito-yuzu-blue"), categoryId: "mojito", name: { ar: "موهيتو يوزو بلو", en: "Yuzu Blue Mojito" }, description: { ar: "سيروب بلو كاراساو, اوراق نعناع, شرائح ليمون, ثلج ويوزو", en: "Blue curacao syrup, mint leaves, lemon slices, ice and yuzu." }, price: 4500, image: "assets/products/mojito.png", available: true, sortOrder: n++ },
  { id: id("mojito-black"), categoryId: "mojito", name: { ar: "موهيتو بلاك", en: "Black Mojito" }, price: 5000, image: "assets/products/mojito.png", available: true, sortOrder: n++ },
  { id: id("ozora-citrus"), categoryId: "mojito", name: { ar: "اوزورا سيتوس", en: "Ozora Citrus" }, price: 5000, image: "assets/products/mexican-cooler.png", available: true, sortOrder: n++ },

  // Iced Tea & Iraqi Tea
  { id: id("iced-chai-latte"), categoryId: "iced-tea", name: { ar: "ايس چاي لاتيه", en: "Iced Chai Latte" }, description: { ar: "مزيج كريمي بنفحات دافئة يُقدّم بارداً بتوازن ناعم ومذاق مميز", en: "A creamy blend with warm notes, served cold with a smooth balance." }, price: 4500, image: "assets/products/iced-latte-classic.png", available: true, sortOrder: n++ },
  { id: id("chai-latte"), categoryId: "iced-tea", name: { ar: "چاي لاتيه", en: "Chai Latte" }, description: { ar: "مشروب خريفي دافئ بنكهة غنية وقوام مخملي بلمسة خاصة من بونساي", en: "A warm autumn drink, rich and velvety, with Bonsai's own touch." }, price: 4000, image: "assets/products/tea.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("iced-tea-raspberry"), categoryId: "iced-tea", name: { ar: "ايس تي توت العليق", en: "Raspberry Iced Tea" }, description: { ar: "شاي بارد محلى بنكهة توت", en: "Sweetened cold tea with berry flavor." }, price: 4000, image: "assets/products/iced-tea.png", available: true, sortOrder: n++ },
  { id: id("iced-tea-apple-mix"), categoryId: "iced-tea", name: { ar: "ايس تي ميكس تفاح", en: "Apple Mix Iced Tea" }, description: { ar: "شاي بارد محلى بنكهة تفاح", en: "Sweetened cold tea with apple flavor." }, price: 4000, image: "assets/products/iced-tea.png", available: true, sortOrder: n++ },
  { id: id("iced-tea-lalanki"), categoryId: "iced-tea", name: { ar: "ايس تي لالنكي", en: "Lalanki Iced Tea" }, description: { ar: "شاي بارد محلى بنكهة لالنكي", en: "Sweetened cold tea with lalanki flavor." }, price: 4000, image: "assets/products/iced-tea.png", available: true, sortOrder: n++ },
  { id: id("iced-tea-tropical"), categoryId: "iced-tea", name: { ar: "ايس تي استوائي", en: "Tropical Iced Tea" }, description: { ar: "شاي بارد محلى بنكهات استوائية", en: "Sweetened cold tea with tropical flavors." }, price: 4000, image: "assets/products/iced-tea.png", available: true, sortOrder: n++ },
  { id: id("karkade-splash"), categoryId: "iced-tea", name: { ar: "كركدية سبلاش", en: "Karkade Splash" }, price: 5500, image: "assets/products/hibiscus-tea.png", available: true, sortOrder: n++ },

  // Mocktails
  { id: id("mocktail-ringo"), categoryId: "mocktail", name: { ar: "موكتيل رينجو", en: "Ringo Mocktail" }, description: { ar: "موكتيل مانجو مجففة", en: "Dried mango mocktail." }, price: 5000, image: "assets/products/mexican-cooler.png", available: true, sortOrder: n++ },
  { id: id("mocktail-ficus"), categoryId: "mocktail", name: { ar: "موكتيل فيكوس", en: "Ficus Mocktail" }, description: { ar: "موكتيل فيكوس خاص", en: "Bonsai's own special Ficus mocktail." }, price: 5000, image: "assets/products/mojito.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("mocktail-maldives"), categoryId: "mocktail", name: { ar: "موكتيل مالديف", en: "Maldives Mocktail" }, description: { ar: "موكتيل مالديف بجوز هند", en: "Maldives mocktail with coconut." }, price: 5000, image: "assets/products/mexican-cooler.png", available: true, sortOrder: n++ },
  { id: id("sakura"), categoryId: "mocktail", name: { ar: "ساكورا", en: "Sakura" }, price: 5000, image: "assets/products/hibiscus-tea.png", available: true, sortOrder: n++ },
  { id: id("mizu-bloom"), categoryId: "mocktail", name: { ar: "ميزو بلوم", en: "Mizu Bloom" }, price: 5500, image: "assets/products/mexican-cooler.png", available: true, sortOrder: n++ },
  { id: id("enki-elixir"), categoryId: "mocktail", name: { ar: "ENKI ELIXIR", en: "Enki Elixir" }, price: 5500, image: "assets/products/hibiscus-tea.png", available: true, sortOrder: n++ },

  // Fresh Juice
  { id: id("orange-juice"), categoryId: "fresh-juice", name: { ar: "عصير برتقال", en: "Orange Juice" }, description: { ar: "برتقال طازج، ماء ومحليات", en: "Fresh orange, water and sweeteners." }, price: 4000, image: "assets/products/orange-juice.png", tags: ["healthy"], available: true, sortOrder: n++ },
  { id: id("lemon-mint-juice"), categoryId: "fresh-juice", name: { ar: "عصير ليمون نعناع", en: "Lemon Mint Juice" }, description: { ar: "ليمون طازج، نعناع طازج، ماء ومحليات", en: "Fresh lemon, fresh mint, water and sweeteners." }, price: 4000, image: "assets/products/lemon-mint-juice.png", tags: ["healthy"], available: true, sortOrder: n++ },

  // Filter Coffee
  { id: id("v60-colombian"), categoryId: "filter-coffee", name: { ar: "V60 كولومبي", en: "V60 Colombian" }, price: 6000, image: "assets/products/pour-over.png", available: true, sortOrder: n++ },
  { id: id("v60-colombian-premium"), categoryId: "filter-coffee", name: { ar: "V60 كولومبي فاخر", en: "V60 Colombian Premium" }, price: 8000, image: "assets/products/pour-over.png", available: true, sortOrder: n++ },
  { id: id("v60-kenyan"), categoryId: "filter-coffee", name: { ar: "V60 كولومبي كيني", en: "V60 Kenyan" }, price: 6000, image: "assets/products/pour-over.png", available: true, sortOrder: n++ },
  { id: id("v60-yemeni"), categoryId: "filter-coffee", name: { ar: "V60 يمني", en: "V60 Yemeni" }, price: 8000, image: "assets/products/aeropress.png", available: true, sortOrder: n++ },
  { id: id("v60-costa-rican"), categoryId: "filter-coffee", name: { ar: "V60 كوستريكي", en: "V60 Costa Rican" }, price: 6000, image: "assets/products/pour-over.png", available: true, sortOrder: n++ },

  // Milkshakes
  { id: id("bonsai-shake"), categoryId: "milkshake", name: { ar: "بونساي شيك", en: "Bonsai Shake" }, price: 5500, image: "assets/products/milkshake.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("nariso-shake"), categoryId: "milkshake", name: { ar: "ناريسو شيك", en: "Nariso Shake" }, price: 5500, image: "assets/products/milkshake.png", available: true, sortOrder: n++ },
  { id: id("popcorn-shake"), categoryId: "milkshake", name: { ar: "بوب كورنك شيك", en: "Popcorn Shake" }, price: 5500, image: "assets/products/milkshake.png", available: true, sortOrder: n++ },
  { id: id("pistachio-shake"), categoryId: "milkshake", name: { ar: "بستاشيو شيك", en: "Pistachio Shake" }, price: 6000, image: "assets/products/iced-pistachio-latte.png", available: true, sortOrder: n++ },
  { id: id("oreo-shake"), categoryId: "milkshake", name: { ar: "اوريو شيك", en: "Oreo Shake" }, price: 5500, image: "assets/products/iced-mocha.png", available: true, sortOrder: n++ },
  { id: id("choco-banana"), categoryId: "milkshake", name: { ar: "شوكو بنانا", en: "Choco Banana" }, price: 6000, image: "assets/products/hot-chocolate.png", available: true, sortOrder: n++ },

  // Desserts
  { id: id("san-sebastian"), categoryId: "desserts", name: { ar: "سان سباستيان", en: "San Sebastian" }, description: { ar: "عند تثبيت الطلب اختر لمستك: صوص شوكولا غني او صوص بودنك كريمي بنكهة أغنى", en: "Choose your finish at checkout: rich chocolate sauce or creamy pudding sauce." }, price: 6000, image: "assets/products/san-sebastian.png", available: true, sortOrder: n++ },
  { id: id("san-sebastian-chocolate"), categoryId: "desserts", name: { ar: "سان سابستيان شوكولا", en: "Chocolate San Sebastian" }, price: 6000, image: "assets/products/san-sebastian.png", available: true, sortOrder: n++ },
  { id: id("cup-cake"), categoryId: "desserts", name: { ar: "Cup Cake", en: "Cup Cake" }, price: 4500, image: "assets/products/muffin.png", available: true, sortOrder: n++ },
  { id: id("molten-lava-cake"), categoryId: "desserts", name: { ar: "Molten Chocolate Lava Cake", en: "Molten Chocolate Lava Cake" }, description: { ar: "يسخن لمدة 20 ثانية", en: "Warmed for 20 seconds before serving." }, price: 6000, image: "assets/products/brownie-icecream.png", available: true, sortOrder: n++ },
  { id: id("bonsai-cookies"), categoryId: "desserts", name: { ar: "Bonsai Cookies", en: "Bonsai Cookies" }, description: { ar: "Only at Bonsai", en: "Only at Bonsai" }, price: 4000, image: "assets/products/muffin.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("bonsai-pistachio-cookies"), categoryId: "desserts", name: { ar: "Bonsai Pistachio Cookies", en: "Bonsai Pistachio Cookies" }, price: 3750, image: "assets/products/muffin.png", tags: ["signature"], available: true, sortOrder: n++ },
  { id: id("classic-pecan-cookie"), categoryId: "desserts", name: { ar: "Classic Pecan Cookie", en: "Classic Pecan Cookie" }, price: 3500, image: "assets/products/muffin.png", available: true, sortOrder: n++ },
  { id: id("dark-pecan-cookie"), categoryId: "desserts", name: { ar: "Dark Pecan Cookie", en: "Dark Pecan Cookie" }, price: 3500, image: "assets/products/brownie.png", available: true, sortOrder: n++ },
  { id: id("classic-ny-cookies"), categoryId: "desserts", name: { ar: "كلاسك نيويورك كوكيز", en: "Classic New York Cookies" }, price: 3500, image: "assets/products/muffin.png", available: true, sortOrder: n++ },
  { id: id("dark-cookies"), categoryId: "desserts", name: { ar: "Dark Cookies", en: "Dark Cookies" }, price: 3500, image: "assets/products/brownie.png", available: true, sortOrder: n++ },
  { id: id("chocolate-cookie"), categoryId: "desserts", name: { ar: "Chocolate Cookie", en: "Chocolate Cookie" }, price: 3500, image: "assets/products/brownie.png", available: true, sortOrder: n++ },
  { id: id("brownie"), categoryId: "desserts", name: { ar: "براوني", en: "Brownie" }, price: 4500, image: "assets/products/brownie.png", available: true, sortOrder: n++ },
  { id: id("chocolate-banana-bread"), categoryId: "desserts", name: { ar: "بنانا بريد", en: "Chocolate Banana Bread" }, price: 4500, image: "assets/products/brownie.png", available: true, sortOrder: n++ },
  { id: id("cinnamon-roll"), categoryId: "desserts", name: { ar: "سينامون رول بكريمة الجبن", en: "Cinnamon Roll with Cream Cheese" }, price: 5000, image: "assets/products/muffin.png", available: true, sortOrder: n++ },
  { id: id("chocolate-mini-cake"), categoryId: "desserts", name: { ar: "Chocolate Mini Cake", en: "Chocolate Mini Cake" }, price: 6500, image: "assets/products/brownie-icecream.png", available: true, sortOrder: n++ },
  { id: id("red-velvet-mini-cake"), categoryId: "desserts", name: { ar: "Red Velvet Mini Cake", en: "Red Velvet Mini Cake" }, price: 6500, image: "assets/products/tiramisu.png", available: true, sortOrder: n++ },
  { id: id("chocolate-100"), categoryId: "desserts", name: { ar: "شوكولا 100%", en: "100% Chocolate" }, price: 5500, image: "assets/products/brownie.png", available: true, sortOrder: n++ },
  { id: id("caramel-chocolate"), categoryId: "desserts", name: { ar: "كرميل شوكولا", en: "Caramel Chocolate" }, price: 5500, image: "assets/products/san-sebastian.png", available: true, sortOrder: n++ },
  { id: id("lotus-cheesecake"), categoryId: "desserts", name: { ar: "تشيز كيك لوتس", en: "Lotus Cheesecake" }, price: 6000, image: "assets/products/lotus-cheesecake.png", available: true, sortOrder: n++ },
  { id: id("chocolate-croissant"), categoryId: "desserts", name: { ar: "كرواسون شوكولاة", en: "Chocolate Croissant" }, description: { ar: "تسخن ٣٠ ثانية", en: "Warmed for 30 seconds before serving." }, price: 3500, image: "assets/products/muffin.png", available: true, sortOrder: n++ },
  { id: id("chocolate-donut"), categoryId: "desserts", name: { ar: "دونات شوكولا", en: "Chocolate Donut" }, price: 3500, image: "assets/products/brownie.png", available: true, sortOrder: n++ },
  { id: id("lotus-donut"), categoryId: "desserts", name: { ar: "دونات لوتس", en: "Lotus Donut" }, price: 3500, image: "assets/products/lotus-cheesecake.png", available: true, sortOrder: n++ },
  { id: id("lotus-cake"), categoryId: "desserts", name: { ar: "كيك لوتس", en: "Lotus Cake" }, price: 5500, image: "assets/products/lotus-cheesecake.png", available: true, sortOrder: n++ },
  { id: id("isabella"), categoryId: "desserts", name: { ar: "ايزبيلا", en: "Isabella" }, price: 5000, image: "assets/products/tiramisu.png", available: true, sortOrder: n++ },
];
