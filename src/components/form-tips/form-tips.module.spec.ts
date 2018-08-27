import {FormTipsModule} from './form-tips.module';

describe('FormTipsModule', () => {
  let formTipsModule: FormTipsModule;

  beforeEach(() => {
    formTipsModule = new FormTipsModule();
  });

  it('should create an instance', () => {
    expect(formTipsModule).toBeTruthy();
  });
});
