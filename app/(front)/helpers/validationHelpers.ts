// utils/validationHelper.ts

// --- Character sanitization with extended support (accents, etc.)
export const sanitizeText = (value: string): string =>
    value
      .replace(/[^a-zA-ZÀ-ÿ\s.'-]/g, '') // Allow basic Latin + accented characters
      .replace(/\s{2,}/g, ' ')           // Collapse multiple spaces
      .trim();
  
  // --- Junk and spammy input detection
  export const isLikelyJunk = (value: string): boolean => {
    const lowered = value.toLowerCase();
    const junkPatterns = [
      /asdf/, /qwerty/, /test/, /lorem/, /dummy/,
      /(.)\1{3,}/,        // repeated letters: aaaa, xxxx
      /^[a-z]{1,2}$/i,    // too short alpha (e.g. "aa", "q")
      /^.{1,2}$/,         // any 1-2 char value
    ];
    return junkPatterns.some((pattern) => pattern.test(lowered));
  };
  
  // --- Optional basic profanity filter (expand as needed)
  const bannedWords = ['shit', 'fuck', 'bitch', 'nude', 'xxx']; // Add more
  export const containsProfanity = (value: string): boolean =>
    bannedWords.some((word) => value.toLowerCase().includes(word));
  
  // --- Name validation core function
  export const validateName = (
    value: string,
    minLength: number = 3,
    maxLength: number = 50
  ): true | string => {
    const cleaned = sanitizeText(value);
    if (!cleaned) return 'Full name is required';
    if (cleaned.length < minLength) return `Name must be at least ${minLength} characters`;
    if (cleaned.length > maxLength) return `Name must be no more than ${maxLength} characters`;
    if (isLikelyJunk(cleaned)) return 'Please enter a valid name';
    if (containsProfanity(cleaned)) return 'Inappropriate content detected';
    return true;
  };
  
  // --- Address validation core function
  export const validateAddress = (
    value: string,
    minLength: number = 5,
    maxLength: number = 100
  ): true | string => {
    const cleaned = sanitizeText(value);
    if (!cleaned) return 'Address is required';
    if (cleaned.length < minLength) return `Address must be at least ${minLength} characters`;
    if (cleaned.length > maxLength) return `Address must be no more than ${maxLength} characters`;
    if (isLikelyJunk(cleaned)) return 'Please enter a valid address';
    if (containsProfanity(cleaned)) return 'Inappropriate content detected';
    return true;
  };
  
  // --- City validation core function
  export const validateCity = (
    value: string,
    minLength: number = 2,
    maxLength: number = 50
  ): true | string => {
    const cleaned = value.trim();
  
    if (!cleaned) return 'City is required';
    if (cleaned.length < minLength) return `City name must be at least ${minLength} characters`;
    if (cleaned.length > maxLength) return `City name must be no more than ${maxLength} characters`;
  
    if (!/^[a-zA-Z\s.'-]*$/.test(cleaned)) {
      return 'Only letters, spaces, periods, apostrophes, and hyphens are allowed';
    }
  
    if (isLikelyJunk(cleaned)) return 'Please enter a valid city name';
    if (containsProfanity(cleaned)) return 'Inappropriate content detected';
  
    return true;
  };







  export const validateGSTIN = (value?: string): true | string => {
    if (!value) return 'GST Number is required';
  
    const cleaned = value.trim().toUpperCase();
  
    if (cleaned.length !== 15) return 'GST Number must be exactly 15 characters';
  
    const gstinRegex = /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  
    if (!gstinRegex.test(cleaned)) return 'Invalid GST Number format';
  
    return true;
  };
  
  
  export const createGSTINValidator = () => (value: string) => validateGSTIN(value);

  


  export const validatePostalCode = (value: string): true | string => {
    const cleaned = value.trim(); // Only trims whitespace
  
    if (!cleaned) return 'Postal code is required';
    if (!/^[1-9][0-9]{5}$/.test(cleaned)) return 'Enter a valid 6-digit Indian PIN code';
  
    return true;
  };
  
  export const createPostalCodeValidator = () => (value: string) => validatePostalCode(value);
  
  





  export const validateLandmark = (value?: string): true | string => {
    const cleaned = value?.trim() ?? '';
  
    if (!cleaned) return true; // Optional field — valid if empty
  
    if (cleaned.length > 30) return 'Landmark must be 30 characters or less';
  
    // Allow letters, numbers, spaces, commas, periods, apostrophes, and hyphens
    if (!/^[a-zA-Z0-9\s.,'-]*$/.test(cleaned)) {
      return 'Only letters, numbers, commas, periods, and spaces are allowed';
    }
  
    if (isLikelyJunk(cleaned)) return 'Please enter a valid landmark';
    if (containsProfanity(cleaned)) return 'Inappropriate content detected';
  
    return true;
  };
  
  export const createLandmarkValidator = () => (value?: string) => validateLandmark(value);
  

  






  

  


  
  // --- Curried validators for direct RHF use
  export const createNameValidator = (
    minLength = 3,
    maxLength = 50
  ) => (value: string) => validateName(value, minLength, maxLength);
  
  export const createAddressValidator = (
    minLength = 5,
    maxLength = 100
  ) => (value: string) => validateAddress(value, minLength, maxLength);
  
  export const createCityValidator = (
    minLength = 2,
    maxLength = 50
  ) => (value: string) => validateCity(value, minLength, maxLength);
  
  // --- Export all helpers
  export const TextValidationHelper = {
    sanitizeText,
    isLikelyJunk,
    containsProfanity,
    validateName,
    validateAddress,
    validateCity,
    validateGSTIN,
    createNameValidator,
    createAddressValidator,
    createCityValidator,
    createPostalCodeValidator,
    createLandmarkValidator,
    createGSTINValidator
  };
  