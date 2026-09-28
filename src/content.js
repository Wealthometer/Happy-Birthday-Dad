// ─────────────────────────────────────────────────────────────
//  Everything you see on the website lives in this one file.
//  Change the words, swap the photos, and the site updates.
//  Photos live in /public/photos — drop new ones in there and
//  reference them as '/photos/your-file.jpg'.
// ─────────────────────────────────────────────────────────────

export const person = {
  title: 'Bishop',
  name: 'Olumide Hajoh',
  ministry: 'Boom Fire And Miracle Ministry',
  birthday: 'September 28',
  son: 'Wealth Hajoh',
  year: 2026,
}

// Background music.
// Leave as null to use the built-in music-box "Happy Birthday".
// Or put an mp3 in /public/music and set e.g. '/music/birthday.mp3'
export const musicSrc = null

export const gate = {
  line: 'Dad, I made something for you.',
  button: 'Open your gift',
}

export const hero = {
  photo: '/photos/blue-agbada-seated.jpg',
  tagline: 'Father, pastor, mentor, and a father to many.',
}

export const letter = {
  photo: '/photos/rose-agbada-full.jpg',
  paragraphs: [
    'Dad, today I celebrate more than the man who gave me life. I celebrate the man who has shaped me, taught me, guided me, and helped make me who I am.',
    'You are not only my biological father. You are my spiritual father, my pastor, my mentor, and the example I look up to every single day.',
    'I know there is nothing I could buy that would match what you have given me. So instead, I wanted to give you something made with the skills and knowledge you invested in me. You paid for the school that taught me how to build this. This website is what that investment became.',
    'It is a small expression of a very big gratitude. You are the best man I have met on this earth, and I love you wholeheartedly.',
  ],
  signoff: 'Your son,',
}

export const roles = [
  {
    name: 'Father',
    line: 'He leads his home with love, wisdom, and a steady hand.',
    photo: '/photos/blue-senator-smile.jpg',
  },
  {
    name: 'Pastor',
    line: 'A shepherd who has given his life to serving God’s people.',
    photo: '/photos/pulpit-navy-3.jpg',
  },
  {
    name: 'Mentor',
    line: 'A teacher whose words have set many lives in the right direction.',
    photo: '/photos/teaching-green.jpg',
  },
  {
    name: 'Father to many',
    line: 'His care reaches far beyond the walls of his own house.',
    photo: '/photos/rose-agbada-4.jpg',
  },
]

// TODO: Replace these with the real story — years, places, moments.
// Set `year` to something like '1985' to show it; leave '' to hide.
export const journey = [
  {
    year: '',
    title: 'The early years',
    text: 'Long before the pulpit, God was already preparing a young man for the work ahead.',
    photo: '/photos/rose-agbada-3.jpg',
  },
  {
    year: '',
    title: 'The call',
    text: 'He answered God’s call to ministry, and gave his whole life to it.',
    photo: '/photos/pulpit-gold-1.jpg',
  },
  {
    year: '',
    title: 'Boom Fire And Miracle Ministry',
    text: 'A ministry was born, and a family of believers began to grow around his leadership.',
    photo: '/photos/pulpit-navy-1.jpg',
  },
  {
    year: '2026',
    title: 'Today',
    text: 'Still preaching, still teaching, still fathering. Another year of grace begins.',
    photo: '/photos/blue-agbada-joy.jpg',
  },
]

export const ministry = {
  heroPhoto: '/photos/pulpit-navy-2.jpg',
  statement: 'A life given to the service of God and the transformation of lives.',
  text: 'Week after week, Dad stands before God’s people with an open Bible and a word in season. The pulpit is where many know him best, and where many lives have found their way back to God.',
  photos: ['/photos/pulpit-gold-2.jpg', '/photos/stage-plaid.jpg', '/photos/teaching-plaid.jpg'],
}

export const galleryCategories = ['All', 'Portraits', 'Pulpit', 'Celebration']

