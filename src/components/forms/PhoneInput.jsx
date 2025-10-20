import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parsePhoneNumber, AsYouType } from 'libphonenumber-js';

/**
 * International phone input with country picker
 * Default country: Nigeria (+234)
 * Stores full E.164 format, displays national format
 */
const PhoneInput = React.forwardRef(({
  value,
  onChange,
  onBlur,
  className,
  disabled,
  defaultCountry = 'NG',
  ...props
}, ref) => {
  const [country, setCountry] = useState(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState('');

  const countries = [
    { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
    { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
    { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
    { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
    { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩' },
    { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
    { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
    { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲' },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
    { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
    { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿' },
    { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
    { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
    { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾' },
    { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
    { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯' },
    { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹' },
    { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
    { code: 'BA', name: 'Bosnia', dialCode: '+387', flag: '🇧🇦' },
    { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
    { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳' },
    { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
    { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
    { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
    { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭' },
    { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
    { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
    { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩' },
    { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
    { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
    { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬' },
    { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
    { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
    { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
    { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾' },
    { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
    { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
    { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
    { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
    { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
    { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
    { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶' },
    { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
    { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
    { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
    { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
    { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
    { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
    { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪' },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
    { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
    { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
    { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
    { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
    { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
    { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹' },
    { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
    { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
    { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸' },
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
    { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' },
    { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
    { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
    { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
    { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
    { code: 'CI', name: 'Ivory Coast', dialCode: '+225', flag: '🇨🇮' },
    { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲' },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
    { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
    { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
    { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
    { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
    { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬' },
    { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
    { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
    { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
    { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
    { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
    { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
    { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
    { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
    { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
    { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
    { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻' },
    { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
    { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹' },
    { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
    { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
    { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩' },
    { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨' },
    { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳' },
    { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪' },
    { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
    { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
    { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
    { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
    { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
    { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
    { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
    { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
    { code: 'KP', name: 'North Korea', dialCode: '+850', flag: '🇰🇵' },
    { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
    { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
    { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
    { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸' },
    { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦' },
    { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
    { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
    { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
    { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
    { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
    { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
    { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
    { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
    { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
    { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
    { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
    { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
    { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
    { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰' },
    { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
    { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
    { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
    { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
    { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸' },
    { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
    { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
    { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
    { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
    { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
    { code: 'SY', name: 'Syria', dialCode: '+963', flag: '🇸🇾' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼' },
    { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯' },
    { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
    { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
    { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
    { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
    { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
    { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲' },
    { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
    { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
    { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
    { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿' },
    { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
    { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
    { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
    { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
    { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' },
  ];

  const currentCountry = countries.find(c => c.code === country) || countries[0];

  // Parse incoming value to display format
  useEffect(() => {
    if (value) {
      try {
        const parsed = parsePhoneNumber(value);
        if (parsed) {
          setCountry(parsed.country || defaultCountry);
          setPhoneNumber(parsed.nationalNumber);
        } else {
          setPhoneNumber(value);
        }
      } catch {
        setPhoneNumber(value);
      }
    } else {
      setPhoneNumber('');
    }
  }, [value, defaultCountry]);

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    
    // Format as you type
    const formatter = new AsYouType(country);
    const formatted = formatter.input(input);
    
    setPhoneNumber(input);

    // Build E.164 format for storage
    try {
      const parsed = parsePhoneNumber(input, country);
      if (parsed && parsed.isValid()) {
        onChange?.(parsed.format('E.164'));
      } else {
        // Still pass the raw value even if not valid yet
        onChange?.(`${currentCountry.dialCode}${input.replace(/\D/g, '')}`);
      }
    } catch {
      onChange?.(`${currentCountry.dialCode}${input.replace(/\D/g, '')}`);
    }
  };

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    // Reformat phone number for new country
    if (phoneNumber) {
      try {
        const newCountryData = countries.find(c => c.code === newCountry);
        const fullNumber = `${newCountryData.dialCode}${phoneNumber.replace(/\D/g, '')}`;
        const parsed = parsePhoneNumber(fullNumber);
        if (parsed && parsed.isValid()) {
          onChange?.(parsed.format('E.164'));
        }
      } catch {
        // Keep existing
      }
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small delay to ensure dropdown is rendered
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Clear search when dropdown closes
      setSearchQuery('');
    }
  }, [isOpen]);

  // Keep focus on search input
  useEffect(() => {
    if (isOpen && searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchQuery, isOpen]);

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dialCode.includes(searchQuery) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-[140px] justify-between border-2 border-black rounded-none"
            disabled={disabled}
          >
            <span className="flex items-center gap-2">
              <span>{currentCountry.flag}</span>
              <span className="text-sm">{currentCountry.dialCode}</span>
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="p-2 border-b">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 border-2 border-black rounded-none"
              autoComplete="off"
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <div
                  key={c.code}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-gray-100 text-sm",
                    country === c.code && "bg-gray-100"
                  )}
                  onClick={() => {
                    handleCountryChange(c.code);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      country === c.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-gray-500">{c.dialCode}</span>
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500 text-center">
                No countries found
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Input
        ref={ref}
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder="803 123 4567"
        className="flex-1 border-2 border-black rounded-none"
        {...props}
      />
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;

