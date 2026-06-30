function isValidPhoneNumber(phoneNumber: string | undefined): boolean {
    if (!phoneNumber) {
        return false;
    }
    
    const pattern = /^[+]?[0-9\s\-().\/]{6,15}[0-9]$/;
    return pattern.test(phoneNumber);
}

export { isValidPhoneNumber };
