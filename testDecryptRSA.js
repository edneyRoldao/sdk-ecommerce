const crypto = require("crypto");

const public = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxOF8Zrx0sUhFqWiAt1SvLmlfH3uikxVmDZTESHz7W+D6kFDuuseXKCozamB7URSui2iW2Tkul3lRLDQWuS1GFj7CHdRVMxPFo5yYX15Zrwqz8cdu3Q7AMvzDjYeBdyeYAaZyNu0rub0yfd8RDmMy6RZxc3PXA8nJs6tEjLn7XLQIDAQAB";

const data = {
    status: 'paid'
};

const content = JSON.stringify(data);
const contentBuffer = Buffer.from(content);

crypto.verify("SHA1WithRSA", contentBuffer, {
    key: public,
    padding: crypto.constants.RSA_NO_PADDING
})

