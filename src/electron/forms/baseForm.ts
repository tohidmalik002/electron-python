import { saveFormData } from '../util.js';


export class BaseForm {
    protected client: any;
    protected data: any;
  
    constructor(client: any, formData: any) {
      this.client = client;
      this.data = formData;
    }
  
    async save(kwargs: any|{}) {
      const { configs } = kwargs;
  

      await this.validate();
      await this.beforeSave();
  
      const result = await saveFormData(this.client, this.data, configs);
  
      await this.afterSave();
  
      return result;
    }
    async delete(kwargs: any|{}) {
        const { configs } = kwargs;
    
        await this.beforeDelete();
        const result = await saveFormData(this.client, this.data, configs);
        await this.afterDelete();
        return result;
      }
  
    protected async validate() {
    }
  
    protected async beforeSave() {
    }
  
    protected async afterSave() {
    }
  
    protected async beforeDelete() {
    }
  
    protected async afterDelete() {
      // Add post-delete logic using this.formData
    }
  }
  