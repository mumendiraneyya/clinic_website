/**
 * Phone number formatting utilities
 * Loaded globally for use in inline scripts
 */

// Country code to flag emoji mapping
window.PHONE_COUNTRY_FLAGS = {
  '1': '🇺🇸',      // USA/Canada (NANP)
  '7': '🇷🇺',      // Russia
  '20': '🇪🇬',     // Egypt
  '27': '🇿🇦',     // South Africa
  '30': '🇬🇷',     // Greece
  '31': '🇳🇱',     // Netherlands
  '32': '🇧🇪',     // Belgium
  '33': '🇫🇷',     // France
  '34': '🇪🇸',     // Spain
  '36': '🇭🇺',     // Hungary
  '39': '🇮🇹',     // Italy
  '40': '🇷🇴',     // Romania
  '41': '🇨🇭',     // Switzerland
  '43': '🇦🇹',     // Austria
  '44': '🇬🇧',     // UK
  '45': '🇩🇰',     // Denmark
  '46': '🇸🇪',     // Sweden
  '47': '🇳🇴',     // Norway
  '48': '🇵🇱',     // Poland
  '49': '🇩🇪',     // Germany
  '51': '🇵🇪',     // Peru
  '52': '🇲🇽',     // Mexico
  '53': '🇨🇺',     // Cuba
  '54': '🇦🇷',     // Argentina
  '55': '🇧🇷',     // Brazil
  '56': '🇨🇱',     // Chile
  '57': '🇨🇴',     // Colombia
  '58': '🇻🇪',     // Venezuela
  '60': '🇲🇾',     // Malaysia
  '61': '🇦🇺',     // Australia
  '62': '🇮🇩',     // Indonesia
  '63': '🇵🇭',     // Philippines
  '64': '🇳🇿',     // New Zealand
  '65': '🇸🇬',     // Singapore
  '66': '🇹🇭',     // Thailand
  '81': '🇯🇵',     // Japan
  '82': '🇰🇷',     // South Korea
  '84': '🇻🇳',     // Vietnam
  '86': '🇨🇳',     // China
  '90': '🇹🇷',     // Turkey
  '91': '🇮🇳',     // India
  '92': '🇵🇰',     // Pakistan
  '93': '🇦🇫',     // Afghanistan
  '94': '🇱🇰',     // Sri Lanka
  '95': '🇲🇲',     // Myanmar
  '98': '🇮🇷',     // Iran
  '211': '🇸🇸',    // South Sudan
  '212': '🇲🇦',    // Morocco
  '213': '🇩🇿',    // Algeria
  '216': '🇹🇳',    // Tunisia
  '218': '🇱🇾',    // Libya
  '220': '🇬🇲',    // Gambia
  '221': '🇸🇳',    // Senegal
  '222': '🇲🇷',    // Mauritania
  '223': '🇲🇱',    // Mali
  '224': '🇬🇳',    // Guinea
  '225': '🇨🇮',    // Ivory Coast
  '226': '🇧🇫',    // Burkina Faso
  '227': '🇳🇪',    // Niger
  '228': '🇹🇬',    // Togo
  '229': '🇧🇯',    // Benin
  '230': '🇲🇺',    // Mauritius
  '231': '🇱🇷',    // Liberia
  '232': '🇸🇱',    // Sierra Leone
  '233': '🇬🇭',    // Ghana
  '234': '🇳🇬',    // Nigeria
  '235': '🇹🇩',    // Chad
  '236': '🇨🇫',    // Central African Republic
  '237': '🇨🇲',    // Cameroon
  '238': '🇨🇻',    // Cape Verde
  '239': '🇸🇹',    // São Tomé and Príncipe
  '240': '🇬🇶',    // Equatorial Guinea
  '241': '🇬🇦',    // Gabon
  '242': '🇨🇬',    // Republic of the Congo
  '243': '🇨🇩',    // Democratic Republic of the Congo
  '244': '🇦🇴',    // Angola
  '245': '🇬🇼',    // Guinea-Bissau
  '246': '🇮🇴',    // British Indian Ocean Territory
  '247': '🇦🇨',    // Ascension Island
  '248': '🇸🇨',    // Seychelles
  '249': '🇸🇩',    // Sudan
  '250': '🇷🇼',    // Rwanda
  '251': '🇪🇹',    // Ethiopia
  '252': '🇸🇴',    // Somalia
  '253': '🇩🇯',    // Djibouti
  '254': '🇰🇪',    // Kenya
  '255': '🇹🇿',    // Tanzania
  '256': '🇺🇬',    // Uganda
  '257': '🇧🇮',    // Burundi
  '258': '🇲🇿',    // Mozambique
  '260': '🇿🇲',    // Zambia
  '261': '🇲🇬',    // Madagascar
  '262': '🇷🇪',    // Réunion
  '263': '🇿🇼',    // Zimbabwe
  '264': '🇳🇦',    // Namibia
  '265': '🇲🇼',    // Malawi
  '266': '🇱🇸',    // Lesotho
  '267': '🇧🇼',    // Botswana
  '268': '🇸🇿',    // Eswatini
  '269': '🇰🇲',    // Comoros
  '290': '🇸🇭',    // Saint Helena
  '291': '🇪🇷',    // Eritrea
  '297': '🇦🇼',    // Aruba
  '298': '🇫🇴',    // Faroe Islands
  '299': '🇬🇱',    // Greenland
  '350': '🇬🇮',    // Gibraltar
  '351': '🇵🇹',    // Portugal
  '352': '🇱🇺',    // Luxembourg
  '353': '🇮🇪',    // Ireland
  '354': '🇮🇸',    // Iceland
  '355': '🇦🇱',    // Albania
  '356': '🇲🇹',    // Malta
  '357': '🇨🇾',    // Cyprus
  '358': '🇫🇮',    // Finland
  '359': '🇧🇬',    // Bulgaria
  '370': '🇱🇹',    // Lithuania
  '371': '🇱🇻',    // Latvia
  '372': '🇪🇪',    // Estonia
  '373': '🇲🇩',    // Moldova
  '374': '🇦🇲',    // Armenia
  '375': '🇧🇾',    // Belarus
  '376': '🇦🇩',    // Andorra
  '377': '🇲🇨',    // Monaco
  '378': '🇸🇲',    // San Marino
  '380': '🇺🇦',    // Ukraine
  '381': '🇷🇸',    // Serbia
  '382': '🇲🇪',    // Montenegro
  '383': '🇽🇰',    // Kosovo
  '385': '🇭🇷',    // Croatia
  '386': '🇸🇮',    // Slovenia
  '387': '🇧🇦',    // Bosnia and Herzegovina
  '389': '🇲🇰',    // North Macedonia
  '420': '🇨🇿',    // Czech Republic
  '421': '🇸🇰',    // Slovakia
  '423': '🇱🇮',    // Liechtenstein
  '500': '🇫🇰',    // Falkland Islands
  '501': '🇧🇿',    // Belize
  '502': '🇬🇹',    // Guatemala
  '503': '🇸🇻',    // El Salvador
  '504': '🇭🇳',    // Honduras
  '505': '🇳🇮',    // Nicaragua
  '506': '🇨🇷',    // Costa Rica
  '507': '🇵🇦',    // Panama
  '508': '🇵🇲',    // Saint Pierre and Miquelon
  '509': '🇭🇹',    // Haiti
  '590': '🇬🇵',    // Guadeloupe
  '591': '🇧🇴',    // Bolivia
  '592': '🇬🇾',    // Guyana
  '593': '🇪🇨',    // Ecuador
  '594': '🇬🇫',    // French Guiana
  '595': '🇵🇾',    // Paraguay
  '596': '🇲🇶',    // Martinique
  '597': '🇸🇷',    // Suriname
  '598': '🇺🇾',    // Uruguay
  '599': '🇨🇼',    // Curaçao
  '670': '🇹🇱',    // Timor-Leste
  '672': '🇳🇫',    // Norfolk Island
  '673': '🇧🇳',    // Brunei
  '674': '🇳🇷',    // Nauru
  '675': '🇵🇬',    // Papua New Guinea
  '676': '🇹🇴',    // Tonga
  '677': '🇸🇧',    // Solomon Islands
  '678': '🇻🇺',    // Vanuatu
  '679': '🇫🇯',    // Fiji
  '680': '🇵🇼',    // Palau
  '681': '🇼🇫',    // Wallis and Futuna
  '682': '🇨🇰',    // Cook Islands
  '683': '🇳🇺',    // Niue
  '685': '🇼🇸',    // Samoa
  '686': '🇰🇮',    // Kiribati
  '687': '🇳🇨',    // New Caledonia
  '688': '🇹🇻',    // Tuvalu
  '689': '🇵🇫',    // French Polynesia
  '690': '🇹🇰',    // Tokelau
  '691': '🇫🇲',    // Micronesia
  '692': '🇲🇭',    // Marshall Islands
  '850': '🇰🇵',    // North Korea
  '852': '🇭🇰',    // Hong Kong
  '853': '🇲🇴',    // Macau
  '855': '🇰🇭',    // Cambodia
  '856': '🇱🇦',    // Laos
  '880': '🇧🇩',    // Bangladesh
  '886': '🇹🇼',    // Taiwan
  '960': '🇲🇻',    // Maldives
  '961': '🇱🇧',    // Lebanon
  '962': '🇯🇴',    // Jordan
  '963': '🇸🇾',    // Syria
  '964': '🇮🇶',    // Iraq
  '965': '🇰🇼',    // Kuwait
  '966': '🇸🇦',    // Saudi Arabia
  '967': '🇾🇪',    // Yemen
  '968': '🇴🇲',    // Oman
  '970': '🇵🇸',    // Palestine
  '971': '🇦🇪',    // UAE
  '972': '🇵🇸',    // New Palestine
  '973': '🇧🇭',    // Bahrain
  '974': '🇶🇦',    // Qatar
  '975': '🇧🇹',    // Bhutan
  '976': '🇲🇳',    // Mongolia
  '977': '🇳🇵',    // Nepal
  '992': '🇹🇯',    // Tajikistan
  '993': '🇹🇲',    // Turkmenistan
  '994': '🇦🇿',    // Azerbaijan
  '995': '🇬🇪',    // Georgia
  '996': '🇰🇬',    // Kyrgyzstan
  '998': '🇺🇿'     // Uzbekistan
};

