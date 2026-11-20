// Complete Bangladesh Cascading Location Data: All 8 Divisions -> All 64 Districts -> Upazilas / Thanas
const BD_LOCATIONS = {
  "Dhaka": {
    "Dhaka": ["Uttara", "Dhanmondi", "Gulshan", "Banani", "Mirpur", "Mohammadpur", "Motijheel", "Badda", "Khilgaon", "Tejgaon", "Ramna", "Wari", "Lalbagh", "Jatrabari", "Savar", "Dhamrai", "Keraniganj", "Nawabganj", "Dohar"],
    "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi"],
    "Narayanganj": ["Narayanganj Sadar", "Araihazar", "Bandar", "Rupganj", "Sonargaon"],
    "Tangail": ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur"],
    "Narsingdi": ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"],
    "Munshiganj": ["Munshiganj Sadar", "Gazaria", "Lohajang", "Sirajdikhan", "Sreenagar", "Tongibari"],
    "Manikganj": ["Manikganj Sadar", "Daulatpur", "Ghior", "Harirampur", "Saturia", "Shivalaya", "Singair"],
    "Faridpur": ["Faridpur Sadar", "Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"],
    "Gopalganj": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
    "Kishoreganj": ["Kishoreganj Sadar", "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"],
    "Madaripur": ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar", "Dasar"],
    "Rajbari": ["Rajbari Sadar", "Baliakandi", "Goalandaghat", "Kalukhali", "Pangsha"],
    "Shariatpur": ["Shariatpur Sadar", "Bhedarganj", "Damudya", "Gosairhat", "Naria", "Zajira"]
  },
  "Chattogram": {
    "Chattogram": ["Kotwali", "Panchlaish", "Halishahar", "Agrabad", "Patenga", "Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia", "Eidgaon"],
    "Cumilla": ["Cumilla Sadar", "Cumilla Sadar Dakshin", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Meghna", "Monohorgonj", "Muradnagar", "Nangalkot", "Titas"],
    "Feni": ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Fulgazi", "Parshuram", "Sonagazi"],
    "Noakhali": ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Senbagh", "Sonaimuri", "Subarnachar"],
    "Lakshmipur": ["Lakshmipur Sadar", "Kamalnagar", "Raipur", "Ramganj", "Ramgati"],
    "Chandpur": ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
    "Brahmanbaria": ["Brahmanbaria Sadar", "Akhaura", "Ashuganj", "Bancharampur", "Bijoynagar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"],
    "Bandarban": ["Bandarban Sadar", "Alikadam", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
    "Khagrachhari": ["Khagrachhari Sadar", "Dighinala", "Guimara", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
    "Rangamati": ["Rangamati Sadar", "Bagaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali"]
  },
  "Rajshahi": {
    "Rajshahi": ["Boalia", "Motihar", "Rajpara", "Shah Makhdum", "Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
    "Bogura": ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatola"],
    "Pabna": ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"],
    "Sirajganj": ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullahpara"],
    "Natore": ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Naldanga", "Singra"],
    "Naogaon": ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
    "Chapainawabganj": ["Chapainawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"],
    "Joypurhat": ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"]
  },
  "Khulna": {
    "Khulna": ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Batiaghata", "Dacope", "Dighalia", "Dumuria", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Terokhada"],
    "Jashore": ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
    "Satkhira": ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"],
    "Bagerhat": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
    "Kushtia": ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"],
    "Jhenaidah": ["Jhenaidah Sadar", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
    "Chuadanga": ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
    "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
    "Meherpur": ["Meherpur Sadar", "Gangni", "Mujibnagar"],
    "Narail": ["Narail Sadar", "Kalia", "Lohagara"]
  },
  "Barishal": {
    "Barishal": ["Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
    "Bhola": ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
    "Patuakhali": ["Patuakhali Sadar", "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali"],
    "Pirojpur": ["Pirojpur Sadar", "Bhandaria", "Indurkani", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad"],
    "Barguna": ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"],
    "Jhalokati": ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"]
  },
  "Sylhet": {
    "Sylhet": ["Sylhet Sadar", "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Zakiganj"],
    "Moulvibazar": ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"],
    "Habiganj": ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Shayestaganj"],
    "Sunamganj": ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Dakshin Sunamganj", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Madhyanagar", "Sullah", "Tahirpur"]
  },
  "Rangpur": {
    "Rangpur": ["Rangpur Sadar", "Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
    "Dinajpur": ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
    "Kurigram": ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Nageshwari", "Phulbari", "Rajarhat", "Raomari", "Ulipur"],
    "Gaibandha": ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
    "Nilphamari": ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"],
    "Lalmonirhat": ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
    "Thakurgaon": ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"],
    "Panchagarh": ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"]
  },
  "Mymensingh": {
    "Mymensingh": ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Tarakanda", "Trishal"],
    "Jamalpur": ["Jamalpur Sadar", "Baksiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"],
    "Netrokona": ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Purbadhala"],
    "Sherpur": ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"]
  }
};

// Reusable helper to initialize cascading Division -> District -> Upazila selects
function initCascadingLocation(divId, distId, upzId, initial = {}) {
  const divEl = document.getElementById(divId);
  const distEl = document.getElementById(distId);
  const upzEl = document.getElementById(upzId);
  if (!divEl || !distEl || !upzEl) return;

  function populateDivisions(selectedDiv) {
    divEl.innerHTML = '<option value="">Select Division</option>' +
      Object.keys(BD_LOCATIONS).map(d => `<option value="${d}">${d}</option>`).join('');
    if (selectedDiv && BD_LOCATIONS[selectedDiv]) {
      divEl.value = selectedDiv;
    }
  }

  function populateDistricts(divName, selectedDist) {
    const districts = divName && BD_LOCATIONS[divName] ? Object.keys(BD_LOCATIONS[divName]) : [];
    distEl.innerHTML = '<option value="">Select District</option>' +
      districts.map(dt => `<option value="${dt}">${dt}</option>`).join('');
    distEl.disabled = districts.length === 0;
    if (selectedDist && districts.includes(selectedDist)) {
      distEl.value = selectedDist;
    }
  }

  function populateUpazilas(divName, distName, selectedUpz) {
    const upazilas = (divName && distName && BD_LOCATIONS[divName] && BD_LOCATIONS[divName][distName])
      ? BD_LOCATIONS[divName][distName] : [];
    upzEl.innerHTML = '<option value="">Select Upazila / Thana</option>' +
      upazilas.map(u => `<option value="${u}">${u}</option>`).join('');
    upzEl.disabled = upazilas.length === 0;
    if (selectedUpz && upazilas.includes(selectedUpz)) {
      upzEl.value = selectedUpz;
    }
  }

  divEl.onchange = () => {
    populateDistricts(divEl.value, '');
    populateUpazilas(divEl.value, '', '');
  };

  distEl.onchange = () => {
    populateUpazilas(divEl.value, distEl.value, '');
  };

  const initDiv = initial.division || 'Dhaka';
  const initDist = initial.district || (BD_LOCATIONS[initDiv] ? Object.keys(BD_LOCATIONS[initDiv])[0] : '');
  const initUpz = initial.upazila || (BD_LOCATIONS[initDiv] && BD_LOCATIONS[initDiv][initDist] ? BD_LOCATIONS[initDiv][initDist][0] : '');

  populateDivisions(initDiv);
  populateDistricts(initDiv, initDist);
  populateUpazilas(initDiv, initDist, initUpz);
}
