export const CATEGORIES = ['Animals', 'Food', 'Countries', 'Sports', 'Technology', 'Nature', 'Common'];

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

function getWordsByLength(words, minLen, maxLen) {
  return words.filter(w => w.length >= minLen && w.length <= maxLen);
}

const ANIMALS = [
  'tiger', 'elephant', 'dolphin', 'giraffe', 'penguin', 'kangaroo', 'butterfly', 'dinosaur', 'flamingo', 'octopus',
  'leopard', 'panther', 'jaguar', 'cheetah', 'buffalo', 'bison', 'falcon', 'eagle', 'hawk', 'raven',
  'cobra', 'viper', 'python', 'shark', 'whale', 'otter', 'badger', 'raccoon', 'squirrel', 'chipmunk',
  'rabbit', 'hare', 'beaver', 'muskrat', 'meerkat', 'hyena', 'jackal', 'coyote', 'wolf', 'lynx',
  'bobcat', 'puma', 'ocelot', 'panda', 'koala', 'sloth', 'armadillo', 'antelope', 'gazelle', 'zebra',
  'rhino', 'hippo', 'camel', 'llama', 'alpaca', 'goat', 'sheep', 'donkey', 'mule', 'horse',
  'pony', 'pig', 'boar', 'warthog', 'tapir', 'possum', 'skunk', 'weasel', 'marten', 'ferret',
  'minnow', 'trout', 'salmon', 'carp', 'eel', 'bass', 'perch', 'crab', 'lobster', 'shrimp',
  'clam', 'mussel', 'oyster', 'snail', 'slug', 'worm', 'beetle', 'cricket', 'locust', 'moth',
  'spider', 'tarantula', 'scorpion', 'tick', 'mite', 'louse', 'flea', 'wasp', 'hornet', 'bee',
  'parrot', 'toucan', 'pelican', 'heron', 'stork', 'crane', 'swan', 'goose', 'duck',
  'crow', 'robin', 'sparrow', 'finch', 'canary', 'wren', 'thrush', 'nightingale', 'woodpecker', 'owl',
  'emu', 'ostrich', 'kiwi', 'turkey', 'quail', 'pheasant', 'peacock', 'parrotlet', 'macaw', 'cockatoo',
  'grizzly', 'polar bear', 'black bear', 'cougar', 'bald eagle', 'blue jay', 'cardinal', 'bluebird', 'chickadee', 'hummingbird',
  'seal', 'walrus', 'narwhal', 'porpoise', 'manatee', 'dugong', 'squid', 'jellyfish', 'starfish', 'seahorse',
  'moose', 'elk', 'deer', 'pronghorn', 'wildebeest', 'impala', 'reindeer', 'caribou', 'bison', 'yak',
  'mammoth', 'sabertooth', 'groundhog', 'chinchilla', 'gerbil', 'hamster', 'guinea pig', 'parakeet', 'cockatiel', 'lovebird'
];

const FOOD = [
  'apple', 'banana', 'orange', 'grape', 'mango', 'peach', 'plum', 'cherry', 'strawberry', 'blueberry',
  'raspberry', 'blackberry', 'cranberry', 'pineapple', 'coconut', 'pomegranate', 'papaya', 'kiwi', 'melon', 'watermelon',
  'carrot', 'potato', 'tomato', 'onion', 'garlic', 'pepper', 'celery', 'lettuce', 'spinach', 'broccoli',
  'cauliflower', 'cabbage', 'corn', 'peas', 'beans', 'asparagus', 'artichoke', 'eggplant', 'cucumber', 'pumpkin',
  'bread', 'rice', 'pasta', 'noodle', 'cereal', 'oatmeal', 'pancake', 'waffle', 'muffin', 'croissant',
  'cheese', 'butter', 'cream', 'yogurt', 'milk', 'egg', 'bacon', 'sausage', 'ham', 'steak',
  'chicken', 'turkey', 'lamb', 'pork', 'beef', 'fish', 'shrimp', 'crab', 'lobster', 'salmon',
  'chocolate', 'candy', 'cookie', 'cake', 'pie', 'icecream', 'pudding', 'jelly', 'honey', 'syrup',
  'coffee', 'tea', 'juice', 'soda', 'water', 'milk', 'wine', 'beer', 'whiskey', 'rum',
  'pizza', 'hamburger', 'hotdog', 'sandwich', 'salad', 'soup', 'curry', 'stew', 'roast', 'grill',
  'spaghetti', 'lasagna', 'taco', 'burrito', 'nachos', 'quesadilla', 'enchilada', 'tortilla', 'pita', 'bagel',
  'avocado', 'fig', 'grapefruit', 'lemon', 'lime', 'tangerine', 'nectarine', 'apricot', 'pear', 'plum',
  'zucchini', 'asparagus', 'broccoli', 'cauliflower', 'kale', 'spinach', 'cabbage', 'turnip', 'radish', 'beet',
  'ginger', 'turmeric', 'cinnamon', 'nutmeg', 'clove', 'peppercorn', 'saffron', 'vanilla', 'basil', 'thyme'
];

