import HARAdapter from '../src/HARAdapter.js';
let mockDataPath = 'MampHome.har';
describe('HAR Adapter', () => {
    let adapter;
    before(() => { 
        adapter = new HARAdapter();
    });
    it('Should be able to read the HAR file', () => { 
        adapter.read('MockData')
    });
    it('Should be able to validate the HAR file');
});