/**
 * Get flag emoji for a country code
 * @param {string} countryCode - Country calling code (without +)
 * @returns {string} Flag emoji or empty string if not found
 */
window.getFlagForCountryCode = function(countryCode) {
  return window.PHONE_COUNTRY_FLAGS[countryCode] || '';
};

/**
 * Get flag emoji from a normalized phone number
 * @param {string} phone - Normalized phone number (digits only, no +)
 * @returns {string} Flag emoji or empty string if country not found
 */
window.getFlagFromPhone = function(phone) {
  var digits = phone.replace(/^\+/, '').replace(/[\s\-]/g, '');

  // Check 3-digit, then 2-digit, then 1-digit country codes
  for (var len = 3; len >= 1; len--) {
    var prefix = digits.slice(0, len);
    if (window.PHONE_COUNTRY_FLAGS[prefix]) {
      return window.PHONE_COUNTRY_FLAGS[prefix];
    }
  }
  return '';
};

// Country codes (1-3 digits)
window.PHONE_COUNTRY_CODES = [
  '1', '7', '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46', '47', '48', '49',
  '51', '52', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63', '64', '65', '66', '81', '82', '84', '86', '90', '91', '92', '93', '94', '95', '98',
  '211', '212', '213', '216', '218', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '247', '248', '249', '250', '251', '252', '253', '254', '255', '256', '257', '258', '260', '261', '262', '263', '264', '265', '266', '267', '268', '269',
  '290', '291', '297', '298', '299', '350', '351', '352', '353', '354', '355', '356', '357', '358', '359', '370', '371', '372', '373', '374', '375', '376', '377', '378', '380', '381', '382', '383', '385', '386', '387', '389',
  '420', '421', '423', '500', '501', '502', '503', '504', '505', '506', '507', '508', '509', '590', '591', '592', '593', '594', '595', '596', '597', '598', '599',
  '670', '672', '673', '674', '675', '676', '677', '678', '679', '680', '681', '682', '683', '685', '686', '687', '688', '689', '690', '691', '692',
  '850', '852', '853', '855', '856', '880', '886', '960', '961', '962', '963', '964', '965', '966', '967', '968', '970', '971', '972', '973', '974', '975', '976', '977', '992', '993', '994', '995', '996', '998'
];

/**
 * Format a phone number for display with country code separation and digit grouping
 * @param {string} phone - Phone number (with or without + prefix)
 * @returns {string} Formatted phone number like "+962 782 760 965"
 */
window.formatPhoneDisplay = function(phone) {
  var digits = phone.replace(/^\+/, '');

  // Find matching country code (check 3-digit, then 2-digit, then 1-digit)
  var countryCode = '';
  for (var len = 3; len >= 1; len--) {
    var prefix = digits.slice(0, len);
    if (window.PHONE_COUNTRY_CODES.indexOf(prefix) !== -1) {
      countryCode = prefix;
      break;
    }
  }

  if (!countryCode) {
    return phone.startsWith('+') ? phone : '+' + phone;
  }

  var rest = digits.slice(countryCode.length);
  // Group remaining digits in chunks of 3
  var groups = rest.match(/.{1,3}/g) || [];
  return '+' + countryCode + ' ' + groups.join(' ');
};