const COUNTRIES = [
  'canada', 'brazil', 'australia', 'germany', 'france', 'spain', 'italy', 'portugal', 'greece', 'sweden',
  'norway', 'denmark', 'finland', 'poland', 'hungary', 'romania', 'bulgaria', 'croatia', 'serbia', 'slovenia',
  'austria', 'switzerland', 'belgium', 'netherlands', 'ireland', 'scotland', 'wales', 'england', 'iceland', 'greenland',
  'mexico', 'cuba', 'jamaica', 'haiti', 'dominican', 'panama', 'costa', 'colombia', 'peru', 'ecuador',
  'chile', 'argentina', 'uruguay', 'paraguay', 'bolivia', 'venezuela', 'guyana', 'suriname', 'egypt', 'libya',
  'algeria', 'tunisia', 'morocco', 'sudan', 'ethiopia', 'kenya', 'tanzania', 'uganda', 'ghana', 'nigeria',
  'cameroon', 'chad', 'mali', 'niger', 'mauritania', 'senegal', 'angola', 'zambia', 'zimbabwe', 'botswana',
  'india', 'china', 'japan', 'korea', 'thailand', 'vietnam', 'malaysia', 'indonesia', 'philippines', 'singapore',
  'pakistan', 'afghanistan', 'iran', 'iraq', 'syria', 'jordan', 'lebanon', 'israel', 'saudi', 'yemen',
  'oman', 'uae', 'qatar', 'kuwait', 'bahrain', 'bangladesh', 'nepal', 'bhutan', 'myanmar', 'cambodia',
  'turkey', 'cyprus', 'malta', 'estonia', 'latvia', 'lithuania', 'belarus', 'ukraine', 'moldova', 'georgia'
];

const SPORTS = [
  'soccer', 'basketball', 'tennis', 'baseball', 'football', 'hockey', 'cricket', 'rugby', 'golf', 'boxing',
  'wrestling', 'karate', 'judo', 'taekwondo', 'fencing', 'archery', 'shooting', 'swimming', 'diving', 'surfing',
  'skiing', 'snowboard', 'skating', 'cycling', 'marathon', 'triathlon', 'volleyball', 'badminton', 'pingpong',
  'squat', 'plank', 'pushup', 'pullup', 'jumping', 'running', 'walking', 'hiking', 'climbing', 'rowing',
  'canoeing', 'kayaking', 'sailing', 'yachting', 'windsurf', 'kitesurf', 'paraglide', 'skydive', 'bungee', 'zipline',
  'coach', 'player', 'referee', 'umpire', 'scorer', 'team', 'league', 'match', 'game', 'score',
  'point', 'goal', 'touchdown', 'homerun', 'strike', 'ball', 'court', 'field', 'track', 'pool',
  'stadium', 'arena', 'gym', 'club', 'champion', 'winner', 'medalist', 'trophy', 'cup', 'belt',
  'offense', 'defense', 'quarter', 'inning', 'round', 'period', 'halftime', 'overtime', 'penalty', 'timeout',
  'training', 'practice', 'warmup', 'stretch', 'workout', 'fitness', 'endurance', 'strength', 'speed', 'agility',
  'polo', 'lacrosse', 'handball', 'racquetball', 'squash', 'boating', 'fishing', 'hunting', 'riding', 'racing'
];

