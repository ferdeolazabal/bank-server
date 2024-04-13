import { json2csv } from "json-2-csv";
import { mkdirp } from "fs-extra";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export default class ConverToCSVHelper {
  async convertToCSV(entityArray: any[], entityName: string, delimiter?: any) {
    const id = uuidv4();
    const fieldDelimiter = {
      delimiter: { field: delimiter || "," },
    };
    const fileToWrite = json2csv(entityArray, fieldDelimiter);
    const path = `temp/${entityName}/${id}.csv`;
    if (!fs.existsSync(path)) {
      await mkdirp(`temp/${entityName}/`);
    }
    fs.writeFileSync(path, fileToWrite, "utf-8");
    return path;
  }
}
