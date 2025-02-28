import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Map full country names, adjectivals, and variations to their ISO 3166-1 alpha-2 codes
const countryCodeMap: Record<string, string> = {
  // Standard country names
  "Afghanistan": "af",
  "Albania": "al",
  "Algeria": "dz",
  "Andorra": "ad",
  "Angola": "ao",
  "Argentina": "ar",
  "Armenia": "am",
  "Australia": "au",
  "Austria": "at",
  "Azerbaijan": "az",
  "Bahamas": "bs",
  "Bahrain": "bh",
  "Bangladesh": "bd",
  "Barbados": "bb",
  "Belarus": "by",
  "Belgium": "be",
  "Belize": "bz",
  "Bhutan": "bt",
  "Bolivia": "bo",
  "Bosnia": "ba",
  "Bosnia and Herzegovina": "ba",
  "Botswana": "bw",
  "Brazil": "br",
  "Brunei": "bn",
  "Bulgaria": "bg",
  "Cambodia": "kh",
  "Cameroon": "cm",
  "Canada": "ca",
  "Chile": "cl",
  "China": "cn",
  "Colombia": "co",
  "Costa Rica": "cr",
  "Croatia": "hr",
  "Cuba": "cu",
  "Cyprus": "cy",
  "Czech Republic": "cz",
  "Denmark": "dk",
  "Dominican Republic": "do",
  "Ecuador": "ec",
  "Egypt": "eg",
  "El Salvador": "sv",
  "Estonia": "ee",
  "Ethiopia": "et",
  "Fiji": "fj",
  "Finland": "fi",
  "France": "fr",
  "Georgia": "ge",
  "Germany": "de",
  "Ghana": "gh",
  "Greece": "gr",
  "Guatemala": "gt",
  "Haiti": "ht",
  "Honduras": "hn",
  "Hong Kong": "hk",
  "Hungary": "hu",
  "Iceland": "is",
  "India": "in",
  "Indonesia": "id",
  "Iran": "ir",
  "Iraq": "iq",
  "Ireland": "ie",
  "Israel": "il",
  "Italy": "it",
  "Jamaica": "jm",
  "Japan": "jp",
  "Jordan": "jo",
  "Kazakhstan": "kz",
  "Kenya": "ke",
  "Kuwait": "kw",
  "Kyrgyzstan": "kg",
  "Laos": "la",
  "Latvia": "lv",
  "Lebanon": "lb",
  "Libya": "ly",
  "Liechtenstein": "li",
  "Lithuania": "lt",
  "Luxembourg": "lu",
  "Macedonia": "mk",
  "Madagascar": "mg",
  "Malaysia": "my",
  "Maldives": "mv",
  "Mali": "ml",
  "Malta": "mt",
  "Mexico": "mx",
  "Moldova": "md",
  "Monaco": "mc",
  "Mongolia": "mn",
  "Montenegro": "me",
  "Morocco": "ma",
  "Myanmar": "mm",
  "Nepal": "np",
  "Netherlands": "nl",
  "New Zealand": "nz",
  "Nicaragua": "ni",
  "Nigeria": "ng",
  "North Korea": "kp",
  "Norway": "no",
  "Oman": "om",
  "Pakistan": "pk",
  "Palestine": "ps",
  "Panama": "pa",
  "Papua New Guinea": "pg",
  "Paraguay": "py",
  "Peru": "pe",
  "Philippines": "ph",
  "Poland": "pl",
  "Portugal": "pt",
  "Puerto Rico": "pr",
  "Qatar": "qa",
  "Romania": "ro",
  "Russia": "ru",
  "Rwanda": "rw",
  "Saudi Arabia": "sa",
  "Senegal": "sn",
  "Serbia": "rs",
  "Singapore": "sg",
  "Slovakia": "sk",
  "Slovenia": "si",
  "Somalia": "so",
  "South Africa": "za",
  "South Korea": "kr",
  "Spain": "es",
  "Sri Lanka": "lk",
  "Sudan": "sd",
  "Sweden": "se",
  "Switzerland": "ch",
  "Syria": "sy",
  "Taiwan": "tw",
  "Tajikistan": "tj",
  "Tanzania": "tz",
  "Thailand": "th",
  "Tunisia": "tn",
  "Turkey": "tr",
  "Turkmenistan": "tm",
  "Uganda": "ug",
  "Ukraine": "ua",
  "United Arab Emirates": "ae",
  "UAE": "ae",
  "United Kingdom": "gb",
  "UK": "gb",
  "United States": "us",
  "USA": "us",
  "Uruguay": "uy",
  "Uzbekistan": "uz",
  "Venezuela": "ve",
  "Vietnam": "vn",
  "Yemen": "ye",
  "Zambia": "zm",
  "Zimbabwe": "zw",
  
  // Sri Lanka variations
  "Srilanka": "lk",
  "SriLanka": "lk",
  "Srilankan": "lk",
  "Sri Lankan": "lk",
  "Ceylon": "lk",
  
  // Adjectival forms and common variations
  "American": "us",
  "British": "gb",
  "Canadian": "ca",
  "Chinese": "cn",
  "Dutch": "nl",
  "English": "gb",
  "French": "fr",
  "German": "de",
  "Indian": "in",
  "Indonesian": "id",
  "Irish": "ie",
  "Italian": "it",
  "Japanese": "jp",
  "Korean": "kr",
  "Mexican": "mx",
  "Russian": "ru",
  "Scottish": "gb",
  "Spanish": "es",
  "Swiss": "ch",
  "Thai": "th",
  "Welsh": "gb",
  "Filipino": "ph",
  "Kiwi": "nz",
  "Aussie": "au",
  "Australian": "au"
};