const TECHNOLOGY = [
  'computer', 'keyboard', 'mouse', 'monitor', 'printer', 'scanner', 'camera', 'projector', 'speaker', 'microphone',
  'laptop', 'tablet', 'phone', 'charger', 'battery', 'cable', 'router', 'server', 'network', 'internet',
  'software', 'program', 'app', 'website', 'browser', 'email', 'password', 'username', 'account', 'profile',
  'database', 'storage', 'memory', 'processor', 'chip', 'circuit', 'screen', 'display', 'pixel', 'resolution',
  'download', 'upload', 'backup', 'firewall', 'virus', 'malware', 'spam', 'encryption', 'decryption', 'encoding',
  'algorithm', 'function', 'variable', 'array', 'string', 'number', 'boolean', 'object', 'class', 'method',
  'module', 'library', 'framework', 'syntax', 'debug', 'compile', 'execute', 'runtime', 'deploy',
  'cloud', 'serverless', 'container', 'virtual', 'docker', 'kubernetes', 'api', 'endpoint', 'request', 'response',
  'json', 'xml', 'html', 'css', 'javascript', 'python', 'java', 'swift', 'rust', 'golang',
  'ruby', 'php', 'perl', 'scala', 'kotlin', 'typescript', 'react', 'angular', 'vue', 'nodejs',
  'bluetooth', 'wifi', 'ethernet', 'usb', 'hdmi', 'vga', 'simcard', 'memorycard', 'harddrive', 'solidstate',
  'server', 'mainframe', 'workstation', 'console', 'gaming', 'streaming', 'podcast', 'broadcast', 'signal', 'bandwidth'
];

const NATURE = [
  'mountain', 'river', 'ocean', 'forest', 'desert', 'island', 'valley', 'canyon', 'cave', 'waterfall',
  'glacier', 'volcano', 'beach', 'reef', 'marsh', 'swamp', 'jungle', 'rainforest', 'tundra', 'prairie',
  'meadow', 'field', 'pasture', 'grove', 'orchard', 'vineyard', 'garden', 'park', 'reserve', 'sanctuary',
  'sunrise', 'sunset', 'moonlight', 'starlight', 'rainbow', 'cloud', 'fog', 'mist', 'storm', 'thunder',
  'lightning', 'breeze', 'wind', 'hurricane', 'tornado', 'blizzard', 'avalanche', 'flood', 'drought', 'earthquake',
  'tree', 'flower', 'grass', 'moss', 'fern', 'palm', 'cactus', 'bamboo', 'rose', 'tulip', 'sunflower', 'daisy', 'lily', 'orchid', 'jasmine', 'lavender', 'lilac', 'poppy',
  'leaf', 'branch', 'root', 'bark', 'seed', 'acorn', 'berry', 'mushroom', 'lichen', 'algae',
  'rock', 'stone', 'pebble', 'sand', 'dirt', 'mud', 'clay', 'soil', 'lava', 'ash',
  'water', 'stream', 'creek', 'pond', 'lake', 'spring', 'well', 'pool', 'wave', 'tide',
  'horizon', 'climate', 'weather', 'season', 'autumn', 'winter', 'summer', 'spring', 'monsoon', 'galaxy',
  'planet', 'comet', 'asteroid', 'meteor', 'constellation', 'nebula', 'sun', 'moon', 'star', 'planet'
];

