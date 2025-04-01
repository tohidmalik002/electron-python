import Store from "electron-store";
import crypto from "crypto";

const secretKey = crypto.createHash('sha256').update('electropython').digest();
const ivLength = 16; 

function encryptData(data: string) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv); 
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

function decryptData(encryptedData: string, ivHex: string) {
  const iv = Buffer.from(ivHex, 'hex'); 
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function setDbCredentials(kwargs: any) {
  const host = kwargs.host ? encryptData(kwargs.host) : null;
  const port = kwargs.port ? encryptData(kwargs.port) : null;
  const db_name = kwargs.db_name ? encryptData(kwargs.db_name) : null;
  const user = kwargs.user ? encryptData(kwargs.user) : null;
  const password = kwargs.password ? encryptData(kwargs.password) : null;

  const store = new Store();
  store.set('dbCredentials', { host, port, db_name, user, password });

  return { status: "success" };
}

export function getDbCredentials() {
  const store = new Store();
  const encryptedCredentials:any = store.get('dbCredentials');

  if (!encryptedCredentials) {
    return { status: "error", message: "No DB credentials found" };
  }

  const decryptedCredentials: any = {};
  if (encryptedCredentials.host) {
    decryptedCredentials.host = decryptData(encryptedCredentials.host.encryptedData, encryptedCredentials.host.iv);
  }
  if (encryptedCredentials.port) {
    decryptedCredentials.port = decryptData(encryptedCredentials.port.encryptedData, encryptedCredentials.port.iv);
  }
  if (encryptedCredentials.db_name) {
    decryptedCredentials.db_name = decryptData(encryptedCredentials.db_name.encryptedData, encryptedCredentials.db_name.iv);
  }
  if (encryptedCredentials.user) {
    decryptedCredentials.user = decryptData(encryptedCredentials.user.encryptedData, encryptedCredentials.user.iv);
  }
  if (encryptedCredentials.password) {
    decryptedCredentials.password = decryptData(encryptedCredentials.password.encryptedData, encryptedCredentials.password.iv);
  }

  return { status: "success", "dbCredentials": decryptedCredentials };
}
