


const useCredentialCheck = (username: string | undefined, password: string | undefined): boolean => {

    let check: boolean = false;

    if (username === undefined || password === undefined) {
        check = false;
    }
    else if (username == '' || password == '') {
        check = false;
    }
    else if (username != '' && password != '') {
        check = true;
    }

    return check;
}






export { useCredentialCheck };