const COMMON = [
  'table', 'window', 'happy', 'garden', 'bottle', 'bridge', 'castle', 'church', 'clock', 'coast',
  'corner', 'cotton', 'doctor', 'driver', 'engine', 'family', 'finger', 'flower', 'forest', 'garden',
  'hammer', 'health', 'horse', 'hospital', 'hotel', 'house', 'juice', 'kitchen', 'knife', 'ladder',
  'laptop', 'lawyer', 'leather', 'letter', 'light', 'liquid', 'market', 'metal', 'mirror', 'morning',
  'mother', 'mountain', 'music', 'night', 'number', 'office', 'option', 'orange', 'output', 'owner',
  'package', 'paint', 'panel', 'paper', 'parent', 'parking', 'party', 'pasta', 'pension', 'person',
  'phone', 'photo', 'piano', 'pizza', 'planet', 'player', 'please', 'police', 'pool', 'pound',
  'power', 'president', 'price', 'prison', 'prize', 'progress', 'property', 'queen', 'radio', 'rain',
  'range', 'record', 'restaurant', 'result', 'river', 'robot', 'room', 'salad', 'salt', 'school',
  'science', 'screen', 'search', 'season', 'second', 'section', 'security', 'seed', 'self', 'service',
  'shadow', 'shape', 'share', 'sheet', 'shelf', 'shell', 'shirt', 'shock', 'shoe', 'shop',
  'short', 'shoulder', 'sight', 'silver', 'simple', 'sister', 'sleep', 'slice', 'small', 'smell',
  'smile', 'smoke', 'smooth', 'snow', 'social', 'socket', 'soft', 'software', 'soil', 'solid',
  'solution', 'son', 'song', 'sort', 'sound', 'source', 'south', 'space', 'speaker', 'special',
  'sport', 'spot', 'spread', 'spring', 'square', 'stable', 'stage', 'stairs', 'standard', 'star',
  'state', 'station', 'status', 'steam', 'steel', 'step', 'stick', 'stock', 'stone', 'store',
  'storm', 'story', 'stove', 'strategy', 'street', 'strike', 'string', 'strong', 'structure', 'student',
  'studio', 'study', 'stuff', 'style', 'sugar', 'suite', 'summer', 'sun', 'super', 'supply',
  'sweet', 'swimming', 'system', 'table', 'tank', 'tape', 'taste', 'taxi', 'teacher', 'team',
  'technology', 'telephone', 'television', 'tennis', 'test', 'theory', 'thing', 'thought', 'thread', 'throat',
  'thumb', 'thunder', 'ticket', 'time', 'tired', 'title', 'today', 'tomorrow', 'tongue', 'tool',
  'tooth', 'top', 'total', 'touch', 'tour', 'town', 'toy', 'track', 'trade', 'traditional',
  'traffic', 'train', 'trash', 'travel', 'treatment', 'tree', 'trial', 'trip', 'trouble', 'truck',
  'trust', 'truth', 'type', 'umbrella', 'uncle', 'under', 'unit', 'university', 'until', 'upper',
  'upstairs', 'usage', 'user', 'usual', 'usually', 'utility', 'vacation', 'valley', 'valuable', 'vehicle',
  'version', 'video', 'view', 'village', 'violence', 'visit', 'visual', 'voice', 'volume', 'vote',
  'waste', 'watch', 'water', 'wealth', 'weather', 'website', 'wedding', 'weekend', 'weight', 'welfare',
  'west', 'western', 'wheel', 'where', 'while', 'white', 'whole', 'wide', 'wife', 'window',
  'winter', 'wire', 'wise', 'wish', 'without', 'woman', 'wonder', 'wooden', 'wood', 'wool',
  'worker', 'world', 'worry', 'worth', 'writer', 'wrong', 'yard', 'year', 'yellow', 'yesterday', 'yoga', 'zero', 'zone', 'zeal'
];

function categorizeWord(word) {
  const w = word.toLowerCase();
  if (ANIMALS.includes(w)) return 'Animals';
  if (FOOD.includes(w)) return 'Food';
  if (COUNTRIES.includes(w)) return 'Countries';
  if (SPORTS.includes(w)) return 'Sports';
  if (TECHNOLOGY.includes(w)) return 'Technology';
  if (NATURE.includes(w)) return 'Nature';
  return 'Common';
}

function getDifficulty(wordLength) {
  if (wordLength <= 5) return DIFFICULTY.EASY;
  if (wordLength <= 7) return DIFFICULTY.MEDIUM;
  return DIFFICULTY.HARD;
}

function buildWordBank() {
  const allWords = [
    ...ANIMALS, ...FOOD, ...COUNTRIES, ...SPORTS,
    ...TECHNOLOGY, ...NATURE, ...COMMON
  ];
  
  const uniqueWords = [...new Set(allWords.map(w => w.toLowerCase().trim()))];
  
  return uniqueWords.map(word => ({
    text: word,
    category: categorizeWord(word),
    difficulty: getDifficulty(word.length)
  }));
}

export const wordBank = buildWordBank();

export function getWordsByCategory(category) {
  if (category === 'All') return wordBank;
  return wordBank.filter(w => w.category === category);
}

export function getWordsByDifficulty(difficulty) {
  return wordBank.filter(w => w.difficulty === difficulty);
}

export function getRandomWord(seed = null) {
  let index;
  if (seed !== null) {
    index = seed % wordBank.length;
  } else {
    index = Math.floor(Math.random() * wordBank.length);
  }
  return wordBank[index];
}

export function getWordCount() {
  return wordBank.length;
}

export function getCategoryCounts() {
  const counts = {};
  for (const cat of CATEGORIES) {
    counts[cat] = wordBank.filter(w => w.category === cat).length;
  }
  return counts;
}