export const gallery = [
  { src: '/photos/blue-agbada-joy.jpg', cat: 'Portraits', alt: 'Dad in a blue agbada and gold cap, smiling with his arm raised' },
  { src: '/photos/rose-agbada-1.jpg', cat: 'Portraits', alt: 'Dad in a rose plaid agbada, smiling between green curtains' },
  { src: '/photos/pulpit-navy-1.jpg', cat: 'Pulpit', alt: 'Dad preaching in a navy agbada at a glass pulpit' },
  { src: '/photos/blue-senator-smile.jpg', cat: 'Portraits', alt: 'Dad in a blue native outfit, hands in his pockets, laughing' },
  { src: '/photos/teaching-plaid.jpg', cat: 'Pulpit', alt: 'Dad teaching in a plaid shirt in front of the ministry logo' },
  { src: '/photos/flyer-navy.jpg', cat: 'Celebration', alt: 'Navy and gold birthday flyer for Bishop Olumide Hajoh' },
  { src: '/photos/blue-agbada-seated.jpg', cat: 'Portraits', alt: 'Dad seated in a blue agbada, smiling warmly' },
  { src: '/photos/pulpit-gold-1.jpg', cat: 'Pulpit', alt: 'Dad speaking at a wooden pulpit in a gold outfit' },
  { src: '/photos/rose-agbada-2.jpg', cat: 'Portraits', alt: 'Dad in a rose agbada, hands folded, laughing' },
  { src: '/photos/stage-plaid.jpg', cat: 'Pulpit', alt: 'Dad preaching on stage in a plaid shirt and sneakers' },
  { src: '/photos/flyer-orange.jpg', cat: 'Celebration', alt: 'Orange birthday flyer for Bishop Olumide Hajoh' },
  { src: '/photos/rose-agbada-full.jpg', cat: 'Portraits', alt: 'Full-length photo of Dad in a rose agbada' },
  { src: '/photos/pulpit-navy-3.jpg', cat: 'Pulpit', alt: 'Dad preaching with a microphone at a glass pulpit' },
  { src: '/photos/teaching-green.jpg', cat: 'Pulpit', alt: 'Dad teaching in a green outfit, microphone in hand' },
  { src: '/photos/rose-agbada-3.jpg', cat: 'Portraits', alt: 'Dad in a rose agbada and cap, smiling' },
  { src: '/photos/pulpit-gold-2.jpg', cat: 'Pulpit', alt: 'Dad preaching at a wooden pulpit' },
  { src: '/photos/rose-agbada-4.jpg', cat: 'Portraits', alt: 'Dad in a rose agbada, grinning' },
  { src: '/photos/pulpit-navy-2.jpg', cat: 'Pulpit', alt: 'Dad smiling while preaching in a navy agbada' },
]

// TODO: Make these yours — even one real memory per item hits hard.
export const lessons = [
  { title: 'Faith', text: 'I have watched you trust God when things were easy and when they were not. You taught me that faith is something you live, not only something you preach.' },
  { title: 'Discipline', text: 'You showed me that consistency beats talent. Showing up, again and again, is how great things get built.' },
  { title: 'Leadership', text: 'You lead from the front, but you never forget the people behind you. Watching you, I learned that leading is really serving.' },
  { title: 'Excellence', text: 'Whatever you do, you do it well. Every line of code on this page was written trying to live up to that.' },
  { title: 'Service', text: 'You give your time, your wisdom, and your heart to so many people. You taught me that a life is measured by how many lives it lifts.' },
  { title: 'Purpose', text: 'You helped me understand that God has a plan for my life too, and that I should pursue it with everything I have.' },
]

export const finale = {
  photo: '/photos/blue-agbada-joy.jpg',
  thanks: [
    'Thank you for being my father.',
    'Thank you for being my pastor.',
    'Thank you for being my mentor.',
    'Thank you for being a father to many.',
  ],
  closing: 'I am grateful for the life you have lived, the lessons you have taught me, and the impact you have made. May this new year bring you greater joy, greater strength, and greater grace.',
  love: 'I love you, Dad.',
}
