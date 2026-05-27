(function () {
  // Seeded PRNG
  function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }
  const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
  const rndInt = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));

  const CLIENT_ORGS = [
    { id: 'maybank', code: 'MB', name: 'Maybank', sub: 'Cards & loans · MY', bg: 'linear-gradient(135deg,#FEF3C7,#FCD34D)', fg: '#92400E',
      products: ['Credit Card','Personal Financing-i','Housing Loan','SME Flexi Loan','ASB Financing'],
      balanceRange: [500, 150000], origRange: [3000, 800000] },
    { id: 'cimb', code: 'CI', name: 'CIMB', sub: 'Cards & financing · MY', bg: 'linear-gradient(135deg,#FFE4E6,#FECDD3)', fg: '#9F1239',
      products: ['CIMB Credit Card','Personal Financing','Auto Finance','Business Term Loan','Home Financing-i'],
      balanceRange: [500, 200000], origRange: [3000, 900000] },
    { id: 'rhb', code: 'RH', name: 'RHB', sub: 'Banking & mortgage · MY', bg: 'linear-gradient(135deg,#EDE9FE,#C4B5FD)', fg: '#5B21B6',
      products: ['RHB Credit Card','Personal Loan','Mortgage','SME Working Capital'],
      balanceRange: [500, 180000], origRange: [3000, 1000000] },
    { id: 'coway', code: 'CW', name: 'Coway', sub: 'Home appliance rentals · MY', bg: 'linear-gradient(135deg,#CFFAFE,#67E8F9)', fg: '#155E75',
      products: ['Villaem III Water Purifier','Dazzie Water Purifier','Neo Plus Water Purifier','AIS Ice Maker Purifier','Cinnamon Water Purifier','Air Purifier AP-3121F','Air Purifier AP-2321F','Coway Mattress Rental','Coway Bidet Rental','Washer Dryer Rental','Multi-product Bundle'],
      balanceRange: [50, 3000], origRange: [100, 6000] },
    { id: 'maxis', code: 'MX', name: 'Maxis', sub: 'Postpaid & home fibre · MY', bg: 'linear-gradient(135deg,#FEF9C3,#FDE68A)', fg: '#713F12',
      products: ['Maxis Postpaid 79','Maxis Postpaid 99','Maxis Postpaid 109','Maxis Postpaid 139','Maxis Postpaid 169','Zerolution Device Plan','MaxisONE Home Fibre 100Mbps','MaxisONE Home Fibre 300Mbps','MaxisONE Home Fibre 500Mbps','Maxis Business Postpaid'],
      balanceRange: [50, 5000], origRange: [100, 6000] },
    { id: 'umobile', code: 'UM', name: 'U Mobile', sub: 'Postpaid & 5G broadband · MY', bg: 'linear-gradient(135deg,#F3E8FF,#D8B4FE)', fg: '#6B21A8',
      products: ['HERO P38','HERO P68','HERO P79','HERO P99','ULTRA Postpaid 45','ULTRA Postpaid 68','ULTRA Global 98','HERO + Device Bundle','U Home Fibre','U Home 5G Wireless'],
      balanceRange: [40, 3500], origRange: [80, 5000] },
  ];

  // Name pools
  const malayFemaleFN = ['Nurul','Siti','Nor','Farah','Nora','Ainul','Dalila','Fatin','Hayati','Izzati','Juliana','Khadijah','Maisarah','Nazirah','Rafidah','Salwana','Wahidah','Zaleha','Afiqah','Hidayah','Marlina','Nabilah','Roslina','Suraya','Zuraidah'];
  const malayMaleFN = ['Ahmad','Muhammad','Mohd','Abdullah','Ismail','Razif','Azman','Hafiz','Farid','Zulkifli','Ridzuan','Fadzil','Nizam','Azri','Syafiq','Arif','Hazwan','Izwan','Khairul','Nabil','Rahmat','Saiful','Faizal','Hisham','Shahril','Zarif','Suffian','Hafizuddin','Amirul','Zulhilmi'];
  const malaySurnames = ['Rahman','Hassan','Ibrahim','Ismail','Ahmad','Yusof','Zainal','Abdullah','Bakar','Hamid','Idris','Jaafar','Kassim','Latif','Mamat','Omar','Razak','Salleh','Taib','Wahab','Yahya','Zain','Ghani','Hussin','Kadir','Osman','Rahim','Samad','Yunus','Nordin'];
  const chineseSurnames = ['Tan','Lim','Lee','Wong','Ng','Chan','Ong','Yap','Khor','Goh','Cheah','Teh','Chua','Woo','Soo','Koay','Heng','Loh','Quah','Yeoh'];
  const chineseMaleGiven = ['Wei Ming','Chee Keong','Boon Huat','Teck Wah','Kok Leong','Swee Ann','Yew Hock','Kian Beng','Choon Hong','Wai Leong','Beng Seng','Chun Wei','Kim Hock','Peng Soon','Tze Wai','Zhen Wei','Boon Keat','Kin Fatt','Yong Sheng','Hao Jie'];
  const chineseFemaleGiven = ['Mei Ling','Siew Lan','Huey Lin','Ai Lian','Bee Geok','Siok Ching','Wai Keng','Poh Choo','Siew Mei','Hui Shan','Yen Ling','Siew Yin','Mei Yan','Hui Ping','Li Ling','Chin Mei','Hui Teng','Bee Lian','Yoke Mun','Shu Ting'];
  const indianMaleFN = ['Muthu','Raju','Selvam','Krishnan','Arumugam','Suresh','Kumar','Ganesh','Balakrishnan','Rajendran','Sivaraj','Dinesh','Prakash','Mohan','Vimal','Naresh','Praveen','Sathish','Vinod','Anand'];
  const indianFemaleFN = ['Kavitha','Meena','Suganya','Anitha','Nalini','Deepa','Rekha','Geetha','Vimala','Shanti','Lalitha','Pavithra','Nithyaa','Janani','Saranya','Preethi','Komala','Malathi','Indrani','Vasantha'];
  const indianFathers = ['Murugan','Pillai','Nair','Perumal','Maniam','Doraisamy','Govindasamy','Arumugam','Rajan','Krishnasamy','Suppiah','Ramasamy','Sinniah','Velayutham','Karuppan'];

  const cities = ['Kuala Lumpur','Petaling Jaya','Subang Jaya','Shah Alam','Klang','Seremban','Johor Bahru','Penang','Ipoh','Kota Bharu','Kuching','Kota Kinabalu','Melaka','Alor Setar','Kuala Terengganu','Ampang','Cheras','Puchong','Kajang','Seri Kembangan','Rawang','Sepang','Nilai','Selayang','Banting','Kulim','Muar','Batu Pahat','Kluang','Sibu'];
  const phonePrefixes = ['11','12','13','14','16','17','18','19'];
  const emailDomains = ['gmail.com','yahoo.com','hotmail.com','outlook.com'];
  const lastContacts = ['30 min ago','1 hour ago','2 hours ago','3 hours ago','4 hours ago','Yesterday','2 days ago','3 days ago','1 week ago','2 weeks ago'];
  const lastChannels = ['whatsapp','call','sms','vox-call','email'];
  const assignees = ['You','Hassan T.','Nor Aizan','Rajendran','Chong M.','Vox AI'];
  const companySuffixes = ['Trading','Enterprise','Sdn Bhd','Marketing','Services'];

  function generateName(rng) {
    const roll = rng();
    if (roll < 0.55) {
      // Malay
      const isFemale = rng() < 0.55;
      const surname = pick(rng, malaySurnames);
      if (isFemale) {
        return { name: `${pick(rng, malayFemaleFN)} binti ${surname}`, firstLower: pick(rng, malayFemaleFN).toLowerCase() };
      } else {
        return { name: `${pick(rng, malayMaleFN)} bin ${surname}`, firstLower: pick(rng, malayMaleFN).toLowerCase() };
      }
    } else if (roll < 0.80) {
      // Chinese
      const surname = pick(rng, chineseSurnames);
      const isFemale = rng() < 0.5;
      const given = isFemale ? pick(rng, chineseFemaleGiven) : pick(rng, chineseMaleGiven);
      return { name: `${surname} ${given}`, firstLower: given.replace(/\s+/g, '').toLowerCase() };
    } else {
      // Indian
      const father = pick(rng, indianFathers);
      const isFemale = rng() < 0.5;
      if (isFemale) {
        const fn = pick(rng, indianFemaleFN);
        return { name: `${fn} a/p ${father}`, firstLower: fn.toLowerCase() };
      } else {
        const fn = pick(rng, indianMaleFN);
        return { name: `${fn} a/l ${father}`, firstLower: fn.toLowerCase() };
      }
    }
  }

  function bucketFromDays(days) {
    if (days <= 0) return 'current';
    if (days <= 30) return '1-30';
    if (days <= 60) return '31-60';
    if (days <= 90) return '61-90';
    return '90+';
  }

  function sentimentFromDays(rng, days) {
    if (days > 90) return rng() < 0.6 ? 'avoidant' : 'distressed';
    if (days > 30) return rng() < 0.7 ? 'neutral' : 'distressed';
    return rng() < 0.75 ? 'cooperative' : 'neutral';
  }

  const ALL_DEBTORS = [];

  CLIENT_ORGS.forEach(client => {
    const rng = xmur3(`dva-pulse-${client.id}-seed-2024`);

    for (let i = 0; i < 350; i++) {
      const { name, firstLower } = generateName(rng);
      const city = pick(rng, cities);
      const prefix = pick(rng, phonePrefixes);
      const phone = `+60 ${prefix}-${rndInt(rng, 100, 999)} ${rndInt(rng, 1000, 9999)}`;

      const numSuffix = rndInt(rng, 10, 999);
      const emailBase = `${firstLower}${numSuffix}`;
      const email = rng() < 0.7
        ? `${emailBase}@${pick(rng, emailDomains)}`
        : `${emailBase}@${client.id}hotmail.com`;

      const daysOverdue = rng() < 0.15 ? 0 : rndInt(rng, 1, 180);
      const bucket = bucketFromDays(daysOverdue);
      const sentiment = sentimentFromDays(rng, daysOverdue);

      const balance = rndInt(rng, client.balanceRange[0], client.balanceRange[1]);
      const originalAmount = Math.max(balance + rndInt(rng, 500, 5000), client.origRange[0]);
      const riskScore = Math.min(99, Math.round(daysOverdue * 0.35 + rng() * 25 + 8));
      const promiseToPay = rng() < 0.28;
      const assigned = pick(rng, assignees);
      const lastContact = pick(rng, lastContacts);
      const lastChannel = pick(rng, lastChannels);
      const product = pick(rng, client.products);

      const company = rng() < 0.3 ? `${city} ${pick(rng, companySuffixes)}` : '—';
      const accountNumber = `${rndInt(rng, 1000, 9999)}-${rndInt(rng, 100, 999)}-${rndInt(rng, 100, 999)}`;
      const id = `${client.code}-${1000 + i}`;

      ALL_DEBTORS.push({
        id,
        clientId: client.id,
        name,
        company,
        city,
        country: 'MY',
        phone,
        email,
        ccy: 'MYR',
        balance,
        originalAmount,
        daysOverdue,
        accountNumber,
        product,
        riskScore,
        promiseToPay,
        assigned,
        lastContact,
        lastChannel,
        bucket,
        sentiment,
        tags: [],
      });
    }
  });

  window.GENERATED_DEBTORS = ALL_DEBTORS;
  window.CLIENT_ORGS = CLIENT_ORGS;
  window.ACTIVE_CLIENT_ID = 'maybank';
})();
