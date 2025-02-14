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
  const server = kwargs.server ? encryptData(kwargs.server) : null;
  const port = kwargs.port ? encryptData(kwargs.port) : null;
  const database = kwargs.database ? encryptData(kwargs.database) : null;
  const username = kwargs.username ? encryptData(kwargs.username) : null;
  const password = kwargs.password ? encryptData(kwargs.password) : null;

  const store = new Store();
  store.set('dbCredentials', { server, port, database, username, password });

  return { status: "success" };
}

export function getDbCredentials() {
  const store = new Store();
  const encryptedCredentials:any = store.get('dbCredentials');

  if (!encryptedCredentials) {
    return { status: "error", message: "No credentials found" };
  }

  const decryptedCredentials: any = {};
  if (encryptedCredentials.server) {
    decryptedCredentials.server = decryptData(encryptedCredentials.server.encryptedData, encryptedCredentials.server.iv);
  }
  if (encryptedCredentials.port) {
    decryptedCredentials.port = decryptData(encryptedCredentials.port.encryptedData, encryptedCredentials.port.iv);
  }
  if (encryptedCredentials.database) {
    decryptedCredentials.database = decryptData(encryptedCredentials.database.encryptedData, encryptedCredentials.database.iv);
  }
  if (encryptedCredentials.username) {
    decryptedCredentials.username = decryptData(encryptedCredentials.username.encryptedData, encryptedCredentials.username.iv);
  }
  if (encryptedCredentials.password) {
    decryptedCredentials.password = decryptData(encryptedCredentials.password.encryptedData, encryptedCredentials.password.iv);
  }

  return { status: "success", "dbCredentials": decryptedCredentials };
}