// Also handle ISO codes directly
const isoCodeMap: Record<string, string> = {
  "AF": "af", "AL": "al", "DZ": "dz", "AD": "ad", "AO": "ao", "AR": "ar",
  "AM": "am", "AU": "au", "AT": "at", "AZ": "az", "BS": "bs", "BH": "bh",
  "BD": "bd", "BB": "bb", "BY": "by", "BE": "be", "BZ": "bz", "BJ": "bj",
  "BT": "bt", "BO": "bo", "BA": "ba", "BW": "bw", "BR": "br", "BN": "bn",
  "BG": "bg", "BF": "bf", "BI": "bi", "KH": "kh", "CM": "cm", "CA": "ca",
  "CV": "cv", "CF": "cf", "TD": "td", "CL": "cl", "CN": "cn", "CO": "co",
  "KM": "km", "CG": "cg", "CD": "cd", "CR": "cr", "CI": "ci", "HR": "hr",
  "CU": "cu", "CY": "cy", "CZ": "cz", "DK": "dk", "DJ": "dj", "DM": "dm",
  "DO": "do", "EC": "ec", "EG": "eg", "SV": "sv", "GQ": "gq", "ER": "er",
  "EE": "ee", "ET": "et", "FJ": "fj", "FI": "fi", "FR": "fr", "GA": "ga",
  "GM": "gm", "GE": "ge", "DE": "de", "GH": "gh", "GR": "gr", "GT": "gt",
  "GN": "gn", "GW": "gw", "GY": "gy", "HT": "ht", "HN": "hn", "HK": "hk", 
  "HU": "hu", "IS": "is", "IN": "in", "ID": "id", "IR": "ir", "IQ": "iq",
  "IE": "ie", "IL": "il", "IT": "it", "JM": "jm", "JP": "jp", "JO": "jo",
  "KZ": "kz", "KE": "ke", "KI": "ki", "KP": "kp", "KR": "kr", "KW": "kw",
  "KG": "kg", "LA": "la", "LV": "lv", "LB": "lb", "LS": "ls", "LR": "lr",
  "LY": "ly", "LI": "li", "LT": "lt", "LU": "lu", "MK": "mk", "MG": "mg",
  "MW": "mw", "MY": "my", "MV": "mv", "ML": "ml", "MT": "mt", "MH": "mh",
  "MR": "mr", "MU": "mu", "MX": "mx", "FM": "fm", "MD": "md", "MC": "mc",
  "MN": "mn", "ME": "me", "MA": "ma", "MZ": "mz", "MM": "mm", "NA": "na",
  "NR": "nr", "NP": "np", "NL": "nl", "NZ": "nz", "NI": "ni", "NE": "ne",
  "NG": "ng", "NO": "no", "OM": "om", "PK": "pk", "PW": "pw", "PS": "ps",
  "PA": "pa", "PG": "pg", "PY": "py", "PE": "pe", "PH": "ph", "PL": "pl",
  "PT": "pt", "PR": "pr", "QA": "qa", "RO": "ro", "RU": "ru", "RW": "rw",
  "KN": "kn", "LC": "lc", "VC": "vc", "WS": "ws", "SM": "sm", "ST": "st",
  "SA": "sa", "SN": "sn", "RS": "rs", "SC": "sc", "SL": "sl", "SG": "sg",
  "SK": "sk", "SI": "si", "SB": "sb", "SO": "so", "ZA": "za", "SS": "ss",
  "ES": "es", "LK": "lk", "SD": "sd", "SR": "sr", "SZ": "sz", "SE": "se",
  "CH": "ch", "SY": "sy", "TW": "tw", "TJ": "tj", "TZ": "tz", "TH": "th",
  "TL": "tl", "TG": "tg", "TO": "to", "TT": "tt", "TN": "tn", "TR": "tr",
  "TM": "tm", "TV": "tv", "UG": "ug", "UA": "ua", "AE": "ae", "GB": "gb",
  "US": "us", "UY": "uy", "UZ": "uz", "VU": "vu", "VA": "va", "VE": "ve",
  "VN": "vn", "YE": "ye", "ZM": "zm", "ZW": "zw"
};

