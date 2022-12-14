const Contact = require('../../models/contact');
const dbConnect = require('../../db');

jest.setTimeout(30000);

describe('Contacts DB connection', () => {
    beforeAll((done) => {
        if (dbConnect.readyState == 1) {
            done();
        } else {
            dbConnect.on("connected", () => done());
        }
    });

    beforeEach(async () => {
        await Contact.deleteMany({});
    });

    it('writes a contact in the DB', async () => {
        const contact = new Contact({name: 'pepe', phone: '767676'});
        await contact.save();
        contacts = await Contact.find();
        expect(contacts).toBeArrayOfSize(1);
    });

    afterAll(async () => {
        if (dbConnect.readyState == 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});