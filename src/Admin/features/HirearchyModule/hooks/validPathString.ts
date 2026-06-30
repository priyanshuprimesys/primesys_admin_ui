function validPathString(path: string, idString: string) {
    if (idString) {
        
        const regex = new RegExp(`(,)?${idString}(,)?`, 'g');
        
        let str = path.replace(regex, (p1, p2) => {
            if (p1 && p2) {
                return ',';
            }
            return '';
        });
        
        if (str.endsWith(',')) {
            str = str.slice(0, -1);
        }
        
        return str;
    } else {
        return path;
    }
}

export default validPathString;