// 3-letter ISO codes (ISO 3166-1 alpha-3)
const iso3CodeMap: Record<string, string> = {
  "AFG": "af", "ALB": "al", "DZA": "dz", "AND": "ad", "AGO": "ao",
  "ARG": "ar", "ARM": "am", "AUS": "au", "AUT": "at", "AZE": "az",
  "BHS": "bs", "BHR": "bh", "BGD": "bd", "BRB": "bb", "BLR": "by",
  "BEL": "be", "BLZ": "bz", "BEN": "bj", "BTN": "bt", "BOL": "bo",
  "BIH": "ba", "BWA": "bw", "BRA": "br", "BRN": "bn", "BGR": "bg",
  "BFA": "bf", "BDI": "bi", "KHM": "kh", "CMR": "cm", "CAN": "ca",
  "CPV": "cv", "CAF": "cf", "TCD": "td", "CHL": "cl", "CHN": "cn",
  "COL": "co", "COM": "km", "COG": "cg", "COD": "cd", "CRI": "cr",
  "CIV": "ci", "HRV": "hr", "CUB": "cu", "CYP": "cy", "CZE": "cz",
  "DNK": "dk", "DJI": "dj", "DMA": "dm", "DOM": "do", "ECU": "ec",
  "EGY": "eg", "SLV": "sv", "GNQ": "gq", "ERI": "er", "EST": "ee",
  "ETH": "et", "FJI": "fj", "FIN": "fi", "FRA": "fr", "GAB": "ga",
  "GMB": "gm", "GEO": "ge", "DEU": "de", "GHA": "gh", "GRC": "gr", 
  "GTM": "gt", "GIN": "gn", "GNB": "gw", "GUY": "gy", "HTI": "ht",
  "HND": "hn", "HKG": "hk", "HUN": "hu", "ISL": "is", "IND": "in",
  "IDN": "id", "IRN": "ir", "IRQ": "iq", "IRL": "ie", "ISR": "il",
  "ITA": "it", "JAM": "jm", "JPN": "jp", "JOR": "jo", "KAZ": "kz",
  "KEN": "ke", "KIR": "ki", "PRK": "kp", "KOR": "kr", "KWT": "kw",
  "KGZ": "kg", "LAO": "la", "LVA": "lv", "LBN": "lb", "LSO": "ls",
  "LBR": "lr", "LBY": "ly", "LIE": "li", "LTU": "lt", "LUX": "lu",
  "MKD": "mk", "MDG": "mg", "MWI": "mw", "MYS": "my", "MDV": "mv",
  "MLI": "ml", "MLT": "mt", "MHL": "mh", "MRT": "mr", "MUS": "mu",
  "MEX": "mx", "FSM": "fm", "MDA": "md", "MCO": "mc", "MNG": "mn",
  "MNE": "me", "MAR": "ma", "MOZ": "mz", "MMR": "mm", "NAM": "na",
  "NRU": "nr", "NPL": "np", "NLD": "nl", "NZL": "nz", "NIC": "ni",
  "NER": "ne", "NGA": "ng", "NOR": "no", "OMN": "om", "PAK": "pk",
  "PLW": "pw", "PSE": "ps", "PAN": "pa", "PNG": "pg", "PRY": "py",
  "PER": "pe", "PHL": "ph", "POL": "pl", "PRT": "pt", "PRI": "pr",
  "QAT": "qa", "ROU": "ro", "RUS": "ru", "RWA": "rw", "KNA": "kn",
  "LCA": "lc", "VCT": "vc", "WSM": "ws", "SMR": "sm", "STP": "st",
  "SAU": "sa", "SEN": "sn", "SRB": "rs", "SYC": "sc", "SLE": "sl",
  "SGP": "sg", "SVK": "sk", "SVN": "si", "SLB": "sb", "SOM": "so", 
  "ZAF": "za", "SSD": "ss", "ESP": "es", "LKA": "lk", "SDN": "sd",
  "SUR": "sr", "SWZ": "sz", "SWE": "se", "CHE": "ch", "SYR": "sy",
  "TWN": "tw", "TJK": "tj", "TZA": "tz", "THA": "th", "TLS": "tl",
  "TGO": "tg", "TON": "to", "TTO": "tt", "TUN": "tn", "TUR": "tr", 
  "TKM": "tm", "TUV": "tv", "UGA": "ug", "UKR": "ua", "ARE": "ae",
  "GBR": "gb", "USA": "us", "URY": "uy", "UZB": "uz", "VUT": "vu",
  "VAT": "va", "VEN": "ve", "VNM": "vn", "YEM": "ye", "ZMB": "zm",
  "ZWE": "zw"
};

