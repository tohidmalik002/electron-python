export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function storeDB(args:any) {
 console.log(args)
}