// Normalized mapping for fuzzy matching
const normalizedMap: Record<string, string> = {};

// Initialize normalized map
const initNormalizedMap = () => {
  // Process country code map
  Object.entries(countryCodeMap).forEach(([country, code]) => {
    normalizedMap[normalizeString(country)] = code;
  });
  
  // Process ISO code map
  Object.entries(isoCodeMap).forEach(([isoCode, code]) => {
    normalizedMap[normalizeString(isoCode)] = code;
  });
  
  // Process ISO3 code map
  Object.entries(iso3CodeMap).forEach(([iso3Code, code]) => {
    normalizedMap[normalizeString(iso3Code)] = code;
  });
};

// Helper to normalize strings for comparison
function normalizeString(str: string): string {
  return str.toLowerCase()
    .replace(/\s+/g, '')     // Remove spaces
    .replace(/-/g, '')       // Remove hyphens
    .replace(/[^\w]/g, '');  // Remove non-alphanumeric
}

// Initialize map on first import
initNormalizedMap();

// Function to get correct flag code regardless of nationality format
const getFlagCode = (nationality: string | undefined | null): string => {
  if (!nationality) return 'un'; // Default to UN flag if no nationality
  
  const normalizedNationality = normalizeString(nationality);
  
  // Direct lookup in our normalized map
  if (normalizedMap[normalizedNationality]) {
    return normalizedMap[normalizedNationality];
  }
  
  // Special case handling
  if (normalizedNationality.includes('lanka') || 
      normalizedNationality.includes('sri') || 
      normalizedNationality.includes('ceylon')) {
    return 'lk';
  }
  
  if (normalizedNationality.includes('states') || 
      normalizedNationality.includes('america') || 
      normalizedNationality.includes('usa')) {
    return 'us';
  }
  
  if (normalizedNationality.includes('britain') || 
      normalizedNationality.includes('england') || 
      normalizedNationality.includes('kingdom')) {
    return 'gb';
  }
  
  // Try extracting substring for partial matches
  for (const [name, code] of Object.entries(countryCodeMap)) {
    if (normalizedNationality.includes(normalizeString(name))) {
      return code;
    }
  }
  
  // Fallback: try first two letters if they exist in our ISO map
  if (nationality.length >= 2) {
    const twoLetterCode = nationality.substring(0, 2).toUpperCase();
    if (isoCodeMap[twoLetterCode]) {
      return isoCodeMap[twoLetterCode];
    }
  }
  
  // Return UN flag as fallback
  return 'un';
};

interface NationalityDisplayProps {
  nationality: string | undefined | null;
  flagSize?: number;
  showText?: boolean;
  onPress?: () => void;
}

const NationalityDisplay: React.FC<NationalityDisplayProps> = ({ 
  nationality, 
  flagSize = 24,
  showText = true,
  onPress
}) => {
  if (!nationality) return null;
  
  const flagCode = getFlagCode(nationality);
  
  const content = (
    <View style={styles.countryContainer}>
      <Image
        source={{
          uri: `https://flagcdn.com/w20/${flagCode}.png`,
        }}
        style={[styles.flag, { width: flagSize, height: flagSize * 0.75 }]}
      />
      {showText && <Text style={styles.countryText}>{nationality}</Text>}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};

// Implementation for your profile screen
const ProfileNationalityDisplay: React.FC<{
  nationality: string | undefined | null;
}> = ({ nationality }) => {
  return nationality ? (
    <NationalityDisplay 
      nationality={nationality}
      flagSize={24}
      showText={true}
    />
  ) : null;
};

// Default exportable component
const CountryFlag: React.FC<{
  countryCode?: string;
  size?: number;
}> = ({ countryCode, size = 24 }) => {
  if (!countryCode) return null;
  
  const flagCode = getFlagCode(countryCode);
  
  return (
    <Image
      source={{
        uri: `https://flagcdn.com/w20/${flagCode}.png`,
      }}
      style={{ width: size, height: size * 0.75, borderRadius: 4 }}
    />
  );
};

const styles = StyleSheet.create({
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  flag: {
    width: 24,
    height: 18,
    marginRight: 8,
    borderRadius: 4,
  },
  countryText: {
    color: "#8b5cf6",
    fontWeight: "600",
    fontSize: 14,
  },
});

export { NationalityDisplay, CountryFlag, getFlagCode, ProfileNationalityDisplay };
export default NationalityDisplay;